require('dotenv').config();
const fs = require('fs');
const path = require('path');

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('❌ ANTHROPIC_API_KEY not found in .env');
  process.exit(1);
}

const src  = path.join(__dirname, 'public', 'index.html');
const html = fs.readFileSync(src, 'utf8');

if (!html.includes('__ANTHROPIC_API_KEY__')) {
  console.error('❌ Placeholder __ANTHROPIC_API_KEY__ not found in public/index.html');
  console.error('   The source file may already have a key injected. Run: git checkout public/index.html');
  process.exit(1);
}

const built = html.replace('__ANTHROPIC_API_KEY__', apiKey);

// Write to dist/ so the source file stays clean and git-safe
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

fs.writeFileSync(path.join(distDir, 'index.html'), built);
console.log('✅ Built dist/index.html with API key injected');
console.log('⚠️  dist/ is gitignored — key never touches git');
console.log('   To deploy: push to GitHub, Actions will inject the key automatically');
