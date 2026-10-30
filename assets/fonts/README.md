# Local type system

Two self-hosted variable WOFF2 files provide consistent glyphs without runtime external requests:

- **Archivo**: Latin text and display typography. Weight 400–700, width 75–100. [Official source](https://github.com/google/fonts/tree/main/ofl/archivo). Original source SHA-256: `0e094a7d3c7c4c25cf1310c4b30014f1dae9332220b1c2c88f4fa996f0b05053`.
- **Noto Sans SC**: Chinese text and headings. Weight 400–700. [Official source](https://github.com/google/fonts/tree/main/ofl/notosanssc). Original source SHA-256: `a3041811a78c361b1de50f953c805e0244951c21c5bd412f7232ef0d899af0da`.

Both are under SIL Open Font License 1.1. Complete licenses, including upstream copyright statements, are retained alongside the fonts. These are subsets, not original unmodified binaries; the OFL Reserved Font Name `Source` is not used as a modified family name. No font assets from game PVs are used.

The Latin font includes common Latin characters and interface arrows. The CJK subset includes current page characters and interface feedback. Missing characters fall back to the operating system font, so future text remains readable. Rebuild the subset when adding Chinese copy to keep appearance consistent. `coverage.txt` records the included CJK characters.

Optional rebuild (not needed to preview or deploy): obtain the two upstream TTF files above as `Archivo.ttf` and `NotoSansSC.ttf`, install `fonttools[woff]` in a development environment, generate the HTML, then run:

```
python scripts/subset_fonts.py /path/to/official-font-directory
```

Review the reported source hashes, regenerated fonts and coverage before committing. The web runtime remains buildless. Font payload is approximately 155 KiB for both families combined; the browser test's complete-page budget is 256 KiB, including font requests.
