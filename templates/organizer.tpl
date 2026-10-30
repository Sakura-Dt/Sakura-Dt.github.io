<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f1eee6"><meta name="description" content="默认只预览的本地命令行工具。确认之后，执行之前，边界要说清。"><title>文件整理助手 · 实现与边界 · Sakura</title><link rel="icon" href="./assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="./assets/fonts/Archivo-subset.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="./assets/fonts/NotoSansSC-subset.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="./assets/css/style.css"><script src="./assets/js/main.js" defer></script>
</head>
<body class="case-page case-organizer"><a class="skip-link" href="#main">跳到主要内容</a>
<header class="header"><a class="brand" href="./index.html"><svg viewBox="0 0 44 44" aria-hidden="true"><path d="M3 10 22 3 41 10 22 41Z" fill="currentColor"/><path d="m3 10 19 9 19-9M22 19v22" fill="none" stroke="var(--paper)" stroke-width="1.7"/></svg><span>SAKURA<span class="brand-sub">折向 / PERSONAL PRACTICE</span></span></a><button class="menu-toggle" aria-expanded="false" aria-controls="navigation">目录 <span aria-hidden="true">＋</span></button>
<nav id="navigation" aria-label="主导航"><a href="./index.html#about">01 / 本人</a><a href="./index.html#projects">02 / 作品</a><a href="./index.html#contact">03 / 联系 <span aria-hidden="true">↗</span></a>
</nav><span class="header-note">FORM IN THE MAKING</span>
</header>
<main id="main">
<div class="case-wrap"><a class="case-back text-link" href="./index.html#projects">← 返回作品索引</a>
<section class="case-hero"><span class="eyebrow">PYTHON / CASE 02 / FORM IN THE MAKING</span><h1>先列去向。<br>再让文件动身。</h1><p>默认只预览的本地命令行工具。确认之后，执行之前，边界要说清。</p><span class="case-hero-number" aria-hidden="true">02</span>
</section>
<section class="organizer-principle"><span>PREVIEW</span><b>→</b><span>CONFIRM</span><b>→</b><span>MOVE</span>
</section>
<section class="case-grid"><span class="eyebrow">BEHAVIOR / 行为</span>
<div><h2>一份计划，两个阶段。</h2><p>使用 Python 标准库 pathlib 扫描目录第一层的普通文件，按扩展名安排到 images、documents、archives、media 或 others。生成计划与执行计划使用不同函数。</p><ul>
<li>默认只显示去向，不创建目录、不移动文件。</li>
<li>指定 <code>--apply</code> 后，仍需输入大写 <code>MOVE</code> 确认。</li>
<li>已有目标不覆盖；隐藏文件、子目录和符号链接跳过。</li>
<li>已完成的移动逐项记录到目标目录的 <code>.organizer-log.jsonl</code>。</li></ul>
</div>
</section>
<section class="case-grid"><span class="eyebrow">TRY IT / 本地运行</span>
<div><h2>从测试文件开始。</h2><p>需要 Python 3.12，无第三方依赖。下载脚本后，创建 sample-files 测试目录，放入几份无关紧要的文件。Windows 可将 python3 换成 py。</p>
<div class="code-example"><span>01 / 预览，不移动</span><pre><code>python3 file_organizer.py ./sample-files</code></pre><span>02 / 核对预览后执行</span><pre><code>python3 file_organizer.py ./sample-files --apply</code></pre><small>提示时输入 MOVE，其他输入会取消。</small>
</div><a class="solid-link" href="./tools/file_organizer.py" download>下载 Python 源文件 ↓</a><p class="fine-print">工具在你的电脑运行。此网页不读取、不上传任何本地文件。</p>
</div>
</section>
<section class="case-grid"><span class="eyebrow">BOUNDARIES / 限制</span>
<div><h2>不会做的，同样清楚。</h2><p>目前不递归、不自动撤销。通过同文件系统硬链接建立目标，再删除原路径，以避免覆盖已有目标；文件系统需要支持硬链接，没有跨文件系统复制模式。</p><p>执行前会重新核对源文件。执行期间不要同时修改目录。它不是事务：中途失败时，部分移动可能已经完成。请核对目录和日志；日志写入失败时最后记录可能不完整。</p><p>恢复流程与自定义分类仍是后续方向，尚未实现。</p>
</div>
</section>
<section class="case-grid"><span class="eyebrow">VERIFICATION / 验证</span>
<div><h2>在临时目录里，验证边界。</h2><p>测试覆盖预览无副作用、取消确认、重名目标、源文件变化、目录与符号链接等情况。测试仅操作临时目录，不整理开发电脑的真实文件。</p><a class="text-link" href="https://github.com/Sakura-Dt/Sakura-Dt.github.io/blob/main/tools/file_organizer.py" target="_blank" rel="noopener noreferrer">GitHub 源码 ↗</a>
</div>
</section>
<div class="case-end"><a class="text-link" href="./index.html#projects">← 返回作品索引</a><a class="text-link" href="./portfolio.html">下一件作品 ↗</a>
</div>
</div>
</main>
<footer class="case-footer"><a href="./index.html">SAKURA / 折向</a><a href="mailto:{{email}}">{{email}} ↗</a>
</footer>
</body>
</html>
