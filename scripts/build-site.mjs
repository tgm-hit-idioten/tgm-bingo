import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data', 'bingos');
const siteDir = path.join(rootDir, 'site');
const bingoDir = path.join(siteDir, 'bingos');
const assetsDir = path.join(siteDir, 'assets');
const createDir = path.join(siteDir, 'neu');

function isPerfectSquare(value) {
  const root = Math.sqrt(value);
  return Number.isInteger(root);
}

function getGridSize(cellCount) {
  return Math.sqrt(cellCount);
}

const bingoCss = `:root {
  --bg: #f7f8fb;
  --card: #ffffff;
  --line: #d8deea;
  --text: #111827;
  --accent: #3b82f6;
  --accent-2: #1d4ed8;
  --ok: #16a34a;
  --muted: #475569;
  --surface: #f1f5f9;
  --shadow: rgba(30, 64, 175, 0.08);
  --checked-bg: #dcfce7;
  --checked-border: #86efac;
  --locked-bg: #dbeafe;
  --locked-border: #93c5fd;
  --overlay: rgba(22, 163, 74, 0.94);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0b1220;
    --card: #111a2e;
    --line: #22314c;
    --text: #e2e8f0;
    --accent: #60a5fa;
    --accent-2: #93c5fd;
    --ok: #4ade80;
    --muted: #94a3b8;
    --surface: #17233a;
    --shadow: rgba(2, 6, 23, 0.6);
    --checked-bg: #173123;
    --checked-border: #2f855a;
    --locked-bg: #172a45;
    --locked-border: #3b82f6;
    --overlay: rgba(74, 222, 128, 0.92);
  }
}

html[data-theme='light'] {
  --bg: #f7f8fb;
  --card: #ffffff;
  --line: #d8deea;
  --text: #111827;
  --accent: #3b82f6;
  --accent-2: #1d4ed8;
  --ok: #16a34a;
  --muted: #475569;
  --surface: #f1f5f9;
  --shadow: rgba(30, 64, 175, 0.08);
  --checked-bg: #dcfce7;
  --checked-border: #86efac;
  --locked-bg: #dbeafe;
  --locked-border: #93c5fd;
  --overlay: rgba(22, 163, 74, 0.94);
}

html[data-theme='dark'] {
  --bg: #0b1220;
  --card: #111a2e;
  --line: #22314c;
  --text: #e2e8f0;
  --accent: #60a5fa;
  --accent-2: #93c5fd;
  --ok: #4ade80;
  --muted: #94a3b8;
  --surface: #17233a;
  --shadow: rgba(2, 6, 23, 0.6);
  --checked-bg: #173123;
  --checked-border: #2f855a;
  --locked-bg: #172a45;
  --locked-border: #3b82f6;
  --overlay: rgba(74, 222, 128, 0.92);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, Arial, sans-serif;
  color: var(--text);
  background: var(--bg);
}

main {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

h1 {
  margin: 0;
  font-size: 1.8rem;
}

p {
  margin-top: 0.4rem;
}

.actions {
  display: flex;
  gap: 0.6rem;
}

.hero-image {
  margin-top: 0.9rem;
}

.hero-image img {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface);
}

.button {
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--text);
  border-radius: 10px;
  padding: 0.55rem 0.9rem;
  text-decoration: none;
  cursor: pointer;
  font: inherit;
}

.button.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.button:hover {
  border-color: var(--accent-2);
}

.board {
  margin-top: 1.2rem;
  position: relative;
}

.grid {
  list-style: none;
  margin: 1.2rem 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(var(--grid-size, 5), minmax(0, 1fr));
  gap: 0.55rem;
}

.grid li {
  min-height: 95px;
}

.cell-btn {
  width: 100%;
  height: 100%;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--card);
  padding: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.3;
  font-size: 0.95rem;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.cell-btn:hover {
  border-color: var(--accent);
}

.cell-btn.checked {
  background: var(--checked-bg);
  border-color: var(--checked-border);
  text-decoration: line-through;
}

.cell-btn.locked {
  background: var(--locked-bg);
  border-color: var(--locked-border);
  font-weight: 700;
  cursor: default;
}

.bingo-overlay {
  position: absolute;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  font-size: clamp(2rem, 10vw, 6rem);
  font-weight: 900;
  color: var(--overlay);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
  z-index: 2;
}

.bingo-overlay.active {
  display: flex;
}

.status {
  margin-top: 0.8rem;
  color: var(--muted);
}

.theme-toggle {
  min-width: 12ch;
  text-align: center;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.menu {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.hint {
  color: var(--muted);
  margin-top: 0;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.8rem;
  margin-top: 1.2rem;
}

.card {
  display: block;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 0.9rem;
  text-decoration: none;
  color: inherit;
}

.card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--line);
  margin-bottom: 0.65rem;
  background: var(--surface);
}

.card:hover {
  border-color: var(--accent);
  box-shadow: 0 8px 24px var(--shadow);
}

.card h2 {
  font-size: 1.1rem;
  margin: 0 0 0.45rem;
}

.card p {
  margin: 0;
  color: var(--muted);
}

.field-label {
  display: inline-block;
  margin-bottom: 0.35rem;
}

.hint-text {
  color: var(--muted);
  margin: 0;
}

.creator-grid {
  margin-top: 0.5rem;
}

.creator-grid li {
  min-height: auto;
}

.creator-cell {
  width: 100%;
  min-height: 95px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--card);
  padding: 0.35rem;
}

.creator-cell textarea {
  width: 100%;
  height: 100%;
  min-height: 84px;
  resize: vertical;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: transparent;
  color: inherit;
  text-align: center;
}

.creator-cell textarea:focus {
  outline: 2px solid color-mix(in srgb, var(--accent) 65%, transparent);
  outline-offset: 1px;
}

.creator-cell.has-error {
  border-color: #ef4444;
}

form p {
  margin: 0.85rem 0;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.55rem;
  font: inherit;
  border-radius: 10px;
  border: 1px solid var(--line);
}

@media (max-width: 720px) {
  .grid {
    grid-template-columns: repeat(min(2, var(--grid-size, 5)), minmax(0, 1fr));
  }
}
`;

