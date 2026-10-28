"""所有文件操作只发生在临时目录内。"""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'tools' / 'file_organizer.py'
spec = importlib.util.spec_from_file_location('organizer', SCRIPT)
organizer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(organizer)


class OrganizerTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.folder = Path(self.temp.name)

    def test_preview_and_cancel_do_not_write(self):
        file = self.folder / '照片.JPG'
        file.write_bytes(b'photo')
        for flags, answer in [([], ''), (['--apply'], 'no\n')]:
            result = subprocess.run([sys.executable, str(SCRIPT), str(self.folder), *flags],
                                    input=answer, text=True, capture_output=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(list(self.folder.iterdir()), [file])

    def test_moves_categories_and_records_relative_names(self):
        for name in ['照片.JPG', 'notes.txt', 'unknown.bin']:
            (self.folder / name).write_bytes(b'content')
        moved, skipped = organizer.apply_plan(self.folder, organizer.plan_files(self.folder))
        self.assertEqual((moved, skipped), (3, 0))
        for name in ['images/照片.JPG', 'documents/notes.txt', 'others/unknown.bin']:
            self.assertEqual((self.folder / name).read_bytes(), b'content')
        records = [json.loads(line) for line in (self.folder / organizer.LOG_NAME).read_text(encoding='utf-8').splitlines()]
        self.assertEqual(len(records), 3)
        self.assertTrue(all(not Path(record['to']).is_absolute() for record in records))

    def test_existing_target_is_never_overwritten(self):
        (self.folder / 'documents').mkdir()
        (self.folder / 'documents/a.txt').write_text('original')
        (self.folder / 'a.txt').write_text('new')
        plan = organizer.plan_files(self.folder)
        self.assertEqual(organizer.apply_plan(self.folder, plan), (0, 1))
        self.assertEqual((self.folder / 'documents/a.txt').read_text(), 'original')
        self.assertEqual((self.folder / 'a.txt').read_text(), 'new')

    def test_target_appearing_after_preview_is_skipped(self):
        (self.folder / 'a.txt').write_text('new')
        plan = organizer.plan_files(self.folder)
        (self.folder / 'documents').mkdir()
        (self.folder / 'documents/a.txt').write_text('original')
        self.assertEqual(organizer.apply_plan(self.folder, plan), (0, 1))
        self.assertTrue((self.folder / 'a.txt').exists())

    def test_hidden_files_directories_and_links_are_skipped(self):
        (self.folder / '.hidden').write_text('hidden')
        (self.folder / 'nested').mkdir()
        (self.folder / 'nested/a.txt').write_text('nested')
        (self.folder / 'link.txt').symlink_to(self.folder / 'nested/a.txt')
        self.assertEqual(organizer.plan_files(self.folder), [])

    def test_symlink_category_cannot_move_outside(self):
        (self.folder / 'outside').mkdir()
        (self.folder / 'documents').symlink_to(self.folder / 'outside', target_is_directory=True)
        (self.folder / 'a.txt').write_text('safe')
        self.assertEqual(organizer.apply_plan(self.folder, organizer.plan_files(self.folder)), (0, 1))
        self.assertTrue((self.folder / 'a.txt').exists())

    def test_changed_source_stops_execution(self):
        source = self.folder / 'a.txt'
        source.write_text('before')
        plan = organizer.plan_files(self.folder)
        source.write_text('after modification')
        with self.assertRaises(ValueError):
            organizer.apply_plan(self.folder, plan)
        self.assertTrue(source.exists())

    def test_missing_folder_fails(self):
        with self.assertRaises(FileNotFoundError):
            organizer.plan_files(self.folder / 'missing')


if __name__ == '__main__':
    unittest.main()
