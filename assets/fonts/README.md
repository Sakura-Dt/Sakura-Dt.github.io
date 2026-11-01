# Local type system

Two self-hosted variable WOFF2 files provide consistent glyphs without runtime external requests:

- **Archivo**: Latin text and display typography. Weight 400–700, width 75–100. [Official source](https://github.com/google/fonts/tree/main/ofl/archivo). Original source SHA-256: `0e094a7d3c7c4c25cf1310c4b30014f1dae9332220b1c2c88f4fa996f0b05053`.
- **Noto Sans SC**: Chinese text and headings. Weight 400–700. [Official source](https://github.com/google/fonts/tree/main/ofl/notosanssc). Original source SHA-256: `a3041811a78c361b1de50f953c805e0244951c21c5bd412f7232ef0d899af0da`.

Both are under SIL Open Font License 1.1. Complete licenses, including upstream copyright statements, are retained alongside the fonts. These are subsets, not original unmodified binaries; the OFL Reserved Font Name `Source` is not used as a modified family name. No font assets from game PVs are used.

The Latin font includes common Latin characters and interface arrows. The shared CJK subset covers the current source copy in `content/site.json`, including motion labels and feedback. The previous stage-specific CJK supplements have been consolidated into this file, so all pages use the same glyphs and weights. No runtime font service is used.

Regenerate HTML before rebuilding fonts:

```
python scripts/render_site.py
python scripts/subset_fonts.py /path/to/official-font-directory
```

The optional font tool requires `fonttools[woff]` and the official Archivo.ttf and NotoSansSC.ttf files from the sources above. Review the printed source hashes and generated coverage. The website itself needs no font build or installed dependencies. `coverage.txt` records included CJK characters.

Stage 05 retains the same font sources and 400–700 weight range. The CJK subset is about 115 KiB, with a 43 KiB Latin subset. The complete-page browser budget remains 320 KiB of decoded resources.
