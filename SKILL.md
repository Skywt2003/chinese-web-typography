---
name: chinese-web-typography
description: "Refine Chinese web typography and mixed Chinese–Latin copy: spacing with pangu.js, semantic wrapping, short final lines, responsive headlines, product names, and optical punctuation alignment. Use when building or polishing Chinese web pages or reviewing their typography."
---

# Chinese web typography

Make Chinese copy read naturally at its actual rendered size. Preserve the author's wording, the site's visual identity, and the requested scope. Start with simplified Chinese; inspect punctuation and language conventions before applying examples to traditional Chinese or other CJK languages.

Inspired by SkyWT's [Apple 官网排版细节鉴赏](https://skywt.cn/blog/apple-typography-details). Transfer the reasoning, not Apple's private fonts, fixed breakpoints, or numerical offsets.

## Inspect before changing

Read the text, font stack, layout constraints, locale source, and existing whitespace conventions. Distinguish display headlines and short marketing copy from flowing body text, controls, code, and user input. In a browser, wait for fonts and inspect actual line endings at the project's mobile, intermediate, and desktop container widths. A viewport breakpoint alone does not describe a nested component's available width.

If a browser is unavailable, implement only defensible source-level changes and say that visual verification remains outstanding. Do not claim to have checked screenshots or line breaks.

## Apply the relevant rules

### 1. Space Chinese–Latin and Chinese–digit boundaries

Use **pangu.js** when text needs real spaces. This skill's demo pins `pangu@10.4.1`, whose synchronous string API is `spaceText` (older versions use different APIs). Read [pangu integration](references/pangu.md) for exact imports, framework integration, exclusions, and tradeoffs.

Prefer transforming approved prose strings before rendering, identically on server and client. Keep the source intact unless editing it is requested. Do not run a formatter across raw HTML, JSX, Markdown syntax, code, URLs, identifiers, or an entire translation file. Retain exceptions for intentionally unspaced brand names. Review punctuation/symbol changes too: pangu is opinionated, not solely a boundary-space inserter.

Choose one spacing strategy per content region. Do not add CSS autospace on top of inserted spaces. Do not use letter-spacing as a substitute for boundary spacing.

### 2. Protect short semantic units where wrapping hurts

Read the words that cross actual line endings. Wrap the smallest meaningful unit in a span with `white-space: nowrap`, when it fits the smallest supported container. Include adjacent closing punctuation if needed. Fix one unit and re-check all widths: changing one break changes later breaks.

For an isolated final character or very short final line, protect a short final word/phrase together with its punctuation. Do not universally bind the final N characters or every Chinese word. Do not disable wrapping on whole paragraphs. In dynamic long-form content, avoid editorial break markup tied to today's copy; accept natural flow or use an appropriate progressive CSS improvement after checking browser support and actual behavior.

### 3. Give short headlines deliberate responsive breaks

Break at a semantic boundary. Use an explicit `<br>` only where a particular line composition is intended; scope its visibility to the available width. Container queries can suit reusable nested components. Preserve normal flowing text outside that range. Verify widths just above and below the switch, not just two screenshots.

Do not hide meaningful punctuation at a breakpoint. For a Latin boundary, preserve the separator when a conditional `<br>` is hidden. Do not apply manual headline composition to general body copy.

### 4. Keep product names readable

Use nonbreaking spaces (`\u00a0` / `&nbsp;`) or a scoped nowrap span for short names that fit. For longer names, choose a sensible group, for example `Studio` + `Note Pro`, and retain a normal break opportunity between groups. Let the group wrap again at very narrow widths if necessary. Do not let a long protected name force horizontal scrolling.

Apply pangu spacing before adding markup or deliberate nonbreaking separators, and confirm that text remains correct when copied and read aloud.

### 5. Optically center punctuated display headings

Inspect actual glyphs relative to a centered reference. If trailing punctuation creates visible imbalance, consider a hanging punctuation span or a measured local adjustment. Preserve punctuation in the accessible text. A hanging span must remain attached to the last word and have enough space to avoid clipping or overlap.

Re-check each resulting line when the title wraps. Do not shift every title by `0.5em`: the appropriate adjustment depends on glyph side bearings, punctuation width, font, and line composition. See [advanced treatment](references/advanced.md).

### 6. Diagnose fonts and punctuation width conservatively

Equal CSS font sizes need not produce equal perceived Chinese and Latin sizes. Prefer a coherent font family or compatible fallback pair, then inspect weight, baseline, and optical size. Changing the font can invalidate earlier line-break work.

Punctuation compression is an optional display treatment, not a global rule. Preserve fullwidth Unicode punctuation; only use font features supported by the chosen font and validated visually. See [advanced treatment](references/advanced.md). Do not bundle Apple's private web fonts or infer a license from a downloadable URL.

## Verify the result

- Compare the same copy, font size, and container width before/after. Isolate individual rules before combining them.
- Check the narrowest supported width, intermediate widths, and responsive boundaries; include longer names and enlarged text. No new horizontal overflow, clipped punctuation, accidental word splitting, or overlapping glyphs.
- Wait for `document.fonts.ready`; check fallback behavior when web fonts are unavailable.
- Keep headings, links, focus order, and reading order intact. Decorative guide lines are hidden from assistive technology.
- For pangu, verify already-spaced copy is stable, excluded content is untouched, and rendering is consistent across server/client.
- Report what changed, why, which widths/browser were checked, and any unverified font/browser combinations. Do not equate passing layout assertions with a subjective visual review.

## Companion demo

`demo/index.html` is an offline-capable before/after gallery with six isolated cases, a container-width slider, and switchable views. It uses vendored pangu and an open font; open it directly or run `pnpm demo`. `pnpm test` checks spacing and browser layout; `pnpm screenshots` captures reproducible comparisons. These are reference fixtures, not a script to rewrite somebody else's website.
