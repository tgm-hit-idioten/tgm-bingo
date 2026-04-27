# Lehrer-Bingo (anpassbar)

Statische Website fuer Unterrichts-Bingos mit:

- automatisch generierter Startseite (`site/index.html`) als Uebersicht aller Bingos
- separatem Stylesheet fuer Bingo-Seiten (`site/assets/bingo.css`)
- Seite zum Erstellen neuer Bingo-JSONs (`site/neu/index.html`)
- clientseitigem Abhaken von Feldern inkl. Bingo-Erkennung und Reset-Button
- taeglich wechselnder, deterministischer Feldreihenfolge pro Bingo

## Struktur

- `data/bingos/*.json`: Inhalte, die du anpasst
- `scripts/build-site.mjs`: generiert HTML und CSS nach `site/`
- `scripts/check-site.mjs`: kleiner Integritaets-Check
- `site/`: fertige statische Ausgabe

## Bingo anpassen

1. JSON-Datei in `data/bingos` anlegen oder bearbeiten
2. `cells` als Quadratzahl eintragen (z. B. 9, 16, 25)
3. Build ausfuehren

Beispiel:

```json
{
  "title": "Bingo - Fach bei Lehrkraft",
  "subtitle": "Optionaler Untertitel",
  "titleImage": "../assets/bilder/bingo-header.jpg",
  "freeText": "Freifeld",
  "cells": ["... 16 oder 25 oder 36 Eintraege ..."]
}
```

Hinweise:

- `freeText` ist optional. Ohne `freeText` gibt es kein festes Freifeld in der Mitte.
- `titleImage` ist optional.

## Lokale Nutzung

```bash
npm run build
npm test
npm start
```

Danach im Browser `http://localhost:4173` oeffnen.

hallo :)


