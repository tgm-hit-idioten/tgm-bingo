import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const required = [
    path.join(rootDir, 'site', 'index.html'),
    path.join(rootDir, 'site', 'assets', 'bingo.css'),
    path.join(rootDir, 'site', 'neu', 'index.html')
  ];

  for (const item of required) {
    if (!(await exists(item))) {
      throw new Error(`Fehlende Build-Datei: ${item}`);
    }
  }

  const dataDir = path.join(rootDir, 'data', 'bingos');
  const siteBingoDir = path.join(rootDir, 'site', 'bingos');
  const sources = (await fs.readdir(dataDir)).filter((name) => name.endsWith('.json')).length;
  const pages = (await fs.readdir(siteBingoDir)).filter((name) => name.endsWith('.html')).length;

  if (sources !== pages) {
    throw new Error(`Anzahl Bingo-Dateien stimmt nicht: ${sources} JSON vs ${pages} HTML.`);
  }

  const indexContent = await fs.readFile(path.join(rootDir, 'site', 'index.html'), 'utf8');
  if (!indexContent.includes('<style>')) {
    throw new Error('Inline-CSS in der Uebersicht fehlt.');
  }

  const samplePageName = (await fs.readdir(siteBingoDir)).find((name) => name.endsWith('.html'));
  if (!samplePageName) {
    throw new Error('Keine erzeugte Bingo-Seite gefunden.');
  }

  const samplePage = await fs.readFile(path.join(siteBingoDir, samplePageName), 'utf8');
  if (!samplePage.includes('id="bingo-grid"')) {
    throw new Error('Interaktives Bingo-Grid fehlt.');
  }
  if (!samplePage.includes('id="bingo-overlay"')) {
    throw new Error('Bingo-Overlay fehlt.');
  }
  if (!samplePage.includes('id="reset-board"')) {
    throw new Error('Reset-Button fehlt auf der Bingo-Seite.');
  }
  if (samplePage.includes('window.print(')) {
    throw new Error('Druck-Option sollte entfernt sein, ist aber noch vorhanden.');
  }

  console.log('Check erfolgreich: Build-Struktur und Index stimmen.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

