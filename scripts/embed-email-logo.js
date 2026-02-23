const fs = require('fs');
const path = require('path');

const logoPath = path.join(process.cwd(), 'public', 'brand_logo.webp');
const buf = fs.readFileSync(logoPath);
const dataUrl = 'data:image/webp;base64,' + buf.toString('base64');

const outPath = path.join(process.cwd(), 'src', 'emails', 'shared', 'logoDataUrl.ts');
const content = `// Auto-generated from public/brand_logo.webp - run: node scripts/embed-email-logo.js
export const LOGO_DATA_URL = ${JSON.stringify(dataUrl)};
`;

fs.writeFileSync(outPath, content);
console.log('Wrote', outPath);
