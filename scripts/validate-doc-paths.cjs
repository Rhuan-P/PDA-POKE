const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SCAN_ROOTS = ['README.md', 'CONTRIBUTING.md', 'docs', 'backlog'];
const MARKDOWN_EXT = new Set(['.md']);

function isMarkdown(filePath) {
  return MARKDOWN_EXT.has(path.extname(filePath).toLowerCase());
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (entry.isFile() && isMarkdown(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

function isLocalLink(target) {
  if (!target) return false;
  if (target.startsWith('#')) return false;
  if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:')) return false;
  if (target.includes('://')) return false;
  return true;
}

function looksLikePath(token) {
  if (!token) return false;
  if (token.includes(' ')) return false;
  const pathHints = ['src/', 'docs/', 'backlog/', '.github/', '.vscode/'];
  if (pathHints.some((h) => token.includes(h))) return true;
  if (token.endsWith('.md') || token.endsWith('.js') || token.endsWith('.ts') || token.endsWith('.vue') || token.endsWith('.yml') || token.endsWith('.yaml') || token.endsWith('.json') || token.endsWith('.css') || token.endsWith('.html')) return true;
  if (token.startsWith('/') || token.startsWith('./') || token.startsWith('../')) return true;
  return false;
}

function cleanTarget(raw) {
  let target = raw.trim();
  target = target.replace(/^<|>$/g, '');
  target = target.replace(/[),.;]+$/g, '');
  const hashIndex = target.indexOf('#');
  if (hashIndex >= 0) target = target.slice(0, hashIndex);
  const queryIndex = target.indexOf('?');
  if (queryIndex >= 0) target = target.slice(0, queryIndex);
  return target;
}

function resolvePath(target, baseDir) {
  if (target.startsWith('/')) return path.resolve(ROOT, target.slice(1));
  if (target.startsWith('./') || target.startsWith('../')) return path.resolve(baseDir, target);
  return path.resolve(ROOT, target);
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const baseDir = path.dirname(filePath);
  const missing = [];

  const linkRegex = /\[[^\]]*\]\(([^)\s]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const raw = match[1];
    const target = cleanTarget(raw);
    if (!isLocalLink(target)) continue;
    if (!looksLikePath(target)) continue;
    const abs = resolvePath(target, baseDir);
    if (!fs.existsSync(abs)) {
      missing.push({ file: filePath, ref: raw, resolved: abs });
    }
  }

  const codeRegex = /`([^`]+)`/g;
  while ((match = codeRegex.exec(content)) !== null) {
    const raw = match[1];
    if (!looksLikePath(raw)) continue;
    const target = cleanTarget(raw);
    if (!target) continue;
    const abs = resolvePath(target, baseDir);
    if (!fs.existsSync(abs)) {
      missing.push({ file: filePath, ref: raw, resolved: abs });
    }
  }

  return missing;
}

function collectMarkdownFiles() {
  const files = [];
  for (const entry of SCAN_ROOTS) {
    const fullPath = path.resolve(ROOT, entry);
    if (!fs.existsSync(fullPath)) continue;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (stat.isFile() && isMarkdown(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  const files = collectMarkdownFiles();
  const missing = [];

  for (const filePath of files) {
    missing.push(...scanFile(filePath));
  }

  if (missing.length > 0) {
    console.error('Found broken local paths in docs:');
    for (const item of missing) {
      const relativeFile = path.relative(ROOT, item.file);
      const relativeResolved = path.relative(ROOT, item.resolved);
      console.error(`- ${relativeFile}: ${item.ref} -> ${relativeResolved}`);
    }
    process.exit(1);
  }

  console.log('Docs path check passed.');
}

main();
