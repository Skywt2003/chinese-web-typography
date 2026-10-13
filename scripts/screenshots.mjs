import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const dir = new URL("../screenshots/", import.meta.url);
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ channel: "chromium" });
try {
	const page = await browser.newPage({
		viewport: { width: 1440, height: 1000 },
		deviceScaleFactor: 1,
	});
	for (const [name, view, width] of [
		["comparison", "compare", 1440],
		["before", "before", 900],
		["after", "after", 900],
		["mobile-comparison", "compare", 390],
	]) {
		await page.setViewportSize({ width, height: 1000 });
		await page.goto(
			new URL(`../demo/index.html?view=${view}&width=360`, import.meta.url)
				.href,
		);
		await page.waitForSelector('html[data-ready="true"]');
		await page.evaluate(() => document.fonts.ready);
		await page.screenshot({
			path: fileURLToPath(new URL(`${name}.png`, dir)),
			fullPage: true,
		});
		console.log(`screenshots/${name}.png`);
	}
} finally {
	await browser.close();
}
