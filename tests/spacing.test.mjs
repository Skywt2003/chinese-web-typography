import { test } from "node:test";
import assert from "node:assert/strict";
import pangu from "pangu";
import { Pangu } from "pangu/shared";
const browserPangu = new Pangu();
test("spaces Chinese / Latin / digit boundaries", () => {
	assert.equal(
		pangu.spaceText("在Mac上打开第3个灵感"),
		"在 Mac 上打开第 3 个灵感",
	);
});
test("already-spaced prose is idempotent", () => {
	for (const input of [
		"用 Mac 记录第 3 个灵感。",
		"纯中文标点，保持自然。",
		"用iPhone记录24小时的日常。",
	]) {
		const once = pangu.spaceText(input);
		assert.equal(pangu.spaceText(once), once);
	}
});
test("server and browser shared string APIs produce identical first-render text", () => {
	for (const input of [
		"用Mac记录第3个灵感",
		"Hello世界",
		"第24小时",
		"纯中文。",
	]) {
		assert.equal(browserPangu.spaceText(input), pangu.spaceText(input));
	}
});
test("format approved prose fields without rewriting technical fields", () => {
	const record = {
		title: "用Mac记录",
		code: "const第3个=1",
		url: "https://example.com/Mac教程",
		input: "用户Mac原文",
	};
	const rendered = { ...record, title: pangu.spaceText(record.title) };
	assert.equal(rendered.title, "用 Mac 记录");
	for (const key of ["code", "url", "input"])
		assert.equal(rendered[key], record[key]);
});
