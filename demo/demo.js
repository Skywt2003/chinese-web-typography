/* Static editorial fixtures. pangu transforms only the approved prose in case 01. */
const fixtures = [
	{
		id: "spacing",
		title: "中文与西文、数字之间的空距",
		description: "中文 × Latin × 数字",
		before: '<p id="spacing-before"></p>',
		after: '<p id="spacing-after"></p>',
		beforeNote: "中文、英文与数字直接相接。",
		afterNote: "pangu.js 为展示文案补足空格；不叠加 CSS 自动空距。",
	},
	{
		id: "orphan",
		title: "避免段尾孤字",
		description: "段尾语义保护",
		before:
			'<p class="orphan">用心打磨每一处细节，让每一次日常阅读都成为一种享受。</p>',
		after:
			'<p class="orphan">用心打磨每一处细节，让每一次日常阅读都成为一种<span class="nowrap" data-protected>享受。</span></p>',
		beforeNote: "某些宽度下，段尾只留下一个字和句号。",
		afterNote: "保护完整的末尾词语「享受。」，不机械绑定最后几个字。",
	},
	{
		id: "semantic",
		title: "避免词语被换行拆分",
		description: "最小范围 nowrap",
		before:
			'<p class="semantic">让每一次表达都更清晰，让每一个创意都被看见。</p>',
		after:
			'<p class="semantic">让每一次表达都更<span class="nowrap" data-protected>清晰，</span>让每一个<span class="nowrap" data-protected>创意</span>都被看见。</p>',
		beforeNote: "自动换行不总能照顾词语的语义边界。",
		afterNote: "只保护易被拆开的「清晰」「创意」，保留其余换行机会。",
	},
	{
		id: "responsive",
		title: "标题的响应式换行",
		description: "按容器宽度切换",
		before: '<p class="headline">给灵感留白，让创作发生。</p>',
		after:
			'<p class="headline"><span class="headline-line">给灵感留白，</span><br class="responsive-break"><span class="headline-line">让创作发生。</span></p>',
		beforeNote: "浏览器在行满时折行，可能打断一句话。",
		afterNote: "容器 ≤ 430 px 时，在逗号后换行。",
	},
	{
		id: "product",
		title: "英文产品名的不换行保护",
		description: "有选择的不换行空格",
		before:
			'<p class="product">现在，带上你的 Studio Note Pro，把灵感写成下一篇故事。</p>',
		after:
			'<p class="product">现在，带上你的 <span class="nowrap long-name" data-protected>Studio Note&nbsp;Pro</span>，把灵感写成下一篇故事。</p>',
		beforeNote: "带普通空格的产品名可能散落在两行。",
		afterNote: "保护短名称；极窄容器允许在 Studio 后换行，保留 Note Pro。",
	},
	{
		id: "optical",
		title: "带标点标题的视觉居中",
		description: "标点悬挂 · 辅助线对照",
		before: '<p class="optical">恰到好处。</p>',
		after:
			'<p class="optical"><span class="nowrap">恰到好处<span class="hang">。</span></span></p>',
		beforeNote: "按含句号的字符宽度居中；实心字形看起来略偏左。",
		afterNote: "让末尾句号悬挂，正文对准中轴；标点仍是真实可复制文本。",
	},
];
const gallery = document.querySelector("#gallery");
for (const [index, item] of fixtures.entries()) {
	const section = document.createElement("section");
	section.className = "case";
	section.id = item.id;
	// All markup here is authored locally; no user or remote HTML is interpolated.
	section.innerHTML = `<div class="case-header"><span class="case-number">0${index + 1}</span><h2>${item.title}</h2><span class="case-description">${item.description}</span></div><div class="pair">${["before", "after"].map((mode) => `<div class="panel ${mode}" aria-label="${item.title} ${mode}"><h3 class="card-heading">${mode === "before" ? "Before" : "After"}</h3><div class="stage"><div class="sample">${item[mode]}</div></div><div class="caption">${item[`${mode}Note`]}</div></div>`).join("")}</div>`;
	gallery.append(section);
}
const source = "在Mac上打开第3个灵感，用iPhone记录24小时的日常。";
document.querySelector("#spacing-before").textContent = source;
document.querySelector("#spacing-after").textContent = pangu.spaceText(source);
document.documentElement.dataset.ready = "true";
