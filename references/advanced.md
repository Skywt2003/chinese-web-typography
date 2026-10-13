# Font balance and display punctuation

## Hanging punctuation

For a known short heading with enough outer gutter:

```html
<h2 class="title">让细节<span class="last-word">恰到好处<span class="hang">。</span></span></h2>
```

```css
.title { text-align: center; padding-inline: 1em; }
.last-word { white-space: nowrap; }
.hang { display: inline-block; width: 0; overflow: visible; }
```

This centers the non-punctuation advance width while leaving the punctuation visible. It is an editorial approximation, not a mathematical measurement of glyph ink. Check the actual font and every line layout. Preserve the glyph as real text; do not add `aria-hidden` to meaningful punctuation. Keep a gutter at the edge and do not clip the heading. On narrow or unpredictable copy, revert to ordinary punctuation layout if the treatment cannot fit safely.

An absolute-positioned punctuation span or a measured local offset can also work. Do not combine corrections, and do not hardcode a universal offset copied from another font. CSS `hanging-punctuation` is another option only after checking target browser support; this demo does not depend on it.

## Font balance

Inspect actual font fallback for Chinese, Latin letters, digits, and punctuation. Compare glyph heights, perceived weight, baseline, and line height. Prefer a family intentionally designed for mixed text before per-script resizing. If sizing Latin runs manually, test uppercase/lowercase, numbers, bold weights, and multiline copy. Do not transform-scale all CJK glyphs or assume that one ratio works across families.

The demo uses redistributable Noto Sans SC consistently on both sides so that spacing and line composition can be compared without a font swap. It does not recreate SF Pro SC.

## Punctuation compression

Some fonts support OpenType `halt` or `chws`; support and results are font-dependent. Test the chosen feature on opening/closing brackets, quotes, consecutive punctuation, and line edges, as well as ordinary commas and periods. Do not stack multiple half-width treatments. Retain the original fullwidth punctuation code points. Restrict experiments to a display-text class and visually compare before broadening scope.

Font engineering and culturally sensitive copy localization are outside this skill's core workflow. Raise a concrete observation when relevant rather than silently rewriting the author's message.
