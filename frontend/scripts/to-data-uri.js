#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const fileArg = process.argv[2];

if (!fileArg) {
  console.log('Uso: node scripts/to-data-uri.js <ruta-al-archivo>');
  console.log('Ejemplo: node scripts/to-data-uri.js public/icons/mi-icono.png');
  process.exit(1);
}

const resolvedPath = path.resolve(process.cwd(), fileArg);

if (!fs.existsSync(resolvedPath)) {
  console.error(`Error: No se encontró el archivo en: ${resolvedPath}`);
  process.exit(1);
}

const ext = path.extname(resolvedPath).slice(1).toLowerCase();
const mimeMap = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  gif: 'image/gif',
  ico: 'image/x-icon',
};

const mime = mimeMap[ext] || `image/${ext}`;
const buffer = fs.readFileSync(resolvedPath);
const base64 = buffer.toString('base64');
const dataUri = `data:${mime};base64,${base64}`;

console.log('\n--- DATA URI GENERADA ---');
console.log(`Tamaño original: ${(buffer.length / 1024).toFixed(2)} KB`);
console.log(`Longitud Data URI: ${(dataUri.length / 1024).toFixed(2)} KB\n`);
console.log(dataUri);
console.log('\n-------------------------\n');