const themeInitScript = `<script>
  (() => {
    try {
      const mode = localStorage.getItem('theme-preference');
      if (mode === 'light' || mode === 'dark') {
        document.documentElement.dataset.theme = mode;
      }
    } catch {
      // Ignore unavailable storage.
    }
  })();
</script>`;

const themeToggleScript = `<script>
  (() => {
    const button = document.getElementById('theme-toggle');
    if (!button) {
      return;
    }

    const modes = ['auto', 'dark', 'light'];
    const labels = {
      auto: 'Design: Auto',
      dark: 'Design: Dunkel',
      light: 'Design: Hell'
    };

    function getStoredMode() {
      try {
        const value = localStorage.getItem('theme-preference');
        return value === 'dark' || value === 'light' ? value : 'auto';
      } catch {
        return 'auto';
      }
    }

    function applyMode(mode) {
      if (mode === 'auto') {
        delete document.documentElement.dataset.theme;
      } else {
        document.documentElement.dataset.theme = mode;
      }
    }

    function persistMode(mode) {
      try {
        if (mode === 'auto') {
          localStorage.removeItem('theme-preference');
        } else {
          localStorage.setItem('theme-preference', mode);
        }
      } catch {
        // Ignore unavailable storage.
      }
    }

    function updateButton(mode) {
      button.textContent = labels[mode];
      button.setAttribute('aria-label', 'Darstellung wechseln: ' + labels[mode]);
    }

    function nextMode(mode) {
      return modes[(modes.indexOf(mode) + 1) % modes.length];
    }

    let mode = getStoredMode();
    applyMode(mode);
    updateButton(mode);

    button.addEventListener('click', () => {
      mode = nextMode(mode);
      applyMode(mode);
      persistMode(mode);
      updateButton(mode);
    });

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', () => {
        if (mode === 'auto') {
          applyMode('auto');
        }
      });
    }
  })();
</script>`;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function toJsonScriptData(value) {
  return JSON.stringify(value).replaceAll('</script', '<\\/script');
}

