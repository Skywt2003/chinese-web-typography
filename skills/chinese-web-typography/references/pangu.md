# Integrating pangu.js

Tested dependency: `pangu@10.4.1`. [Upstream source and documentation](https://github.com/vinta/pangu.js).

```sh
pnpm add pangu@10.4.1 --save-exact
```

## Render-time strings (preferred for React / SSR)

```js
// Node/server
import pangu from 'pangu';
const title = pangu.spaceText('用Mac记录第3个灵感');
// 用 Mac 记录第 3 个灵感
```

```js
// Browser bundler; the shared entry avoids importing Node fs APIs.
import { Pangu } from 'pangu/shared';
const pangu = new Pangu();
const title = pangu.spaceText(sourceTitle);
```

Pass the result as a normal text child (`<h1>{title}</h1>`), not as HTML. Use equivalent formatting on the server and first client render; avoid a page-wide DOM mutation pass over hydrated React/Vue content. Transform complete logical prose strings before splitting them into styled segments: formatting separate text nodes can miss boundaries across inline elements. Add deliberate nowrap groups afterwards.

Apply only to fields known to be display prose. Keep code, URLs, paths, email addresses, input values, contenteditable regions, identifiers, exact quotations, and explicitly exempt brand spellings outside the transform. Do not blindly rewrite ICU messages or Markdown source; transform eligible parsed text with awareness of links, inline code, placeholders, and cross-node boundaries. If a technical token sits inside a prose string, protect it explicitly or leave that string for manual spacing.

Pangu also has punctuation and symbol opinions. Review transformed samples, especially numbers, operators, and punctuation. Do not assume every textual change is the insertion of an ASCII space.

## Static HTML

The [source repository demo](https://github.com/Skywt2003/chinese-web-typography/tree/main/demo) vendors `dist/browser/pangu.umd.js` with its MIT license, so no CDN or install is needed to open it. For a bundler-free site, copy the pinned distribution and license:

```html
<script src="./vendor/pangu.umd.js"></script>
<p id="caption"></p>
<script>
  document.querySelector('#caption').textContent =
    pangu.spaceText('为你的Mac留一点空间');
</script>
```

For a genuinely static, non-framework prose subtree, `pangu.spaceNode(element)` is also available. Inspect its behavior around nested markup and exclusions before adopting it. Avoid `autoSpacePage()` as a default integration: whole-document mutation is unnecessary when the content pipeline is under your control.

## CSS policy

```css
/* Scope to text whose real whitespace is deliberately managed. */
.managed-spacing { text-autospace: no-autospace; }
```

This prevents native auto-spacing from becoming an additional strategy in browsers that support the property. An unsupported browser simply ignores it and still renders real spaces. Existing spaces should remain stable under repeated formatting; test representative copy. Intentional NBSP product groups are constructed after formatting and separately tested.

In the source repository (not the installed skill), the vendored file can be refreshed using `pnpm vendor`; keep its version, upstream license, lockfile, and tests in sync. Do not silently switch to an unpinned CDN `latest` URL.
