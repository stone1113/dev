const fs = require('fs');
const path = require('path');

// --- Config ---
const PART = parseInt(process.argv[2] || '1');
const inputFile = path.join(__dirname, `语料_part${PART}.csv`);
const outputFile = path.join(__dirname, `语料_part${PART}_zh.csv`);
const DELAY_MS = 350;
const PROGRESS_EVERY = 100;

// --- CSV ---
function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

function escapeCSVField(field) {
  if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  return field;
}

// --- Skip logic ---
function isChinese(text) {
  const ch = text.match(/[\u4e00-\u9fff]/g);
  if (!ch) return false;
  const nonSpace = text.replace(/\s/g, '').length;
  return nonSpace > 0 && ch.length / nonSpace > 0.3;
}

function shouldSkip(text) {
  if (!text || !text.trim()) return true;
  const t = text.trim();
  if (/^https?:\/\//i.test(t)) return true;
  if (/^[\d\s\.\-\+\(\)\/#%@&,;:!?\*=_]+$/.test(t)) return true;
  if (isChinese(t)) return true;
  if (t.length <= 2) return true;
  if (/^<?(image|video|audio|sticker|Media|GIF)\s*omitted>?$/i.test(t)) return true;
  if (/^(null|undefined|N\/A|n\/a|-|—)$/i.test(t)) return true;
  return false;
}

// --- Translate ---
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function translateText(text) {
  const encoded = encodeURIComponent(text.substring(0, 500)); // limit length
  const url = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|zh-CN`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    if (data.quotaFinished) {
      console.error('  !! MyMemory quota exhausted !!');
      return null; // signal to stop
    }
    return data.responseData?.translatedText || text;
  } catch (err) {
    // Retry once
    await sleep(2000);
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      return data.responseData?.translatedText || text;
    } catch {
      return text; // keep original on failure
    }
  }
}

// --- Main ---
async function main() {
  console.log(`\n=== Part ${PART} ===`);
  console.log(`Input:  ${inputFile}`);

  const content = fs.readFileSync(inputFile, 'utf-8');
  const lines = content.split('\n');
  const header = lines[0];

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    rows.push(parseCSVLine(lines[i]));
  }

  // Find rows needing translation
  const toTranslate = [];
  for (let i = 0; i < rows.length; i++) {
    if (!shouldSkip(rows[i][5] || '')) {
      toTranslate.push(i);
    }
  }

  console.log(`Total rows: ${rows.length}`);
  console.log(`To translate: ${toTranslate.length}`);
  console.log(`Skipped: ${rows.length - toTranslate.length}`);
  console.log(`Estimated time: ~${Math.ceil(toTranslate.length * DELAY_MS / 60000)} min\n`);

  let done = 0;
  let failed = 0;
  const startTime = Date.now();

  for (const idx of toTranslate) {
    const original = rows[idx][5];
    const translated = await translateText(original);

    if (translated === null) {
      console.error('Quota exhausted! Stopping. Saving progress...');
      break;
    }

    rows[idx][5] = translated;
    done++;

    if (done % PROGRESS_EVERY === 0 || done === toTranslate.length) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const pct = ((done / toTranslate.length) * 100).toFixed(1);
      console.log(`  [${done}/${toTranslate.length}] ${pct}%  (${elapsed}s elapsed)`);
    }

    await sleep(DELAY_MS);
  }

  // Write output
  const outputLines = [header];
  for (const row of rows) {
    outputLines.push(row.map(escapeCSVField).join(','));
  }
  fs.writeFileSync(outputFile, outputLines.join('\n'), 'utf-8');

  const sizeMB = (fs.statSync(outputFile).size / (1024 * 1024)).toFixed(2);
  console.log(`\nOutput: ${outputFile} (${sizeMB} MB)`);
  console.log(`Translated: ${done}, Failed: ${failed}`);
  console.log(`Done!\n`);
}

main().catch(console.error);
