const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
const targetPath = path.join(__dirname, '../src/environments/environment.ts');
const targetProdPath = path.join(__dirname, '../src/environments/environment.prod.ts');

let apiKey = 'TU_GEMINI_API_KEY';
let model = 'gemini-2.5-flash';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      if (key === 'GEMINI_API_KEY') apiKey = value;
      if (key === 'GEMINI_MODEL') model = value;
    }
  });
}

const envConfigFile = `export const environment = {
  production: false,
  geminiApiKey: 'TU_GEMINI_API_KEY',
  geminiModel: 'gemini-2.5-flash'
};
`;

const envProdConfigFile = `export const environment = {
  production: true,
  geminiApiKey: 'TU_GEMINI_API_KEY',
  geminiModel: 'gemini-2.5-flash'
};
`;

const dir = path.join(__dirname, '../src/environments');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(targetPath, envConfigFile);
fs.writeFileSync(targetProdPath, envProdConfigFile);
console.log('✅ Archivos environment.ts y environment.prod.ts actualizados con placeholders');

// Copiar worker de PDF.js a public
const workerSrc = path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
const publicDir = path.join(__dirname, '../public');
const workerDest = path.join(publicDir, 'pdf.worker.min.mjs');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generar config.json con los valores reales leídos de .env
const configPath = path.join(publicDir, 'config.json');
const configData = {
  geminiApiKey: apiKey,
  geminiModel: model
};
fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
console.log('✅ Archivo public/config.json generado con credenciales reales desde .env');

if (fs.existsSync(workerSrc)) {
  fs.copyFileSync(workerSrc, workerDest);
  console.log('✅ PDF worker copiado exitosamente a public/pdf.worker.min.mjs');
}

