# Chinese Web Typography

让中文网页的空距、换行与视觉重心更自然。一个可复用的 agent skill，附带可离线打开的 before / after 排版示例。

灵感来自 SkyWT 的文章 [《Apple 官网排版细节鉴赏》](https://skywt.cn/blog/apple-typography-details)。本仓库提炼排版判断方法，不使用 Apple 的私有字体。示例文案为本仓库编写。

## 安装 skill

在要使用 skill 的项目目录运行：

```sh
npx skills add Skywt2003/chinese-web-typography --skill chinese-web-typography
```

或安装到全局，供 Codex 使用：

```sh
npx skills add Skywt2003/chinese-web-typography --skill chinese-web-typography -g -a codex
```

安装后，对 agent 说：

```text
使用 $chinese-web-typography 检查这个中文页面的排版。
重点处理混排空距、标题断行和段尾孤字，保留原文，并在手机和桌面宽度下验证。
```

核心规则在 [SKILL.md](skills/chinese-web-typography/SKILL.md)，pangu.js 的精确 API 与 SSR 接入在 [references/pangu.md](skills/chinese-web-typography/references/pangu.md)。加载 skill 不需要先安装 Node 依赖；依赖仅用于开发 demo、跑测试，以及目标项目选择接入 pangu 时。

## 仓库结构

```text
skills/chinese-web-typography/   可独立安装的 skill
  SKILL.md                      触发条件和排版规则
  references/                   pangu 接入及进阶参考
  agents/openai.yaml            Codex 展示信息
  LICENSE                       skill 许可
demo/                          HTML 对照示例及第三方资源
tests/                         字符串与浏览器测试
screenshots/                   效果截图
```

安装内容只有 skill 目录，不包含 demo、字体、截图或测试依赖。安装不会自动修改网站；agent 按规则检查并修改目标项目，在需要时才接入 pangu.js。

## 打开 demo

直接打开 **[demo/index.html](demo/index.html)**，无需构建、安装依赖或联网。GitHub 文件页展示的是源码；下载仓库后在浏览器打开 HTML。

- 每张卡片顶部标注 Before / After；桌面左右对照，窄屏按 Before、After 顺序一行一张卡片。
- 示例容器默认 360 px，窄屏自动适应卡片宽度，不提供宽度调节。段落按案例设置更窄的行宽，以展示排版差异。
- 六个独立案例：混排空距、段尾孤字、语义断词、响应式标题、产品名保护、标点视觉居中。
- Before 和 After 使用同一字体、字号及原文；第一项由真实 pangu.js 处理，其余是可读的 HTML/CSS 编辑实例。

![Desktop comparison](screenshots/comparison.png)

[Mobile comparison](screenshots/mobile-comparison.png)

## 本地开发与验证

需要 Node.js 22+、pnpm，以及 Playwright 的 Chromium：

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install --no-shell chromium
pnpm demo                 # http://127.0.0.1:4173
pnpm test                 # Node 字符串测试 + Playwright 实际布局测试
pnpm screenshots          # 更新 screenshots/ 下的两张截图
```

Linux CI 若缺少浏览器系统库，使用 `pnpm exec playwright install --with-deps --no-shell chromium`。

测试覆盖真实字符串转换、幂等性、服务端/浏览器字符串结果一致、技术字段保留、卡片标签及响应式布局、响应式规则、受保护词语的行框、标点居中以及多个视口宽度下的文本溢出。测试结果不代表已验证所有操作系统和浏览器；字体视觉判断仍需人工查看。

Demo 不是全站自动改写器。pangu.js 只接管第一组明确指定的展示文案，其他规则由 agent 根据实际内容和渲染决定是否应用。

## 验证本地安装

在一个临时空目录运行，避免修改现有项目或全局 skill：

```sh
# 将绝对路径替换为你的本地 clone 路径。
npx skills add /absolute/path/to/chinese-web-typography --list
npx skills add /absolute/path/to/chinese-web-typography --skill chinese-web-typography -a codex --copy -y
```

检查生成的 `.agents/skills/chinese-web-typography/`，应包含入口、两个 references、agent 元数据及 LICENSE。确认引用文件可读取，且没有 demo、字体、截图或 node_modules。远程安装命令获取 GitHub 上已推送的版本，本地安装可验证尚未提交的改动。

## 依赖与许可

- 仓库原创代码和 skill：MIT，见 [LICENSE](LICENSE)。
- pangu.js **10.4.1**：MIT，精确锁定；使用 `spaceText`，不沿用旧版的 `spacing` API。
- Noto Sans SC / Fontsource **5.3.1**：SIL OFL 1.1。Demo 附带简体中文的 400、600 字重。
- 上游分发文件及许可位于 [demo/vendor](demo/vendor/)。运行 `pnpm vendor` 可从锁定的依赖重新生成。

原文链接用于注明灵感来源；本仓库 MIT 许可不改变原文章的许可。
