# 个人作品集 · Portfolio

原生 HTML、CSS、JavaScript 实现的静态个人作品集。无需 npm 依赖，无后端、数据库或付费 API，可部署到 GitHub Pages。

## 在 WSL2 中运行

在终端执行：

```bash
cd /home/aya/projects/Sakura-Dt.github.io
python3 -m http.server 8000 --bind 0.0.0.0
```

然后在 Windows 浏览器打开 http://localhost:8000 。按 `Ctrl+C` 停止服务。如果端口被占用，可将 `8000` 改为 `8080`。这个服务器仅用于本地开发。

## 文件结构

```text
index.html           页面内容、语义结构和项目卡片
assets/css/style.css 配色、布局、响应式断点和动画
assets/js/main.js    手机导航、项目筛选、复制邮箱和滚动效果
assets/favicon.svg   浏览器标签页的小图标
README.md            运行和修改说明
```

## 从哪里开始修改

1. 在 `index.html` 中搜索 `TODO`，替换姓名、介绍、学校、邮箱及 GitHub 链接。示例项目和学习阶段均明确标记为占位内容，不代表已完成。
2. 项目卡片的 `data-category` 对应筛选按钮的 `data-filter`：`systems`、`python`、`web`。`all` 显示全部项目。
3. 项目地址尚未填写时，卡片使用 `details` 展开说明。准备好真实仓库后，可将整个 `details` 元素换成 `<a href="真实项目地址">查看源码 ↗</a>`。
4. 替换邮箱时，同时修改页面显示的邮箱、邮件链接的 `href="mailto:..."` 和复制按钮的 `data-email`。
5. 在 `style.css` 的 `:root` 中统一修改配色和内容宽度。首屏代码只是装饰插图，不会执行 Python。

## 最重要的代码

- HTML 的 `header`、`nav`、`main`、`section`、`footer` 说明内容用途；导航的 `href="#projects"` 对应区域的 `id="projects"`。
- CSS Grid 负责卡片布局；媒体查询在窄屏幕切换成单列。`clamp()` 让标题字号在手机和电脑之间平滑变化。
- JavaScript 用 `addEventListener` 处理事件，用 `hidden` 控制筛选结果；筛选只改变显示，不删除内容。`aria-pressed` 同步告诉辅助技术哪个选项已选中。
- `IntersectionObserver` 观察进入视口的内容，触发轻微淡入。无 JavaScript 时内容仍可阅读；系统开启“减少动态效果”时关闭动画。
- Clipboard API 用于复制邮箱（通常需要 localhost 或 HTTPS）。不支持或失败时显示手动复制提示。

## 自查清单

- 手机约 375px 和电脑约 1440px：无横向溢出，导航可用。
- 项目筛选四个选项、项目说明展开、复制邮箱、返回顶部正常。
- 用 Tab 键访问导航与按钮，焦点可见；用 Escape 关闭手机菜单。
- 关闭 JavaScript 后仍能阅读全部内容并使用导航。
- 本地 CSS、JS 使用 `./assets/...` 相对路径；没有构建步骤、外部字体或 CDN 依赖。

## 发布准备

本次开发不自动提交或推送。发布前请先替换占位内容、在浏览器中检查，并用 `git diff` 查看改动。入口必须保留为根目录的 `index.html`，便于 GitHub Pages 从仓库根目录提供页面。

`#section` 是页内锚点，`mailto:` 与 `https:` 是对外联系链接；本地资源均为相对路径。

## 第一版验证记录

已使用本机 Edge 和 Playwright 检查：

- 320、375、768、1440px 视口均无横向溢出。
- 三个分类各显示一个项目，“全部”恢复三个项目。
- 项目说明展开、邮箱复制、手机菜单打开和 Escape 关闭均正常。
- 禁用 JavaScript 时导航和所有项目仍可见。
- 开启减少动态效果后，无等待淡入的隐藏内容；页面未产生 JavaScript 运行错误。
- 首页、CSS、JavaScript 的 HTTP 请求均返回 200；页内锚点与本地资源路径检查通过。

这些是当前版本的验证结果，修改后仍应按上面的自查清单重新检查。
