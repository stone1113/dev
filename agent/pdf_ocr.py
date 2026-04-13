#!/usr/bin/env python3
"""
PDF OCR 提取工具 - 使用 Tesseract OCR
依赖: pip install pdf2image pytesseract pillow
"""
import sys
from pathlib import Path

try:
    from pdf2image import convert_from_path
    import pytesseract
except ImportError:
    print("请先安装依赖: pip install pdf2image pytesseract pillow")
    sys.exit(1)

def extract_text_from_pdf(pdf_path: str, lang: str = "chi_sim+eng") -> str:
    """从 PDF 提取文本（支持中英文）"""
    pdf_file = Path(pdf_path)
    if not pdf_file.exists():
        raise FileNotFoundError(f"文件不存在: {pdf_path}")

    print(f"正在处理: {pdf_file.name}")

    # 转换 PDF 为图片
    images = convert_from_path(pdf_path, dpi=300)
    print(f"共 {len(images)} 页")

    # OCR 识别
    all_text = []
    for i, image in enumerate(images, 1):
        print(f"识别第 {i}/{len(images)} 页...")
        text = pytesseract.image_to_string(image, lang=lang)
        all_text.append(f"--- 第 {i} 页 ---\n{text}\n")

    return "\n".join(all_text)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python pdf_ocr.py <pdf文件路径> [输出文件.txt]")
        sys.exit(1)

    pdf_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else pdf_path.replace(".pdf", "_ocr.txt")

    text = extract_text_from_pdf(pdf_path)

    Path(output_path).write_text(text, encoding="utf-8")
    print(f"\n✓ 提取完成: {output_path}")
