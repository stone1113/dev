import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

const mdPath = process.argv[2];
if (!mdPath) {
  console.error('Usage: node md-to-pdf.mjs <markdown-file>');
  process.exit(1);
}

const mdContent = fs.readFileSync(mdPath, 'utf-8');
const htmlBody = marked.parse(mdContent);

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<style>
  @page { margin: 20mm 18mm; size: A4; }
  body {
    font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.7;
    color: #1a1a1a;
    max-width: 100%;
  }
  h1 { font-size: 22pt; border-bottom: 2px solid #FF6B35; padding-bottom: 8px; margin-top: 30px; color: #222; }
  h2 { font-size: 16pt; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px; margin-top: 28px; color: #333; }
  h3 { font-size: 13pt; margin-top: 22px; color: #444; }
  h4 { font-size: 11.5pt; margin-top: 18px; color: #555; }
  blockquote {
    border-left: 4px solid #FF6B35;
    padding: 8px 16px;
    margin: 12px 0;
    background: #fff8f5;
    color: #666;
    font-size: 10pt;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 10pt;
  }
  th {
    background: #f8f8f8;
    font-weight: 600;
    text-align: left;
    padding: 8px 10px;
    border: 1px solid #ddd;
  }
  td {
    padding: 6px 10px;
    border: 1px solid #ddd;
    vertical-align: top;
  }
  tr:nth-child(even) { background: #fafafa; }
  code {
    background: #f5f5f5;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 9.5pt;
    font-family: "Cascadia Code", "Fira Code", Consolas, monospace;
  }
  pre {
    background: #f5f5f5;
    padding: 14px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 9pt;
    line-height: 1.5;
    border: 1px solid #e8e8e8;
  }
  pre code { background: none; padding: 0; }
  hr { border: none; border-top: 1px solid #ddd; margin: 24px 0; }
  ul, ol { padding-left: 24px; }
  li { margin: 3px 0; }
  a { color: #FF6B35; text-decoration: none; }
</style>
</head>
<body>${htmlBody}</body>
</html>`;

const outputPath = mdPath.replace(/\.md$/, '.pdf');

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.pdf({
  path: outputPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' },
});
await browser.close();

console.log('PDF generated:', outputPath);
