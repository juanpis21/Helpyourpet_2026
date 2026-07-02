const fs = require('fs');
const path = require('path');
const terser = require('terser');

function findDistDir() {
  const distPath = path.join(__dirname, '..', '..', 'dist');
  if (!fs.existsSync(distPath)) return null;
  const entries = fs.readdirSync(distPath, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) {
      // return first directory inside dist
      return path.join(distPath, e.name);
    }
  }
  return distPath;
}

function walk(dir, cb) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

async function processFile(file) {
  if (!file.endsWith('.js')) return;
  try {
    const code = fs.readFileSync(file, 'utf8');
    const result = await terser.minify(code, {
      compress: {
        drop_console: true
      },
      mangle: true,
      format: {
        comments: false
      }
    });
    if (result.code) {
      fs.writeFileSync(file, result.code, 'utf8');
      console.log('Stripped consoles:', file);
    }
  } catch (e) {
    console.error('Error processing', file, e);
  }
}

async function main() {
  const distDir = findDistDir();
  if (!distDir) {
    console.error('dist directory not found. Run the production build first.');
    process.exit(1);
  }
  console.log('Processing dist folder:', distDir);
  const promises = [];
  walk(distDir, (file) => {
    promises.push(processFile(file));
  });
  await Promise.all(promises);
  console.log('Done stripping consoles from build files.');
}

main();
