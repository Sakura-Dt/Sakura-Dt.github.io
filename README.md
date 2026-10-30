# Sakura · 折向 / FORM IN THE MAKING

以「平面经过组织，成为可用结构」为主题的个人网站。纸白、朱红、群青和淡黄组成六场视觉叙事；四段滚动时间轴展示折面、基础结构、响应式视窗与文件整理流程。图形为原创 SVG / CSS；Archivo 与 Noto Sans SC 字体经过子集压缩后保存在本地，不请求外部字体服务，也没有外部图片、动画库或付费服务。

## 本地预览

需要 Python 3.12。在项目根目录运行：

```bash
python3 scripts/render_site.py
python3 -m http.server 8000 --bind 127.0.0.1
```

打开 [本地网站](http://localhost:8000)。Windows 可将 `python3` 换成 `py`。按 Ctrl+C 停止服务。根目录 HTML 已生成，直接预览不需要安装 Node.js 依赖。

## 页面与真实内容

- `index.html`：六场完整体验，包含身份、技术状态、两件作品、计划与实践记录、联系方式。
- `portfolio.html`：网站的需求、内容架构、动效、工程取舍与验证。
- `organizer.html`：Python 工具的行为、运行方法、实现与限制。
- `tools/`：保留原文件整理工具和使用说明，不被视觉重构修改。

个人网站与 Python 文件整理助手是已实现作品。C++ 学生信息管理仍是计划。后端与 AI Agent 应用是学习方向，未写成已掌握技能或完成作品。网站通过 GitHub Pages 发布，版本历史保存在 GitHub。

## 维护方式

`content/site.json` 存放身份、联系方式及六场主文案；`templates/*.tpl` 存放各页语义结构与详细项目说明。修改后运行生成器，将模板、内容和生成的根目录 HTML 一起提交。

```bash
python3 scripts/render_site.py
python3 scripts/render_site.py --check
python3 scripts/check_site.py
```

共享排版与详情页：`assets/css/style.css`。六场构图与响应式：`assets/css/home.css`。时间轴、导航、筛选、步骤按钮和复制：`assets/js/main.js`。

滚动动画不接管滚轮。图形以约75ms的短跟随吸收滚轮跳动，各元素使用错开的局部阶段，停止后精确落定且不再持续排帧。桌面有限 sticky 区间，手机取消整场固定并采用独立图形布局。系统减少动态效果或站内开关提供静态阅读。无 JavaScript 时全部真实内容、链接、导航和原生详情仍可用。每次修改场景高度或布局后，重新验证实际固定位置与正反向状态。

## 自动检查

首次安装浏览器测试依赖：

```bash
npm ci
npx playwright install chromium
```

执行：

```bash
python3 scripts/render_site.py --check
python3 scripts/check_site.py
python3 -m unittest discover -s tests -p 'test_*.py' -v
npm test
```

浏览器测试自行启动和关闭临时静态服务。覆盖三页在 320 / 390 / 768 / 1440 宽度的溢出、导航与筛选、详情、复制成功与失败、四场五阶段正反向实际变换、无脚本/减少动态效果、WCAG 自动扫描与256 KiB完整加载预算（含字体）。

测试可复用已安装的 Edge。Linux/macOS 运行 `TEST_BROWSER_CHANNEL=msedge npm test`；Windows PowerShell 先设置 `$env:TEST_BROWSER_CHANNEL="msedge"` 再运行 `npm test`。这是浏览器配置，不是网站运行要求。

CI 保留 `.github/workflows/check-site.yml`：生成检查、静态检查、工具测试、浏览器检查。没有加入新部署流程。

## 设计与交付文档

- [本轮审计、三方向与最终艺术指导](./docs/rebuild/art-direction.md)
- [亲见参考画面与证据边界](./docs/rebuild/reference-evidence.md)
- [六场五阶段分镜与全新文案](./docs/rebuild/storyboard-copy.md)
- [实际浏览器检查、改进与已知限制](./docs/rebuild/qa.md)

旧 `docs/` 研究与交付记录仍保留，作为历史资料；本轮规范以 `docs/rebuild/` 为准。

## 恢复与发布

本轮开始前的全部未提交工作已保存为提交 **7ed2fde**，恢复分支 **codex/recovery-before-new-identity**。新实现位于 **codex/fieldwork-rebuild**；后续字体与动效修正位于 **codex/type-motion-refinement**。切换恢复分支前，先保存新分支的工作，避免丢失后续改动。

网站继续兼容 GitHub Pages：根目录 index.html、两个详情页及相对资源路径，无服务器路由和运行构建依赖。发布前运行检查并审阅分支，远程检查通过后再合入 main。发布完成后核实 Pages 状态与线上实际内容。

字体来源、许可与增加中文内容后的子集更新方法见 [本地字体说明](./assets/fonts/README.md)。字体与动效本轮修正记录见 [修正说明](./docs/rebuild/type-motion-refinement.md)。
