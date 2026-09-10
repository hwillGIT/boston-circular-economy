import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ROOT_REAL_PATH = realpathSync(ROOT);
const MANIFEST_PATH = resolve(ROOT, 'docs/diagrams/manifest.json');
const DIAGRAM_TYPES = new Set(['architecture', 'workflow', 'sequence', 'dataflow', 'lifecycle']);

function isInsideRoot(path) {
  const pathFromRoot = relative(ROOT_REAL_PATH, path);
  return pathFromRoot === '' || (!pathFromRoot.startsWith('..') && !isAbsolute(pathFromRoot));
}

function requireText(value, name) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${name} must be a non-empty string.`);
  }
  return value;
}

function resolveSource(path, name) {
  const candidate = resolve(ROOT, requireText(path, name));
  if (!isInsideRoot(candidate) || !existsSync(candidate)) {
    throw new Error(`${name} must name an existing file inside the repository.`);
  }
  if (!isInsideRoot(realpathSync(candidate))) {
    throw new Error(`${name} must not resolve outside the repository.`);
  }
  return candidate;
}

function resolveOutput(path, name) {
  const candidate = resolve(ROOT, requireText(path, name));
  const parent = dirname(candidate);
  if (!isInsideRoot(parent) || !existsSync(parent) || !isInsideRoot(realpathSync(parent))) {
    throw new Error(`${name} must name a file inside an existing repository directory.`);
  }
  if (existsSync(candidate) && !isInsideRoot(realpathSync(candidate))) {
    throw new Error(`${name} must not resolve outside the repository.`);
  }
  return candidate;
}

function loadManifest() {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  if (manifest.schema_version !== 1 || !Array.isArray(manifest.diagrams)) {
    throw new Error('The Archify manifest has an unsupported shape.');
  }
  const ids = new Set();
  return manifest.diagrams.map((diagram) => {
    const id = requireText(diagram.id, 'diagram id');
    if (ids.has(id)) {
      throw new Error(`The Archify manifest repeats diagram id ${id}.`);
    }
    ids.add(id);
    const type = requireText(diagram.type, `${id} type`);
    if (!DIAGRAM_TYPES.has(type)) {
      throw new Error(`${id} has an unsupported Archify diagram type.`);
    }
    const source = resolveSource(diagram.source, `${id} source`);
    const output = resolveOutput(diagram.output, `${id} output`);
    if (!source.endsWith(`.${type}.json`) || !output.endsWith(`.${type}.html`)) {
      throw new Error(`${id} source and output must use the ${type} file suffixes.`);
    }
    const sourceSpec = JSON.parse(readFileSync(source, 'utf8'));
    if (sourceSpec.diagram_type !== type || sourceSpec.meta?.output !== diagram.output) {
      throw new Error(`${id} manifest and source metadata disagree.`);
    }
    if (typeof diagram.verify_repository !== 'boolean') {
      throw new Error(`${id} verify_repository must be a boolean.`);
    }
    return { id, type, source, output, verifyRepository: diagram.verify_repository };
  });
}

function runArchify(diagram) {
  const command = [
    '.agents/skills/archify/bin/archify.mjs',
    'deliver',
    diagram.type,
    diagram.source,
    diagram.output,
    '--quality',
    'showcase',
    '--json',
  ];
  if (diagram.verifyRepository) {
    command.push('--repo-root', ROOT);
  }
  console.log(`Archify: ${diagram.id}`);
  const completed = spawnSync(process.execPath, command, {
    cwd: ROOT,
    env: { ...process.env, ARCHIFY_UPDATE_CHECK_DISABLED: '1' },
    stdio: 'inherit',
  });
  if (completed.error || completed.status !== 0) {
    throw completed.error ?? new Error(`Archify failed for ${diagram.id}.`);
  }
}

function requireTrackedFiles(diagrams) {
  const files = diagrams.flatMap((diagram) => [
    relative(ROOT, diagram.source),
    relative(ROOT, diagram.output),
  ]);
  const completed = spawnSync('git', ['ls-files', '--error-unmatch', '--', ...files], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (completed.error || completed.status !== 0) {
    throw (
      completed.error ?? new Error('Commit each diagram source and HTML file before checking it.')
    );
  }
}

function requireCurrentOutputs(diagrams) {
  const outputs = diagrams.map((diagram) => relative(ROOT, diagram.output));
  const completed = spawnSync('git', ['diff', '--exit-code', '--', ...outputs], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (completed.error || completed.status !== 0) {
    throw (
      completed.error ??
      new Error('Archify changed checked diagram output. Commit the regenerated HTML files.')
    );
  }
}

const diagrams = loadManifest();
for (const diagram of diagrams) {
  runArchify(diagram);
}
requireTrackedFiles(diagrams);
requireCurrentOutputs(diagrams);
