import sys
print('PYTHON:', sys.executable)
print('VERSION:', sys.version)
try:
    import docx
    print('DOCX OK, module name:', docx.__name__)
except Exception as e:
    print('DOCX IMPORT ERROR:', e)
try:
    from docx import Document
    doc = Document(r'D:\dev\新手外贸销售实战手册.docx')
    print('OPEN OK, paragraphs:', len(doc.paragraphs))
except Exception as e:
    print('OPEN ERROR:', e)
