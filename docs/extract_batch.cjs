const fs = require('fs');
const path = require('path');

// CSV parser that handles quoted fields with commas and embedded quotes
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
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  return field;
}

const PART = parseInt(process.argv[2] || '1');
const START = parseInt(process.argv[3] || '0');
const COUNT = parseInt(process.argv[4] || '200');

const inputFile = path.join(__dirname, `语料_part${PART}.csv`);
const content = fs.readFileSync(inputFile, 'utf-8');
const lines = content.split('\n');
const header = lines[0];

const rows = [];
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  rows.push({ line: lines[i], fields: parseCSVLine(lines[i]) });
}

// Output rows in range as JSON for translation
const batch = rows.slice(START, START + COUNT);
const output = batch.map((r, i) => {
  const contentField = r.fields[5] || '';
  return { i: START + i, c: contentField };
});

// Output as JSON
console.log(JSON.stringify(output));
