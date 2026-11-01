# 文案维护

`site.json` 是网站文案的唯一源文件。模板保留版式与语义结构，不再承载整段文案。`copy` 保存身份、联系方式、页面元信息和结尾主文案；其他分组按实际页面/场景命名，`runtime` 保存交互反馈与演出状态。

- `shared`：三页共用的品牌与导航。全局章节为 01 本人、02 作品、03 学习方向、04 联系。
- `opening` / `profile` / `work_index`：开场、个人介绍、作品索引。
- `web_scene` / `python_scene`：项目演出的文案。项目 01 为 Python 文件整理助手，项目 02 为个人网站，区别于全局章节编号。
- `learning` / `ending` / `contact`：学习方向、收尾与联系。
- `web_detail` / `python_detail`：详情页正文、标题、运行命令。
- `runtime`：菜单动效开关、复制反馈、筛选反馈、场景状态。

同一项目在首页与详情中的共享演示使用同一个键。后缀 `_2`、`_3` 表示同一区域的后续句子或条目，不表示章节序号。每个键的最终文案与主要改写理由见 `docs/stage05/copy-inventory.md`。

值使用普通文字，少量 `<br>` 和 `<code>` 保留必要的换行、命令语义。开场标题的两个 span 与红色句号由模板组织；Python 核心标题的两行分别维护，以保留既有的动态元素身份。不要再把所有标题强制拆成两行。

文件名、去向、数量和执行状态以 `docs/stage02/fixture-evidence.json` 与工具代码为依据。修改演示数据时必须重新执行样例并核对，不能把文案编辑变成虚构的功能或结果。

修改后执行：

```sh
python3 scripts/render_site.py
python3 scripts/check_site.py
python3 scripts/render_site.py --check
```

`assets/js/copy.js`、根目录 HTML 与 `assets/previews/site-view.html` 均为生成文件，不直接编辑。字体新增字符时，按 `assets/fonts/README.md` 重建共享子集。全局字体角色定义在 `assets/css/type.css`；独立场景样式继续负责几何位置。

如果文字/字体改变了首页实际布局，先运行本地预览，再用 `node scripts/measure_web_layouts.cjs http://127.0.0.1:8000` 更新 Web 演示的实测端点与无脚本截图，并实际检查三个端点。不要只改演示中的假尺寸。
