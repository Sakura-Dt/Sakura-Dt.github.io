"""按扩展名整理目录：默认只预览，--apply 后输入确认文字才移动文件。"""
import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import sys

GROUPS = {
    'images': {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'},
    'documents': {'.txt', '.md', '.pdf', '.doc', '.docx', '.csv', '.xlsx'},
    'archives': {'.zip', '.7z', '.tar', '.gz'},
    'media': {'.mp3', '.wav', '.mp4', '.mov'},
}
LOG_NAME = '.organizer-log.jsonl'


def plan_files(folder):
    """只扫描一层，跳过目录、符号链接和隐藏文件，不修改任何文件。"""
    folder = Path(folder).resolve(strict=True)
    if not folder.is_dir():
        raise ValueError('目标必须是目录')
    plan = []
    for source in sorted(folder.iterdir(), key=lambda p: p.name.casefold()):
        if source.is_symlink() or not source.is_file() or source.name.startswith('.'):
            continue
        category = next((name for name, extensions in GROUPS.items()
                         if source.suffix.lower() in extensions), 'others')
        destination = folder / category / source.name
        # 同名文件、链接或异常分类目录都不覆盖；保留原文件并在预览中说明。
        parent = destination.parent
        blocked = (parent.is_symlink() or (parent.exists() and not parent.is_dir())
                   or destination.exists() or destination.is_symlink())
        plan.append((source, destination, 'skip' if blocked else 'move', source.stat()))
    return plan


def apply_plan(folder, plan):
    """返回移动数、跳过数。遇到错误立即停止，之前完成的记录可在日志查询。"""
    folder = Path(folder).resolve(strict=True)
    log = folder / LOG_NAME
    if log.is_symlink():
        raise ValueError('日志位置是符号链接，已取消')
    moved = skipped = 0
    # 在执行前先确认日志可写。日志只包含相对文件名，保存在用户目标目录。
    with log.open('a', encoding='utf-8') as stream:
        for source, destination, action, original in plan:
            if action == 'skip':
                skipped += 1
                continue
            if source.parent != folder or destination.parent.parent != folder:
                raise ValueError('计划包含目标目录以外的路径')
            current = source.lstat()
            if source.is_symlink() or (current.st_dev, current.st_ino, current.st_size, current.st_mtime_ns) != (
                    original.st_dev, original.st_ino, original.st_size, original.st_mtime_ns):
                raise ValueError(f'文件在预览后发生变化，已停止：{source.name}')
            if destination.parent.is_symlink():
                raise ValueError('分类目录是符号链接，已停止')
            destination.parent.mkdir(exist_ok=True)
            try:
                # 在同一文件系统中先创建硬链接，目标已存在时操作会失败而非覆盖。
                os.link(source, destination, follow_symlinks=False)
            except FileExistsError:
                skipped += 1
                continue
            try:
                source.unlink()
            except OSError:
                destination.unlink()
                raise
            record = {'time': datetime.now(timezone.utc).isoformat(),
                      'from': source.name, 'to': destination.relative_to(folder).as_posix()}
            stream.write(json.dumps(record, ensure_ascii=False) + '\n')
            stream.flush()
            print(f'已移动：{record["from"]} -> {record["to"]}')
            moved += 1
    return moved, skipped


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('folder', type=Path, help='需要预览或整理的目录')
    parser.add_argument('--apply', action='store_true', help='预览后要求输入 MOVE，确认后执行')
    args = parser.parse_args()
    try:
        folder = args.folder.expanduser().resolve(strict=True)
        plan = plan_files(folder)
        for source, destination, action, _ in plan:
            label = '跳过：目标已存在或不可用' if action == 'skip' else '待移动'
            print(f'{label} | {source.name} -> {destination.relative_to(folder).as_posix()}')
        pending = sum(action == 'move' for _, _, action, _ in plan)
        print(f'预览：{pending} 个待移动，{len(plan) - pending} 个跳过。')
        if not args.apply or not pending:
            print('未修改文件。' if not args.apply else '没有需要移动的文件。')
            return 0
        if input('确认后将移动上述文件。输入 MOVE 继续：').strip() != 'MOVE':
            print('已取消，未修改文件。')
            return 0
        moved, skipped = apply_plan(folder, plan)
        print(f'完成：移动 {moved} 个，跳过 {skipped} 个。日志：{LOG_NAME}')
        return 0
    except (OSError, ValueError, EOFError) as error:
        print(f'操作停止：{error}。执行中出错时，部分文件可能已移动，请核对目录及日志。', file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
