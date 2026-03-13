import sys, zipfile, re

def docx_to_text(infile):
    with zipfile.ZipFile(infile) as z:
        raw = z.read('word/document.xml').decode('utf-8')
    text = re.sub(r'<w:p[^>]*>', '\n', raw)
    text = re.sub(r'<w:br[^/>]*/?>', '\n', text)
    text = re.sub(r'<w:t[^>]*>', '', text)
    text = re.sub(r'</w:t>', '', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\n{2,}', '\n\n', text)
    return text.strip()

if __name__ == '__main__':
    if len(sys.argv) >= 3:
        infile = sys.argv[1]
        outfile = sys.argv[2]
    else:
        infile = r'D:\dev\新手外贸销售实战手册.docx'
        outfile = r'D:\dev\新手外贸销售实战手册.txt'
    try:
        txt = docx_to_text(infile)
        with open(outfile, 'w', encoding='utf-8') as f:
            f.write(txt)
        print('WROTE', outfile)
    except Exception as e:
        print('ERROR', e)
