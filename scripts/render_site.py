"""Generate static HTML from central copy. No runtime fetch or build server required."""
from pathlib import Path
import json
import re
import argparse
ROOT = Path(__file__).resolve().parents[1]
def render(check=False):
    data = json.loads((ROOT / 'content/site.json').read_text(encoding='utf-8'))
    copy = data['copy']
    results = {}
    for template in (ROOT / 'templates').glob('*.tpl'):
        source = template.read_text(encoding='utf-8')
        result = re.sub(r'\{\{([\w]+)\}\}', lambda m: copy[m[1]], source)
        results[template.stem + '.html'] = result
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
