require('dotenv').config();
const fs = require('fs');
const path = require('path');

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('❌ ANTHROPIC_API_KEY not found in .env');
  process.exit(1);
}

const src = path.join(__dirname, 'public', 'index.html');
const out = path.join(__dirname, 'public', 'index.html');

let html = fs.readFileSync(src, 'utf8');

// Inject the key as the default value on the input field
html = html.replace(
  'id="api-key" placeholder="sk-ant-..."',
  `id="api-key" placeholder="sk-ant-..." value="${apiKey}"`
);

// Also pre-populate localStorage on page load so it's available immediately
const inject = `\n    localStorage.setItem('cf_api_key', document.getElementById('api-key').value);`;
html = html.replace(
  "const key = localStorage.getItem('cf_api_key');",
  `const key = localStorage.getItem('cf_api_key');${inject}`
);

fs.writeFileSync(out, html);
console.log('✅ Built public/index.html with API key injected');
console.log('⚠️  Remember: API key is visible in page source — keep the URL private');