function toSlug(fileName) {
  return fileName.replace(/\.json$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function loadBingos() {
  const entries = await fs.readdir(dataDir, { withFileTypes: true });
  const jsonFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.json'));

  const loaded = [];
  for (const file of jsonFiles) {
    const fullPath = path.join(dataDir, file.name);
    const raw = await fs.readFile(fullPath, 'utf8');
    const parsed = JSON.parse(raw);

    if (!parsed.title || !Array.isArray(parsed.cells)) {
      throw new Error(`Ungueltiges Bingo in ${file.name}: title und cells sind erforderlich.`);
    }

    if (parsed.cells.length < 4 || !isPerfectSquare(parsed.cells.length)) {
      throw new Error(
        `Ungueltige Anzahl Felder in ${file.name}: ${parsed.cells.length}. Erwartet wird eine Quadratzahl (z. B. 4, 9, 16, 25).`
      );
    }

    const slug = parsed.slug ? toSlug(`${parsed.slug}.json`) : toSlug(file.name);
    const cells = parsed.cells.map((cell) => String(cell ?? '').trim());

    if (cells.some((cell) => !cell)) {
      throw new Error(`Leere Felder in ${file.name}: alle cell-Eintraege muessen Text enthalten.`);
    }

    loaded.push({
      slug,
      id: String(parsed.id ?? slug),
      title: parsed.title,
      subtitle: parsed.subtitle ?? '',
      freeText: typeof parsed.freeText === 'string' ? parsed.freeText.trim() : '',
      titleImage: parsed.titleImage ? String(parsed.titleImage).trim() : '',
      cells
    });
  }

  return loaded.sort((a, b) => a.title.localeCompare(b.title, 'de'));
}

function renderIndex(bingos) {
  const cards = bingos
    .map(
      (bingo) => `
      <a class="card" href="./bingos/${escapeHtml(bingo.slug)}.html">
        ${bingo.titleImage ? `<img src="${escapeHtml(bingo.titleImage)}" alt="" loading="lazy" />` : ''}
        <h2>${escapeHtml(bingo.title)}</h2>
        <p>${escapeHtml(bingo.subtitle || 'Jetzt spielen')}</p>
      </a>`
    )
    .join('');

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Lehrer-Bingo Übersicht</title>
  ${themeInitScript}
  <link rel="stylesheet" href="./assets/bingo.css" />
</head>
<body>
  <main>
    <div class="top">
      <div>
        <h1>Lehrer-Bingo</h1>
        <p class="hint">Wähle ein Bingo und hake Felder direkt im Browser ab.</p>
      </div>
      <nav class="menu" aria-label="Hauptmenü">
        <button type="button" id="theme-toggle" class="button theme-toggle">Design: Auto</button>
        <a class="button primary" href="./neu/index.html">Neues Bingo erstellen</a>
      </nav>
    </div>
    <section class="cards" aria-label="Bingo-Liste">${cards}
    </section>
  </main>
  ${themeToggleScript}
</body>
</html>`;
}

function renderBingoPage(bingo) {
  const gridSize = getGridSize(bingo.cells.length);
  const dataPayload = {
    id: bingo.id,
    slug: bingo.slug,
    title: bingo.title,
    subtitle: bingo.subtitle,
    freeText: bingo.freeText,
    cells: bingo.cells,
    gridSize
  };

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(bingo.title)}</title>
  ${themeInitScript}
  <link rel="stylesheet" href="../assets/bingo.css" />
</head>
<body>
  <main>
    <header>
      <div>
        <h1>${escapeHtml(bingo.title)}</h1>
        <p>${escapeHtml(bingo.subtitle || 'Viel Spaß beim Unterrichts-Bingo.')}</p>
      </div>
      <div class="actions">
        <a class="button" href="../index.html">Zur Übersicht</a>
        <button type="button" id="theme-toggle" class="button theme-toggle">Design: Auto</button>
        <button type="button" id="reset-board" class="button">Reset</button>
      </div>
    </header>

    ${bingo.titleImage ? `<div class="hero-image"><img src="${escapeHtml(bingo.titleImage)}" alt="Titelbild zu ${escapeHtml(bingo.title)}" /></div>` : ''}

    <section class="board" aria-label="Bingo-Feld">
      <div id="bingo-overlay" class="bingo-overlay" aria-live="polite">BINGO</div>
      <ul id="bingo-grid" class="grid" style="--grid-size: ${gridSize};"></ul>
    </section>
    <p id="bingo-status" class="status" aria-live="polite"></p>
  </main>

  <script id="bingo-data" type="application/json">${toJsonScriptData(dataPayload)}</script>
  <script>
    const bingoDataEl = document.getElementById('bingo-data');
    const data = JSON.parse(bingoDataEl.textContent || '{}');
    const gridEl = document.getElementById('bingo-grid');
    const overlayEl = document.getElementById('bingo-overlay');
    const statusEl = document.getElementById('bingo-status');
    const resetBtn = document.getElementById('reset-board');

    const side = Number(data.gridSize);
    const total = side * side;
    const centerIndex = side % 2 === 1 ? Math.floor(total / 2) : -1;
    const hasFreeCenter = centerIndex >= 0 && typeof data.freeText === 'string' && data.freeText.trim().length > 0;

    function dateKeyLocal() {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      return y + '-' + m + '-' + d;
    }

    function hash32(str) {
      let h = 2166136261;
      for (let i = 0; i < str.length; i += 1) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return h >>> 0;
    }

    function mulberry32(seed) {
      let t = seed >>> 0;
      return () => {
        t += 0x6D2B79F5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
      };
    }

    function shuffleDeterministic(values, seedStr) {
      const copy = values.slice();
      const random = mulberry32(hash32(seedStr));
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    const seed = dateKeyLocal() + '|' + String(data.id || data.slug || 'bingo');
    const shuffled = shuffleDeterministic(Array.isArray(data.cells) ? data.cells : [], seed).slice(0, total);
    const renderedCells = shuffled.map((text, index) => {
      if (hasFreeCenter && index === centerIndex) {
        return { text: data.freeText.trim(), locked: true };
      }
      return { text: String(text || ''), locked: false };
    });

    const checked = new Set();
    function seedCheckedWithLocked() {
      checked.clear();
      if (hasFreeCenter) {
        checked.add(centerIndex);
      }
    }

    seedCheckedWithLocked();

    function storageKey() {
      return ['bingo-state', data.id || data.slug || 'bingo', dateKeyLocal()].join(':');
    }

    function restoreState() {
      try {
        const raw = localStorage.getItem(storageKey());
        if (!raw) {
          return;
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
          return;
        }
        for (const value of parsed) {
          const idx = Number(value);
          if (Number.isInteger(idx) && idx >= 0 && idx < total && !renderedCells[idx].locked) {
            checked.add(idx);
          }
        }
      } catch {
        // localStorage is optional; ignore parse and permission errors.
      }
    }

    function persistState() {
      try {
        const values = [...checked].filter((idx) => !renderedCells[idx].locked);
        localStorage.setItem(storageKey(), JSON.stringify(values));
      } catch {
        // localStorage is optional.
      }
    }

    function resetBoard() {
      seedCheckedWithLocked();
      try {
        localStorage.removeItem(storageKey());
      } catch {
        // localStorage is optional.
      }
      updateUi();
    }

    function getLines() {
      const lines = [];
      for (let row = 0; row < side; row += 1) {
        const line = [];
        for (let col = 0; col < side; col += 1) {
          line.push(row * side + col);
        }
        lines.push(line);
      }
      for (let col = 0; col < side; col += 1) {
        const line = [];
        for (let row = 0; row < side; row += 1) {
          line.push(row * side + col);
        }
        lines.push(line);
      }
      const d1 = [];
      const d2 = [];
      for (let i = 0; i < side; i += 1) {
        d1.push(i * side + i);
        d2.push(i * side + (side - 1 - i));
      }
      lines.push(d1, d2);
      return lines;
    }

    const lines = getLines();

    function hasBingo() {
      return lines.some((line) => line.every((idx) => checked.has(idx)));
    }

    function updateUi() {
      const buttons = gridEl.querySelectorAll('button[data-index]');
      for (const button of buttons) {
        const index = Number(button.dataset.index);
        button.classList.toggle('checked', checked.has(index));
        button.setAttribute('aria-pressed', checked.has(index) ? 'true' : 'false');
      }

      const isBingo = hasBingo();
      overlayEl.classList.toggle('active', isBingo);
      statusEl.textContent = isBingo ? 'BINGO!' : 'Abgehakt: ' + checked.size + ' / ' + total;
    }

    function renderBoard() {
      gridEl.innerHTML = renderedCells
        .map((cell, index) => {
          const extraClass = cell.locked ? ' locked checked' : '';
          const disabled = cell.locked ? ' disabled' : '';
          const pressed = checked.has(index) ? 'true' : 'false';
          return '<li><button type="button" class="cell-btn' + extraClass + '" data-index="' + index + '" aria-pressed="' + pressed + '"' + disabled + '>' +
            cell.text
              .replaceAll('&', '&amp;')
              .replaceAll('<', '&lt;')
              .replaceAll('>', '&gt;') +
            '</button></li>';
        })
        .join('');

      gridEl.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-index]');
        if (!button) {
          return;
        }
        const index = Number(button.dataset.index);
        if (renderedCells[index].locked) {
          return;
        }
        if (checked.has(index)) {
          checked.delete(index);
        } else {
          checked.add(index);
        }
        persistState();
        updateUi();
      });
    }

    restoreState();
    renderBoard();
    updateUi();

    if (resetBtn) {
      resetBtn.addEventListener('click', resetBoard);
    }
  </script>
  ${themeToggleScript}
</body>
</html>`;
}

function renderCreatePage() {
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Neues Bingo erstellen</title>
  ${themeInitScript}
  <link rel="stylesheet" href="../assets/bingo.css" />
</head>
<body>
  <main>
    <header>
      <div>
        <h1>Neues Bingo erstellen</h1>
        <p>Erstelle dein Bingo als JSON-Datei.</p>
      </div>
      <div class="actions">
        <a class="button" href="../index.html">Zur Übersicht</a>
        <button type="button" id="theme-toggle" class="button theme-toggle">Design: Auto</button>
      </div>
    </header>

    <form id="create-form">
      <p>
        <label>Titel<br /><input name="title" required /></label>
      </p>
      <p>
        <label>Untertitel<br /><input name="subtitle" /></label>
      </p>
      <p>
        <label>Titelbild (URL oder relativer Pfad)<br /><input name="titleImage" placeholder="../assets/bilder/mein-bingo.jpg" /></label>
      </p>
      <p>
        <label>Quadratgröße (z. B. 3, 4, 5)<br /><input name="size" type="number" min="2" value="5" required /></label>
      </p>
      <p>
        <label>Freifeld-Text (optional, nur bei ungerader Größe für die Mitte)<br /><input name="freeText" placeholder="z. B. Freifeld" /></label>
      </p>
      <p>
        <label class="field-label">Felder</label>
        <p class="hint-text">Trage deine Begriffe direkt in die Boxen ein. Für ein Bingo müssen alle Felder gefüllt sein.</p>
        <ul id="creator-grid" class="grid creator-grid" style="--grid-size: 5;" aria-live="polite"></ul>
      </p>
      <div class="actions">
        <button class="button primary" type="submit">JSON herunterladen</button>
      </div>
    </form>
  </main>

  <script>
    const form = document.getElementById('create-form');
    const sizeInput = form.elements.size;
    const gridEl = document.getElementById('creator-grid');

    function getCurrentGridValues() {
      return Array.from(gridEl.querySelectorAll('textarea[data-cell-index]')).map((input) => input.value);
    }

    function sanitizeSize(value) {
      const number = Number(value);
      if (!Number.isInteger(number) || number < 2) {
        return 5;
      }
      return number;
    }

    function renderCreatorGrid(size) {
      const preserved = getCurrentGridValues();
      const expected = size * size;
      const fragment = document.createDocumentFragment();

      for (let index = 0; index < expected; index += 1) {
        const item = document.createElement('li');
        const wrapper = document.createElement('div');
        wrapper.className = 'creator-cell';

        const input = document.createElement('textarea');
        input.required = true;
        input.dataset.cellIndex = String(index);
        input.placeholder = 'Feld ' + (index + 1);
        input.value = preserved[index] || '';

        wrapper.appendChild(input);
        item.appendChild(wrapper);
        fragment.appendChild(item);
      }

      gridEl.style.setProperty('--grid-size', String(size));
      gridEl.replaceChildren(fragment);
    }

    function collectGridCells(expected) {
      const inputs = Array.from(gridEl.querySelectorAll('textarea[data-cell-index]'));
      const cells = [];
      const emptyIndices = [];

      for (let index = 0; index < expected; index += 1) {
        const input = inputs[index];
        const value = String(input?.value || '').trim();
        const wrapper = input?.closest('.creator-cell');
        if (wrapper) {
          wrapper.classList.remove('has-error');
        }

        if (!value) {
          emptyIndices.push(index);
          if (wrapper) {
            wrapper.classList.add('has-error');
          }
        }
        cells.push(value);
      }

      return { cells, emptyIndices };
    }

    sizeInput.addEventListener('input', () => {
      const size = sanitizeSize(sizeInput.value);
      renderCreatorGrid(size);
    });

    renderCreatorGrid(sanitizeSize(sizeInput.value));

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const size = Number(data.get('size'));
      const expected = size * size;

      if (!Number.isInteger(size) || size < 2) {
        alert('Bitte eine gültige Quadratgröße ab 2 eintragen.');
        return;
      }

      const { cells, emptyIndices } = collectGridCells(expected);
      if (emptyIndices.length > 0) {
        alert('Bitte alle ' + expected + ' Felder ausfüllen. Leer: ' + (emptyIndices[0] + 1));
        const firstEmpty = gridEl.querySelector('textarea[data-cell-index="' + emptyIndices[0] + '"]');
        firstEmpty?.focus();
        return;
      }

      const title = String(data.get('title') || '').trim();
      const payload = {
        title,
        subtitle: String(data.get('subtitle') || '').trim(),
        freeText: String(data.get('freeText') || '').trim(),
        titleImage: String(data.get('titleImage') || '').trim(),
        cells
      };

      if (!payload.freeText) {
        delete payload.freeText;
      }

      if (!payload.titleImage) {
        delete payload.titleImage;
      }

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'neues-bingo';
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = slug + '.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  </script>
  ${themeToggleScript}
</body>
</html>`;
}

async function main() {
  await fs.mkdir(bingoDir, { recursive: true });
  await fs.mkdir(assetsDir, { recursive: true });
  await fs.mkdir(createDir, { recursive: true });

  const bingos = await loadBingos();

  await fs.writeFile(path.join(assetsDir, 'bingo.css'), bingoCss, 'utf8');
  await fs.writeFile(path.join(siteDir, 'index.html'), renderIndex(bingos), 'utf8');
  await fs.writeFile(path.join(createDir, 'index.html'), renderCreatePage(), 'utf8');

  for (const bingo of bingos) {
    const page = renderBingoPage(bingo);
    await fs.writeFile(path.join(bingoDir, `${bingo.slug}.html`), page, 'utf8');
  }

  console.log(`Build abgeschlossen: ${bingos.length} Bingo-Seiten erzeugt.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

