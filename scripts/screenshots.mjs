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
	for (const [name, width] of [
		["comparison", 1440],
		["mobile-comparison", 390],
	]) {
		await page.setViewportSize({ width, height: 1000 });
		await page.goto(new URL("../demo/index.html", import.meta.url).href);
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
