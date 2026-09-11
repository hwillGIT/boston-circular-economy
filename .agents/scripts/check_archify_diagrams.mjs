import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ROOT_REAL_PATH = realpathSync(ROOT);
const MANIFEST_PATH = resolve(ROOT, 'docs/diagrams/manifest.json');
const DIAGRAM_TYPES = new Set(['architecture', 'workflow', 'sequence', 'dataflow', 'lifecycle']);
const REVISION = /^[a-f0-9]{40}$/i;
const SHA256 = /^[a-f0-9]{64}$/i;
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

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

function resolveRenderOutput(path, name) {
  const candidate = resolve(ROOT, requireText(path, name));
  if (!isInsideRoot(candidate)) {
    throw new Error(`${name} must name a file inside the repository.`);
  }
  const parent = dirname(candidate);
  mkdirSync(parent, { recursive: true });
  if (!isInsideRoot(realpathSync(parent))) {
    throw new Error(`${name} must not resolve outside the repository.`);
  }
  if (existsSync(candidate) && !isInsideRoot(realpathSync(candidate))) {
    throw new Error(`${name} must not resolve outside the repository.`);
  }
  return candidate;
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function checkReviewImage(path, id) {
  const image = readFileSync(path);
  if (image.length < 24 || !image.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error(`${id} review image must be a PNG file.`);
  }
  const width = image.readUInt32BE(16);
  const height = image.readUInt32BE(20);
  if (width < 640 || height < 400) {
    throw new Error(`${id} review image must be at least 640 by 400 pixels.`);
  }
}

function archifyBinary() {
  const configuredRoot = process.env.ARCHIFY_ROOT || '.archify-tool/archify';
  const root = isAbsolute(configuredRoot) ? configuredRoot : resolve(ROOT, configuredRoot);
  const binary = resolve(root, 'bin/archify.mjs');
  if (!existsSync(binary)) {
    throw new Error(
      `Archify is unavailable at ${root}. Check out the pinned renderer there or set ARCHIFY_ROOT.`,
    );
  }
  return binary;
}

function loadManifest() {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  if (
    manifest.schema_version !== 2 ||
    manifest.generator?.name !== 'archify' ||
    !REVISION.test(manifest.generator?.revision || '') ||
    !Array.isArray(manifest.diagrams)
  ) {
    throw new Error('The Archify manifest has an unsupported shape.');
  }
  const pinnedRevision = process.env.ARCHIFY_REVISION;
  if (pinnedRevision && pinnedRevision !== manifest.generator.revision) {
    throw new Error('ARCHIFY_REVISION must match the renderer revision in the diagram manifest.');
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
    const renderOutput = resolveRenderOutput(diagram.render_output, `${id} render output`);
    const reviewImage = resolveSource(diagram.review_image, `${id} review image`);
    const reviewImageSourceHash = requireText(
      diagram.review_image_source_sha256,
      `${id} review image source hash`,
    );
    if (!SHA256.test(reviewImageSourceHash)) {
      throw new Error(`${id} review image source hash must be a SHA-256 value.`);
    }
    if (
      !source.endsWith(`.${type}.json`) ||
      !renderOutput.endsWith(`.${type}.html`) ||
      !reviewImage.endsWith(`.${type}.png`)
    ) {
      throw new Error(`${id} source, render output, and review image use invalid file suffixes.`);
    }
    const sourceSpec = JSON.parse(readFileSync(source, 'utf8'));
    if (sourceSpec.diagram_type !== type || sourceSpec.meta?.output !== diagram.render_output) {
      throw new Error(`${id} manifest and source metadata disagree.`);
    }
    if (sha256(source) !== reviewImageSourceHash) {
      throw new Error(
        `${id} review image is stale. Refresh it after changing the diagram source, then update the manifest hash.`,
      );
    }
    checkReviewImage(reviewImage, id);
    if (typeof diagram.verify_repository !== 'boolean') {
      throw new Error(`${id} verify_repository must be a boolean.`);
    }
    if (typeof diagram.review_delta !== 'boolean') {
      throw new Error(`${id} review_delta must be a boolean.`);
    }
    return {
      id,
      type,
      source,
      renderOutput,
      reviewImage,
      verifyRepository: diagram.verify_repository,
    };
  });
}

function runArchify(diagram, binary) {
  const command = [
    binary,
    'deliver',
    diagram.type,
    diagram.source,
    diagram.renderOutput,
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
    relative(ROOT, diagram.reviewImage),
  ]);
  const completed = spawnSync('git', ['ls-files', '--error-unmatch', '--', ...files], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (completed.error || completed.status !== 0) {
    throw (
      completed.error ??
      new Error('Commit each diagram source and static review image before checking it.')
    );
  }
}

const diagrams = loadManifest();
const binary = archifyBinary();
for (const diagram of diagrams) {
  runArchify(diagram, binary);
}
requireTrackedFiles(diagrams);
