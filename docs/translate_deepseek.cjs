const fs = require('fs');
const path = require('path');

// --- Config ---
const API_KEY = 'sk-1847dc495bc34aada6687edc2d4d9213';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-chat';
const BATCH_SIZE = 30;       // texts per API call
const DELAY_MS = 200;        // delay between API calls
const PROGRESS_EVERY = 1;    // report every N batches
const MAX_RETRIES = 3;

const PART = parseInt(process.argv[2] || '1');
const inputFile = path.join(__dirname, `语料_part${PART}.csv`);
const outputFile = path.join(__dirname, `语料_part${PART}_zh.csv`);

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

// --- DeepSeek translate ---
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function translateBatch(texts) {
  const numbered = texts.map((t, i) => `[${i}] ${t.substring(0, 300)}`).join('\n');

  const prompt = `将以下编号文本翻译成中文。这些是WhatsApp聊天记录，保持口语化风格。
每行格式为 [编号] 原文，请按相同格式返回 [编号] 译文。
只返回翻译结果，不要解释。如果原文已经是中文则原样返回。

${numbered}`;

  for (let retry = 0; retry < MAX_RETRIES; retry++) {
    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: '你是一个专业翻译助手，擅长将英文/多语言WhatsApp聊天记录翻译成自然流畅的中文。保持原文的语气和情感。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 4000
        })
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${errText}`);
      }

      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || '';

      // Parse numbered responses
      const results = new Array(texts.length).fill(null);
      const lines = content.split('\n');
      for (const line of lines) {
        const match = line.match(/^\[(\d+)\]\s*(.+)$/);
        if (match) {
          const idx = parseInt(match[1]);
          if (idx >= 0 && idx < texts.length) {
            results[idx] = match[2].trim();
          }
        }
      }

      // Fill any missing with originals
      for (let i = 0; i < results.length; i++) {
        if (!results[i]) results[i] = texts[i];
      }

      return results;
    } catch (err) {
      console.error(`  Batch error (retry ${retry + 1}/${MAX_RETRIES}): ${err.message}`);
      if (retry < MAX_RETRIES - 1) await sleep(2000 * (retry + 1));
    }
  }

  // All retries failed, return originals
  return texts;
}

// --- Main ---
async function main() {
  console.log(`\n=== DeepSeek Translate - Part ${PART} ===`);
  console.log(`Input:  ${inputFile}`);
  console.log(`Model:  ${MODEL}`);
  console.log(`Batch:  ${BATCH_SIZE} texts/call\n`);

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

  const totalBatches = Math.ceil(toTranslate.length / BATCH_SIZE);
  console.log(`Total rows: ${rows.length}`);
  console.log(`To translate: ${toTranslate.length} (${totalBatches} batches)`);
  console.log(`Skipped: ${rows.length - toTranslate.length}`);
  console.log(`Estimated time: ~${Math.ceil(totalBatches * (DELAY_MS + 1500) / 60000)} min\n`);

  let batchDone = 0;
  const startTime = Date.now();

  // Process in batches
  for (let b = 0; b < toTranslate.length; b += BATCH_SIZE) {
    const batchIndices = toTranslate.slice(b, b + BATCH_SIZE);
    const batchTexts = batchIndices.map(idx => rows[idx][5]);

    const translated = await translateBatch(batchTexts);

    for (let j = 0; j < batchIndices.length; j++) {
      rows[batchIndices[j]][5] = translated[j];
    }

    batchDone++;
    if (batchDone % PROGRESS_EVERY === 0 || batchDone === totalBatches) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const pct = ((batchDone / totalBatches) * 100).toFixed(1);
      const rowsDone = Math.min(b + BATCH_SIZE, toTranslate.length);
      console.log(`  [batch ${batchDone}/${totalBatches}] ${rowsDone}/${toTranslate.length} rows  ${pct}%  (${elapsed}s)`);
    }

    // Save progress every 10 batches
    if (batchDone % 10 === 0) {
      const tmpLines = [header];
      for (const row of rows) {
        tmpLines.push(row.map(escapeCSVField).join(','));
      }
      fs.writeFileSync(outputFile, tmpLines.join('\n'), 'utf-8');
    }

    await sleep(DELAY_MS);
  }

  // Final write
  const outputLines = [header];
  for (const row of rows) {
    outputLines.push(row.map(escapeCSVField).join(','));
  }
  fs.writeFileSync(outputFile, outputLines.join('\n'), 'utf-8');

  const sizeMB = (fs.statSync(outputFile).size / (1024 * 1024)).toFixed(2);
  console.log(`\nOutput: ${outputFile} (${sizeMB} MB)`);
  console.log(`Done!\n`);
}

main().catch(console.error);
