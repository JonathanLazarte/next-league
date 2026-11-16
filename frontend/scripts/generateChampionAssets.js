const fs = require('fs');
const path = require('path');

const publicDetailsDir = path.join(__dirname, '../public/champion-details');
const publicGeneralDir = path.join(__dirname, '../public/general');
const outputFile = path.join(__dirname, '../src/utils/championDetailsAssets.ts');

function fileToDataUri(filePath) {
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  const mimeType = ext === 'svg' ? 'image/svg+xml' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  const data = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${data.toString('base64')}`;
}

const detailFiles = fs.readdirSync(publicDetailsDir).filter(f => /\.(png|jpg|jpeg|svg)$/i.test(f));
console.log(`Processing ${detailFiles.length} files from champion-details...`);

const detailsMap = {};
for (const file of detailFiles) {
  const filePath = path.join(publicDetailsDir, file);
  detailsMap[file] = fileToDataUri(filePath);
}

const closeButtonFiles = {
  idle: 'button-x.png',
  hovered: 'button-x-over.png',
  pressed: 'button-x-down.png'
};

const closeButtonMap = {};
for (const [state, fileName] of Object.entries(closeButtonFiles)) {
  const filePath = path.join(publicGeneralDir, fileName);
  if (fs.existsSync(filePath)) {
    closeButtonMap[state] = fileToDataUri(filePath);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
}

const fileContent = `/**
 * Auto-generated champion details & modal close button assets encoded as Base64 Data URIs.
 * Eliminates HTTP network latency and image flickering when opening the modal or hovering buttons.
 */

export const CLOSE_BUTTON_ASSETS: Record<'idle' | 'hovered' | 'pressed', string> = ${JSON.stringify(closeButtonMap, null, 2)};

export const CHAMPION_DETAILS_ASSETS: Record<string, string> = ${JSON.stringify(detailsMap, null, 2)};

/**
 * Returns the decoded Data URI for a champion details asset,
 * or falls back to the public path if not found.
 */
export function getChampionDetailAsset(filename: string): string {
  // If filename includes path like /champion-details/xyz.png, extract basename
  const basename = filename.split('/').pop() || filename;
  return CHAMPION_DETAILS_ASSETS[basename] || \`/champion-details/\${basename}\`;
}
`;

fs.writeFileSync(outputFile, fileContent, 'utf-8');
console.log(`Successfully generated ${outputFile} with size ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
