"""检查静态页面的资源、锚点与本机路径。仅使用 Python 标准库。"""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids = []
        self.links = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for name in ('href', 'src'):
            if name in attrs:
                self.links.append(attrs[name])


def check(root=ROOT):
    errors = []
    pages = {p: Page(p.read_text(encoding='utf-8')) for p in root.rglob('*.html')
             if not any(part.startswith('.') or part == 'node_modules' for part in p.relative_to(root).parts)}
    if root / 'index.html' not in pages:
        errors.append('缺少根目录 index.html')

    def check_link(source, url):
        parsed = urlsplit(url)
        # 外部链接不联网检查，以免网络波动阻塞发布；本地引用必须能解析。
        if parsed.scheme or parsed.netloc:
            return
        if parsed.path.startswith('/'):
            errors.append(f'{source.relative_to(root)}: 请使用相对路径：{url}')
            return
        target = (source.parent / unquote(parsed.path)).resolve() if parsed.path else source
        if not target.is_relative_to(root):
            errors.append(f'{source.relative_to(root)}: 链接超出项目目录：{url}')
            return
        if target.is_dir():
            target /= 'index.html'
        # 逐级比较名称，Windows 本地也能发现会在 Linux 上失败的大小写错误。
        current = root
        for part in target.relative_to(root).parts:
            if not current.is_dir() or part not in {p.name for p in current.iterdir()}:
                errors.append(f'{source.relative_to(root)}: 找不到文件（区分大小写）：{url}')
                return
            current /= part
        if not target.is_file():
            errors.append(f'{source.relative_to(root)}: 资源不是文件：{url}')
        elif parsed.fragment and target in pages and unquote(parsed.fragment) not in pages[target].ids:
            errors.append(f'{source.relative_to(root)}: 找不到锚点：{url}')

    for path, page in pages.items():
        for name, count in Counter(page.ids).items():
            if count > 1:
                errors.append(f'{path.relative_to(root)}: 重复 id：{name}')
        for url in page.links:
            check_link(path, url)
    for path in (root / 'assets').rglob('*.css'):
        for match in re.finditer(r'url\(\s*[\'\"]?([^\)\'\"]+)[\'\"]?\s*\)', path.read_text(encoding='utf-8')):
            check_link(path, match[1].strip())

    # 扫描公开内容，避免把开发电脑的用户目录再次写进网站或 README。
    files = list(pages) + [root / 'README.md'] + list((root / 'assets').rglob('*'))
    machine_path = re.compile(r'/home/[^/\s]+/|/mnt/[a-z]/Users/|[A-Za-z]:[\\/](?:Users|home)[\\/]', re.I)
    for path in files:
        if path.is_file() and path.suffix in ('.html', '.md', '.css', '.js', '.svg'):
            if machine_path.search(path.read_text(encoding='utf-8')):
                errors.append(f'{path.relative_to(root)}: 包含本机用户目录路径')
    return errors


if __name__ == '__main__':
    errors = check()
    for error in errors:
        print('FAIL:', error)
    if errors:
        sys.exit(1)
    print('PASS: 静态资源、页内锚点、文件大小写与本机路径检查')
