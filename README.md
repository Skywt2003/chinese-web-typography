# Chinese Web Typography

用于优化中文网页排版的 agent skill：混排空距、段尾孤字、词语与产品名的换行保护、响应式标题和标点视觉居中。

[查看 Before / After 演示](https://skywt2003.github.io/chinese-web-typography/) · 来源：[Apple 官网排版细节鉴赏 ↗](https://skywt.cn/blog/apple-typography-details)

## 安装与使用

在项目目录运行，按提示选择使用的 AI 编程工具：

```sh
npx skills add Skywt2003/chinese-web-typography --skill chinese-web-typography
```

安装后，对 agent 说：

> 使用 chinese-web-typography 优化这个页面的中文排版，保留原文，并验证手机和桌面效果。

无需安装本仓库的开发依赖。Agent 会根据页面情况应用规则，需要处理混排空距时再接入 pangu.js。

[查看完整规则](skills/chinese-web-typography/SKILL.md) · [MIT 许可](LICENSE)

By [SkyWT](https://skywt.net)
