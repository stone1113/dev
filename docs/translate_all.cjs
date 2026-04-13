const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Translate parts 2-5 sequentially (Part 1 is already running separately)
const PARTS = [2, 3, 4, 5];

async function main() {
  for (const part of PARTS) {
    const outFile = path.join(__dirname, `语料_part${part}_zh.csv`);
    if (fs.existsSync(outFile)) {
      console.log(`\n>>> Part ${part} already translated, skipping...`);
      continue;
    }
    console.log(`\n>>> Starting Part ${part}...`);
    try {
      execSync(`node "${path.join(__dirname, 'translate_csv.cjs')}" ${part}`, {
        stdio: 'inherit',
        timeout: 3600000 // 1 hour max per part
      });
    } catch (err) {
      console.error(`Part ${part} failed or timed out:`, err.message);
      // Check if quota exhausted by looking at output file
      if (fs.existsSync(outFile)) {
        console.log(`  (partial output saved to ${outFile})`);
      }
      console.log('  Continuing to next part...');
    }
  }
  console.log('\n=== All parts done! ===');
}

main();
