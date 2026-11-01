"""Generate static HTML from central copy. No runtime fetch or build server required."""
from pathlib import Path
import json
import re
import argparse
ROOT = Path(__file__).resolve().parents[1]
def render(check=False):
    data = json.loads((ROOT / 'content/site.json').read_text(encoding='utf-8'))
    copy = dict(data['copy'])
    for group, entries in data.items():
        if isinstance(entries, dict):
            copy.update({f'{group}.{key}': value for key, value in entries.items() if isinstance(value, str)})
    results = {'assets/js/copy.js': '/* Generated from content/site.json; edit the source content. */\nwindow.SAKURA_COPY = Object.freeze(' + json.dumps(data['runtime'], ensure_ascii=False, separators=(',', ':')) + ');\n'}
    for template in (ROOT / 'templates').glob('*.tpl'):
        source = template.read_text(encoding='utf-8')
        result = re.sub(r'\{\{([\w.]+)\}\}', lambda m: copy[m[1]], source)
        results[template.stem + '.html'] = result
    # The Web showcase renders the real opening markup, rather than a drawn device mockup.
    home = results['index.html']
    preview = home[:home.index('<section id="projects"')] + '</main></body></html>'
    preview = re.sub(r'<script src="\./assets/js/(?:order|dimensions|finale)\.js" defer></script>', '', preview)
    preview = preview.replace('<link rel="stylesheet" href="./assets/css/finale.css">', '')
    preview = preview.replace('./assets/', '../../assets/').replace('./index.html', '../../index.html')
    preview = preview.replace('href="#projects"', 'href="../../index.html#projects"').replace('href="#contact"', 'href="../../index.html#contact"').replace('href="#next"', 'href="../../index.html#next"')
    freeze = '<style>html,body{overflow:hidden!important}*{animation:none!important;transition:none!important}</style><script>if(parent!==window){for(const t of ["resize","scroll"])addEventListener(t,e=>e.stopImmediatePropagation(),true);const m=window.matchMedia.bind(window);window.matchMedia=(...a)=>{const q=m(...a);q.addEventListener=()=>{};q.addListener=()=>{};return q}}</script>'
    preview = preview.replace('</head>', freeze + '</head>')
    results['assets/previews/site-view.html'] = preview
    for name, result in results.items():
        target = ROOT / name
        if check:
            if not target.exists() or target.read_text(encoding='utf-8') != result:
                raise SystemExit(f'Generated page out of date: {name}')
        else:
            target.write_text(result, encoding='utf-8')
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    render(parser.parse_args().check)
