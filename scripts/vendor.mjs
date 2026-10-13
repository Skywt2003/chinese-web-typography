import { copyFile, mkdir, writeFile } from "node:fs/promises";
const dest = new URL("../demo/vendor/", import.meta.url);
await mkdir(dest, { recursive: true });
for (const [source, target] of [
	["pangu/dist/browser/pangu.umd.js", "pangu.umd.js"],
	["pangu/LICENSE", "pangu.LICENSE"],
	["@fontsource/noto-sans-sc/LICENSE", "noto-sans-sc.LICENSE"],
	...[400, 600].map((weight) => [
		`@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-${weight}-normal.woff2`,
		`noto-sans-sc-${weight}.woff2`,
	]),
])
	await copyFile(
		new URL(`../node_modules/${source}`, import.meta.url),
		new URL(target, dest),
	);
await writeFile(
	new URL("README.md", dest),
	"# Vendored dependencies\n\n- pangu 10.4.1: https://github.com/vinta/pangu.js (MIT).\n- Noto Sans SC, @fontsource/noto-sans-sc 5.3.1: https://github.com/notofonts/noto-cjk (SIL OFL 1.1). Simplified Chinese WOFF2, weights 400 and 600.\n\nRegenerate with `pnpm install --frozen-lockfile && pnpm vendor`. License files accompany both distributions.\n",
);
