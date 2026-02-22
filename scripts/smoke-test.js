const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
let failures = 0;

function pass(msg) {
  console.log(`✅ ${msg}`);
}

function fail(msg) {
  console.log(`❌ ${msg}`);
  failures++;
}

// 1. Validate index.html exists and is valid HTML
const indexPath = path.join(ROOT, 'index.html');
if (!fs.existsSync(indexPath)) {
  fail('index.html does not exist');
} else {
  pass('index.html exists');
  const html = fs.readFileSync(indexPath, 'utf8');

  const requiredTags = ['<!DOCTYPE html>', '<html', '<head>', '<body>'];
  for (const tag of requiredTags) {
    if (html.includes(tag)) {
      pass(`index.html contains ${tag}`);
    } else {
      fail(`index.html missing ${tag}`);
    }
  }

  // 2. Validate SRI hashes for CSS and JS files
  // Match href or src attributes paired with integrity attributes
  const sriPattern = /(?:href|src)="([^"]+)"[^>]*integrity="(sha384-[^"]+)"/g;
  const seen = new Set();
  let match;

  while ((match = sriPattern.exec(html)) !== null) {
    const filePath = match[1];
    const expectedHash = match[2];

    // Deduplicate (same file may appear in preload + noscript fallback)
    const key = `${filePath}|${expectedHash}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const fullPath = path.join(ROOT, filePath);
    if (!fs.existsSync(fullPath)) {
      fail(`SRI check: file not found - ${filePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const hashAlgo = expectedHash.split('-')[0]; // e.g. "sha384"
    const digest = crypto.createHash(hashAlgo).update(fileBuffer).digest('base64');
    const computedHash = `${hashAlgo}-${digest}`;

    if (computedHash === expectedHash) {
      pass(`SRI valid: ${filePath}`);
    } else {
      fail(`SRI mismatch: ${filePath} (expected ${expectedHash}, got ${computedHash})`);
    }
  }
}

// 3. Validate expected directories exist
const expectedDirs = [
  'Content/stylesheets',
  'Content/javascript',
  'Content/fonts',
  'Images',
];

for (const dir of expectedDirs) {
  const dirPath = path.join(ROOT, dir);
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    pass(`Directory exists: ${dir}/`);
  } else {
    fail(`Directory missing: ${dir}/`);
  }
}

// 4. Validate staticwebapp.config.json is valid JSON
const configPath = path.join(ROOT, 'staticwebapp.config.json');
if (!fs.existsSync(configPath)) {
  fail('staticwebapp.config.json does not exist');
} else {
  try {
    JSON.parse(fs.readFileSync(configPath, 'utf8'));
    pass('staticwebapp.config.json is valid JSON');
  } catch (e) {
    fail(`staticwebapp.config.json is invalid JSON: ${e.message}`);
  }
}

// Summary
console.log(`\n${failures === 0 ? '✅ All checks passed' : `❌ ${failures} check(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);
