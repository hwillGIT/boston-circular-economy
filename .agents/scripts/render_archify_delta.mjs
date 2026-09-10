import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const MANIFEST_PATH = resolve(ROOT, 'docs/diagrams/manifest.json');
const REVISION = /^[a-f0-9]{40}$/i;

function argumentValue(name) {
  const position = process.argv.indexOf(name);
  return position === -1 ? undefined : process.argv[position + 1];
}

function requireRevision(name) {
  const value = argumentValue(name);
  if (!value || !REVISION.test(value)) {
    throw new Error(`${name} must be a 40-character Git commit identifier.`);
  }
  return value;
}

function architectureSource() {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  const diagrams = manifest.diagrams?.filter((diagram) => diagram.review_delta === true);
  if (!Array.isArray(diagrams) || diagrams.length !== 1 || diagrams[0].type !== 'architecture') {
    throw new Error('The Archify manifest must name one architecture delta source.');
  }
  return diagrams[0].source;
}

function gitFile(revision, source) {
  return spawnSync('git', ['show', `${revision}:${source}`], {
    cwd: ROOT,
    encoding: 'utf8',
  });
}

function reviewDirectory() {
  const root = process.env.RUNNER_TEMP
    ? resolve(process.env.RUNNER_TEMP, 'archify-review')
    : mkdtempSync(resolve(tmpdir(), 'archify-review-'));
  if (!existsSync(root)) {
    mkdirSync(root, { recursive: true });
  }
  return root;
}

const base = requireRevision('--base');
const head = requireRevision('--head');
const source = architectureSource();
const baseSource = gitFile(base, source);
if (baseSource.status !== 0) {
  console.log('Archify delta skipped because the base revision has no architecture source.');
  process.exit(0);
}
const headSource = gitFile(head, source);
if (headSource.status !== 0) {
  throw new Error('The pull request head has no architecture source.');
}
const outputDirectory = reviewDirectory();
const basePath = resolve(outputDirectory, 'base.architecture.json');
const headPath = resolve(outputDirectory, 'head.architecture.json');
const outputPath = resolve(outputDirectory, 'architecture-delta.html');
writeFileSync(basePath, baseSource.stdout, 'utf8');
writeFileSync(headPath, headSource.stdout, 'utf8');
const completed = spawnSync(
  process.execPath,
  [
    '.agents/skills/archify/bin/archify.mjs',
    'compare',
    'architecture',
    basePath,
    headPath,
    outputPath,
    '--repo-root',
    ROOT,
    '--json',
  ],
  {
    cwd: ROOT,
    env: { ...process.env, ARCHIFY_UPDATE_CHECK_DISABLED: '1' },
    stdio: 'inherit',
  },
);
if (completed.error || completed.status !== 0) {
  throw completed.error ?? new Error('Archify could not build the architecture delta.');
}
console.log(`Archify delta: ${outputPath}`);
