import { test, expect } from "@playwright/test";
const url = "http://127.0.0.1:4173";
async function ready(page, query = "") {
	await page.goto(url + query);
	await page.waitForSelector('html[data-ready="true"]');
	await page.evaluate(() => document.fonts.ready);
}
async function lineCounts(locator) {
	return locator.evaluate((element) => {
		const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
		const lines = new Map();
		let node;
		while ((node = walker.nextNode())) {
			for (let i = 0; i < node.length; i++) {
				if (/\s/.test(node.data[i])) continue;
				const range = document.createRange();
				range.setStart(node, i);
				range.setEnd(node, i + 1);
				const rect = range.getBoundingClientRect();
				const top = Math.round(rect.top);
				lines.set(top, (lines.get(top) || "") + node.data[i]);
			}
		}
		return [...lines.values()];
	});
}
test("real pangu transform, controls, and preserved wording", async ({
	page,
}) => {
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	await ready(page);
	await expect(page.locator("#spacing-after")).toHaveText(
		"在 Mac 上打开第 3 个灵感，用 iPhone 记录 24 小时的日常。",
	);
	for (const id of [
		"spacing",
		"orphan",
		"semantic",
		"responsive",
		"product",
		"optical",
	]) {
		const text = await page.locator(`#${id} .sample`).allTextContents();
		expect(text[0].replace(/\s/g, "")).toBe(text[1].replace(/\s/g, ""));
	}
	await page.getByRole("button", { name: "After", exact: true }).click();
	await expect(page.locator(".panel.before").first()).toBeHidden();
	await expect(
		page.getByRole("button", { name: "After", exact: true }),
	).toHaveAttribute("aria-pressed", "true");
	await page.locator("#width").fill("300");
	await expect(page.locator("#width-value")).toHaveText("300 px");
	expect((await page.request.get(url + "/missing-favicon.ico")).status()).toBe(
		404,
	);
	expect((await page.request.get(url)).status()).toBe(200);
	expect(errors).toEqual([]);
});
test("final word and semantic units stay on one line", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await ready(page);
	for (const width of [260, 280, 320, 360, 400, 430, 431, 480, 600]) {
		await page.locator("#width").fill(String(width));
		for (const locator of await page
			.locator("#orphan [data-protected], #semantic [data-protected]")
			.all()) {
			expect(await lineCounts(locator)).toHaveLength(1);
		}
	}
});
test("responsive title changes at the actual container boundary", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await ready(page, "?view=after&width=430");
	await expect(page.locator(".responsive-break")).toHaveCSS("display", "block");
	expect(
		await lineCounts(page.locator("#responsive .after .headline")),
	).toEqual(["给灵感留白，", "让创作发生。"]);
	await page.locator("#width").fill("431");
	await expect(page.locator(".responsive-break")).toHaveCSS("display", "none");
	await page.locator("#width").fill("600");
	expect(
		await lineCounts(page.locator("#responsive .after .headline")),
	).toHaveLength(1);
});
test("hanging punctuation keeps the written text and centers the word", async ({
	page,
}) => {
	await ready(page, "?view=after");
	const delta = await page
		.locator("#optical .after .optical")
		.evaluate((element) => {
			const node = element.querySelector(".nowrap").firstChild;
			const range = document.createRange();
			range.selectNodeContents(node);
			const text = range.getBoundingClientRect();
			const box = element.getBoundingClientRect();
			return Math.abs((text.left + text.right - box.left - box.right) / 2);
		});
	expect(delta).toBeLessThan(1);
	await expect(page.locator("#optical .after .optical")).toHaveText(
		"恰到好处。",
	);
});
for (const width of [320, 375, 390, 768, 1024, 1440]) {
	test(`no clipped text or horizontal overflow at ${width}px`, async ({
		page,
	}) => {
		await page.setViewportSize({ width, height: 1000 });
		await ready(page);
		const problems = await page.evaluate(() => {
			const errors = [];
			if (document.documentElement.scrollWidth > innerWidth)
				errors.push("document overflow");
			for (const sample of document.querySelectorAll(".sample")) {
				const stage = sample.closest(".stage").getBoundingClientRect();
				const walker = document.createTreeWalker(sample, NodeFilter.SHOW_TEXT);
				let node;
				while ((node = walker.nextNode())) {
					const range = document.createRange();
					range.selectNodeContents(node);
					for (const rect of range.getClientRects()) {
						if (
							rect.width &&
							(rect.left < stage.left - 1 || rect.right > stage.right + 1)
						)
							errors.push(sample.closest(".case").id);
					}
				}
			}
			return errors;
		});
		expect(problems).toEqual([]);
	});
}
test("works offline via file URL and survives unavailable webfonts", async ({
	page,
}) => {
	await page.route("**/*.woff2", (route) => route.abort());
	await page.goto(new URL("../demo/index.html", import.meta.url).href);
	await page.waitForSelector('html[data-ready="true"]');
	await expect(page.locator("#spacing-after")).toContainText("在 Mac 上");
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth,
		),
	).toBe(true);
});
test("default fixtures expose actual problems and visibly improve their line endings", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await ready(page);
	const orphanBefore = await lineCounts(
		page.locator("#orphan .before .orphan"),
	);
	const orphanAfter = await lineCounts(page.locator("#orphan .after .orphan"));
	expect(orphanBefore.at(-1)).toBe("受。");
	expect(orphanAfter.at(-1)).toBe("享受。");
	const semanticBefore = await lineCounts(
		page.locator("#semantic .before .semantic"),
	);
	const semanticAfter = await lineCounts(
		page.locator("#semantic .after .semantic"),
	);
	expect(semanticBefore.some((line) => line.includes("清晰"))).toBe(false);
	expect(semanticAfter.some((line) => line.includes("清晰"))).toBe(true);
	const productBefore = await lineCounts(
		page.locator("#product .before .product"),
	);
	const productAfter = await lineCounts(
		page.locator("#product .after .product"),
	);
	expect(productBefore.some((line) => line.includes("StudioNotePro"))).toBe(
		false,
	);
	expect(productAfter.some((line) => line.includes("StudioNotePro"))).toBe(
		true,
	);
});
test("200% page zoom equivalent reflows the comparison without horizontal scrolling", async ({
	page,
}) => {
	// 1280 physical pixels at 200% page zoom yield a 640 CSS-pixel layout viewport.
	await page.setViewportSize({ width: 640, height: 500 });
	await ready(page);
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= innerWidth,
		),
	).toBe(true);
	await expect(page.locator("#responsive .after .headline")).toBeVisible();
});
test("a longer product name retains a legal break and fits a narrow container", async ({
	page,
}) => {
	await page.setViewportSize({ width: 320, height: 1000 });
	await ready(page);
	await page.locator("#product .after .long-name").evaluate((element) => {
		element.textContent = "Studio Creative Edition Note\u00a0Pro";
	});
	const lines = await lineCounts(page.locator("#product .after .long-name"));
	expect(lines.length).toBeGreaterThan(1);
	expect(lines.some((line) => line.includes("NotePro"))).toBe(true);
	expect(
		await page
			.locator("#product .after .sample")
			.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
	).toBe(true);
});
