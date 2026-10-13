import { defineConfig } from "@playwright/test";
export default defineConfig({
	testDir: "./tests",
	testMatch: "**/*.spec.mjs",
	fullyParallel: true,
	reporter: "list",
	use: { browserName: "chromium", channel: "chromium", headless: true },
	webServer: {
		command: "node scripts/serve.mjs",
		url: "http://127.0.0.1:4173",
		reuseExistingServer: !process.env.CI,
	},
});
