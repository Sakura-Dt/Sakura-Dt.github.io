"""Optional maintenance tool: make local WOFF2 fonts from upstream OFL TTFs.
Usage: python scripts/subset_fonts.py /path/to/official-font-directory
Requires fonttools[woff]. No font build is required to run/deploy the website.
"""
from pathlib import Path
from html.parser import HTMLParser
import argparse
import hashlib
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib.instancer import instantiateVariableFont
ROOT = Path(__file__).resolve().parents[1]
class VisibleText(HTMLParser):
    def __init__(self): super().__init__(); self.parts=[]
    def handle_data(self,data): self.parts.append(data)
def build(source):
    parser=VisibleText()
    for page in ROOT.glob('*.html'): parser.feed(page.read_text())
    # Include feedback strings and ASCII so later English edits never require a rebuild.
    text=''.join(parser.parts)+(ROOT/'assets/js/main.js').read_text()
    chars={ord(c) for c in text if ord(c)>=0x2e80}
    latin=set(range(0x20,0x100))|{0x2190,0x2191,0x2192,0x2193,0x2197,0x2198,0x21b3,0x2212,0x2013,0x2014,0x2018,0x2019,0x201c,0x201d,0x2022,0x2026,0x2715}
    for name,axes,unicodes in [('Archivo',{'wdth':(75,100),'wght':(400,700)},latin),('NotoSansSC',{'wght':(400,700)},chars)]:
        path=source/f'{name}.ttf'
        font=TTFont(path)
        instantiateVariableFont(font,axes,inplace=True)
        options=subset.Options(); options.flavor='woff2';options.layout_features=['kern','liga','locl'];options.name_IDs=['*']
        sub=subset.Subsetter(options=options);sub.populate(unicodes=unicodes);sub.subset(font)
        font.flavor='woff2';target=ROOT/f'assets/fonts/{name}-subset.woff2';font.save(target)
        print(f'{target.name}: {target.stat().st_size} bytes; source sha256={hashlib.sha256(path.read_bytes()).hexdigest()}')
    (ROOT/'assets/fonts/coverage.txt').write_text(''.join(chr(n) for n in sorted(chars)))
if __name__=='__main__':
    args=argparse.ArgumentParser();args.add_argument('source',type=Path);build(args.parse_args().source)
