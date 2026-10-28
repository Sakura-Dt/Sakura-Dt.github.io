# Sakura · 个人作品集

深圳大学计算机专业学生 Sakura 的第一个 Web 项目。使用原生 HTML、CSS 和 JavaScript 开发，记录项目实践和学习过程。

- 在线网站：[Sakura 的作品集](https://Sakura-Dt.github.io/)
- 源码仓库：[Sakura-Dt.github.io](https://github.com/Sakura-Dt/Sakura-Dt.github.io)
- 无框架、构建步骤、后端、数据库、外部字体或付费 API。
- 自动检查仅用于开发：Python 检查静态文件，Playwright 验证浏览器交互。访问网站无需安装这些工具。

## 项目状态

作品集第一版已于 2026-10-26 发布。文件整理助手已实现命令行初版，源码和说明位于 `tools/`；学生信息管理系统仍是尚未实现的练习计划，其卡片图片为概念示意。

项目详情：[作品集网站](./portfolio.html)、[文件整理助手](./organizer.html)。开发与测试记录不代表这些本地改动已经发布，线上版本以实际合并、推送结果为准。

本地修改只有经过提交、推送和 Pages 发布后才会出现在网站上。检查 Git 状态和发布结果，可以区分本地进度与线上版本。

## 本地运行

将仓库克隆到自己选择的目录，然后进入项目文件夹：

```bash
git clone https://github.com/Sakura-Dt/Sakura-Dt.github.io.git
cd Sakura-Dt.github.io
python3 -m http.server 8000 --bind 127.0.0.1
```

以上命令适用于 Linux、macOS 或 WSL2。已克隆仓库时，直接在自己的项目目录运行最后一条命令即可。

然后在浏览器打开 [本地预览](http://localhost:8000)。按 `Ctrl+C` 停止。端口被占用时可以改用 `8080`，并同步修改浏览器地址。开发服务器仅用于本地预览。

这个项目也能在 Windows 原生环境中运行：进入实际项目目录后，若已安装 Python，可用 `py -m http.server 8000 --bind 127.0.0.1` 启动。

## 文件用途

```text
index.html           页面内容、导航、项目卡片、学习时间线和联系信息
assets/css/style.css 配色、布局、响应式断点和动画
assets/js/main.js    手机导航、分类筛选、邮箱复制及滚动淡入
assets/favicon.svg   浏览器标签页图标
README.md            运行、维护和验证说明
scripts/check_site.py 静态资源、锚点和本机路径检查
tests/site.test.cjs   浏览器回归测试
package.json         开发测试命令和依赖版本
package-lock.json    锁定测试依赖，便于重复安装
.github/workflows/   GitHub Actions 自动检查配置
portfolio.html       作品集网站的项目详情
organizer.html       文件整理助手的项目详情
tools/               Python 工具源码与使用说明
docs/                开发流程与质量检查记录
```

## 功能与关键代码

- HTML 的 `header`、`nav`、`main`、`section` 和 `footer` 标明内容用途。导航的 `href="#projects"` 对应区域的 `id="projects"`。
- CSS 的 `:root` 集中定义配色和内容宽度。Grid 安排卡片；媒体查询在平板改成两列、手机改成一列。`clamp()` 控制标题字号。
- 手机菜单使用定位浮层，展开时不推挤正文；`aria-expanded` 同步菜单状态。Escape、点击菜单外部和焦点离开导航时都能关闭菜单。
- 分类按钮的 `data-filter` 对应卡片的 `data-category`。脚本用 `hidden` 隐藏不匹配的项目，用 `aria-pressed` 表达选中状态，并播报筛选数量。
- Clipboard API 复制邮箱，需要 localhost 或 HTTPS 等浏览器允许的环境。复制失败时提供手动复制提示。
- `IntersectionObserver` 在滚动时显示卡片。键盘焦点进入卡片时立即显示内容；开启“减少动态效果”时关闭动画。关闭 JavaScript 后，正文、导航和原生 `details` 仍能使用。

## 怎样维护内容

1. 个人介绍、学校和联系信息在 `index.html`。更换邮箱时同时修改显示文字、`mailto:` 地址和复制按钮的 `data-email`。
2. 每张项目卡片是一个 `article`。完成计划项目后，更新状态、功能说明和开发记录，再添加真实的源码与预览链接；不要仅改“已完成”标签。
3. 新项目的分类使用已有 `systems`、`python` 或 `web`。添加新分类时，按钮和卡片的值必须一致。`all` 表示全部。
4. 项目入口放在 `.project-links` 中，详细说明放在 `details` 中。外部新窗口链接使用 `target="_blank" rel="noopener noreferrer"`。
5. 学习时间线只填写真实发生的事项。日期用 `<time datetime="2026-10-27">2026.10.27</time>` 表达；当前节点中的 `.current-label` 会自动点亮对应圆点。
6. 保持本地资源的 `./assets/...` 相对路径；根目录 `index.html` 是 GitHub Pages 入口。首屏的 Python 代码是装饰插图，不会执行。

## 开发记录

- **2026-10-26**：完成第一版、深色响应式布局、手机导航、项目筛选和邮箱复制；创建 Git 提交并首次发布。
- **2026-10-27**：将作品集转为正式项目，添加源码和预览入口、功能与问题解决记录；把其他两个项目明确标为计划中，补充真实学习时间线及维护文档。
- **排版经验**：手机菜单曾推挤正文，改用浮层解决；按钮触控高度提升到至少 44px，小屏正文调整为 14px。
- **交互经验**：淡入动画不能遮住键盘焦点。聚焦时立即显示卡片，同时遵循系统减少动画偏好。

## 修改后的检查顺序

1. 启动本地服务，检查首页、CSS、JavaScript 和图标加载。
2. 检查 320、375/390、768 和 1440px 宽度：无横向溢出，标题、按钮和项目详情没有重叠。
3. 打开手机菜单，点击项目锚点；检查菜单关闭后目标标题没有被顶部导航遮挡。
4. 依次筛选 Web、C / C++、Python 和全部；检查项目数量、详情展开、源码和预览链接。
5. 检查复制邮箱的成功和失败提示，使用 Tab、Enter 和 Escape 检查键盘操作。
6. 禁用 JavaScript、开启减少动态效果，再检查内容是否可读。
7. 用自己的真实手机补充检查字体、触控、横竖屏和邮件应用唤起。浏览器模拟验证不能代替真实设备验证。
8. 运行 `git diff --check` 并阅读 `git diff`，确认只有本次计划的改动。

## 保存版本与发布

### 先运行自动检查

只检查文件和路径时，在仓库根目录执行（需要 Python 3.12）：

```bash
python3 scripts/check_site.py
```

它会检查 HTML 的本地资源、页内和跨页锚点、重复 ID、文件名大小写、CSS 的 `url()` 引用，以及公开内容中是否误写了本机用户目录。不联网检测外部网站可用性，也不等同于完整的隐私或安全审计。

运行完整浏览器检查需要 Node.js 22 和 npm。首次安装：

```bash
npm ci
npx playwright install chromium
```

Linux 若提示缺少系统依赖，按 Playwright 提示安装，或使用 `npx playwright install --with-deps chromium`（可能需要管理员权限）。以后检查时运行：

```bash
python3 scripts/check_site.py
npm test
python3 -m unittest discover -s tests -p 'test_*.py' -v
```

测试会自行启动本地临时服务器、选择空闲端口，并在结束后关闭。它检查手机与电脑布局、触控菜单、锚点遮挡、项目筛选、详情展开、邮箱复制成功和失败反馈，以及无 JavaScript 和减少动画的表现。复制测试使用模拟接口，不读写真实剪贴板。

Windows 的 Python 命令通常可换成 `py`。如希望复用已安装的 Edge，可先在 PowerShell 设置 `$env:TEST_BROWSER_CHANNEL="msedge"`，再执行 `npm test`；未设置时使用 Playwright Chromium。

### GitHub 上如何运行

`.github/workflows/check-site.yml` 会在推送到 `main` 或 `codex/` 开发分支、提交针对 `main` 的拉取请求时执行，也可在 Actions 的 **Check site → Run workflow** 中手动触发。流程依次运行静态检查、Python 工具测试、安装锁定依赖和浏览器、执行交互及无障碍测试；失败时查看红色步骤的日志。

此流程只有仓库读取权限，不使用密钥、不推送代码、不修改 Pages 设置。**它目前不会阻止现有 Pages 自动发布**：检查和 Pages 构建相互独立。发布后应同时确认两项都成功；以后若需要检查通过后才发布，再将检查和部署接成顺序流程。

### 再保存并推送

先查看改动，再暂存本次确实修改的文件：

```bash
git status
git diff
git add index.html assets/css/style.css README.md
git diff --cached
git commit -m "docs: clarify project status and learning milestones"
```

上面的文件列表只是本轮示例；以后按实际改动选择，修改脚本时也要暂存对应文件。

决定发布后执行：

```bash
git push origin main
```

仓库已经配置 GitHub Pages。推送后在 [Actions](https://github.com/Sakura-Dt/Sakura-Dt.github.io/actions) 检查对应提交的 Pages 构建是否成功，再检查线上内容。若推送提示登录问题，先完成 GitHub 身份验证，不要修改远程地址或强制推送。

## 下一步

- 用真实手机完成一次体验检查，并记录设备和发现的问题。
- 使用测试文件体验[文件整理助手](./tools/README.md)，再根据实际需求完善。
- 每完成一个独立改动，先验证，再保存 Git 版本。

后续开发按[分支开发与发布流程](./docs/development.md)操作；本轮质量检查的范围和结果见[质量记录](./docs/quality.md)。
