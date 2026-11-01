# Stage 05 — 文案清单与改写理由

以下清单对应实际生成页面。个人身份、联系方式、技术基础、学习状态、项目能力与样例数据均沿用原有资料，没有添加经历、成绩、用户数或性能数字。

## 主要调整

| 位置 | 原表达 | 最终表达 | 原因 |
| --- | --- | --- | --- |
| 首页 | 把问题，折成形。 | 把问题，折成形。 | 保留指定的核心表达；中文继续承担主视觉。 |
| 首页辅助语 | 一张折面，多种可能。 | Sakura 的开发实践 | 用具体身份与内容替换泛化主题句。 |
| 中文介绍 | 从一段程序，到一个可以使用的作品。 | 这里记录我的开发实践与学习方向。 | 直接解释本站内容，减少全站重复。 |
| 首页转场 | 每一折，都有去向。 | 从一个想法，到具体实践。 | 保留转场的两行视觉身份，停止重复「折」。 |
| 技术基础 | 从语言开始。 | 编程与软件工程 | 标明实际内容，不再用隐喻代替身份信息。 |
| 关注方向 | 走向后端，探索智能体。 | 后端与 AI Agent | 直接使用技术名称，正文说明学习边界。 |
| 个人问题 | 怎样把需求，做成可用的作品？ | 怎样完成一个小项目？ | 缩短句子、避免又一个强制两行标题。 |
| 作品索引 | WORK, WITH EVIDENCE / 从形状，读到做法。 | 作品 / 项目演示、源码与实现说明 | 中文索引说明可获得的信息。 |
| Web 演出 | ONE SYSTEM, MULTIPLE DIMENSIONS. | 响应式设计 / 真实页面演示 | 用有信息价值的中文替代重复英文口号。 |
| Web 三态标题 | 同一内容，多种构图。等 | 同一内容，适应不同屏幕。／宽度改变，布局重排。／手机上的阅读顺序 | 每个状态直接对应可观察的响应式变化。 |
| Python 开场 | 文件散落，问题堆叠。 | 文件动身前，去向先落定。 | 保留指定核心句，并实际用于项目开场。 |
| Python 后续状态 | 先识别，再归类。／各归其位，过程留痕。 | 按扩展名分类／移动前查看计划／输入 MOVE 确认／分类完成，保留记录 | 以真实操作替代连续的双句修辞。 |
| Python 辅助语 | FROM CHAOS TO ORDER. | 分类预览 → 确认 → 移动 | 中文明确流程；MOVE 与目录名作为必要术语保留。 |
| 学习方向 | 做过的，成为起点。 | 接下来学什么 | 单行问题式标题，区别于首页与项目的文字构图。 |
| 方向条目 | 把实现，放进方法里。／先理解流动，再尝试连接。 | 软件工程方法／后端开发与 AI Agent | 标明学习对象，正文再说明计划与当前状态。 |
| 联系 | 从一个具体的问题聊起。 | 聊聊代码，或一个新想法。 | 更自然的邀请，并保留代码实践的个人语境。 |
| Web 详情 | 一个系统。多种尺度。 | 个人网站的设计与实现 | 名词式标题交代页面用途，改为连续阅读。 |
| Python 详情 | 先列去向。再让文件动身。 | 文件整理助手 | 核心句留给首页演出，详情直接说项目名称。 |
| Python 详情流程 | PREVIEW → CONFIRM → MOVE | 预览 → 确认 → 移动 | 中文承担阅读职责；输入命令依然是 MOVE。 |
| 导航 | 03 / 联系，正文04 | 01 本人／02 作品／03 学习方向／04 联系 | 三页一致，项目与详情内部序号分别命名。 |
| 详情装饰 | 巨大的半透明02 | 移除 | 项目编号已经出现，重复数字无有效信息且降低阅读对比。 |

## 最终逐项清单

键名可直接在 `content/site.json` 查找。技术样例、文件名、分类去向与日志名称保持真实示例含义；不把这些条目当作自由创作文案。


### copy

| 内容键 | 最终文案 |
| --- | --- |
| `copy.name` | Sakura |
| `copy.school` | 深圳大学 · 计算机专业 · 大二 |
| `copy.email` | 2538423610@qq.com |
| `copy.github` | https://github.com/Sakura-Dt |
| `copy.meta_title` | Sakura · 折向 / FORM IN THE MAKING |
| `copy.meta_description` | Sakura，深圳大学计算机专业大二学生。个人网站与 Python 文件整理助手，以及软件工程、后端和 AI Agent 的学习方向。 |
| `copy.next_title` | 接下来学什么 |
| `copy.next_body` | 继续学习软件工程，并用具体练习理解需求、数据与错误处理。 |
| `copy.contact_title` | 聊聊代码， / 或一个新想法。 |
| `copy.contact_body` | 关于现有作品或正在尝试的问题，欢迎来信。 / 我是 Sakura。 |

### home

| 内容键 | 最终文案 |
| --- | --- |
| `home.skip_link_a` | 跳到主要内容 |
| `home.top_section_aria_label` | 从想法到结构 |

### shared

| 内容键 | 最终文案 |
| --- | --- |
| `shared.brand_span` | SAKURA |
| `shared.brand_sub_span` | 折向 / 个人实践 |
| `shared.menu_toggle_button` | 目录 |
| `shared.navigation_nav_aria_label` | 主导航 |
| `shared.navigation_a` | 01 / 本人 |
| `shared.navigation_a_2` | 02 / 作品 |
| `shared.navigation_a_3` | 03 / 学习方向 |
| `shared.navigation_a_4` | 04 / 联系 |
| `shared.header_note_span` | FORM IN THE MAKING |
| `shared.case_footer_a` | SAKURA / 折向 |

### opening

| 内容键 | 最终文案 |
| --- | --- |
| `opening.intro_meta_span` | 折向 / 个人实践 |
| `opening.intro_meta_right_span` | Sakura 的开发实践 |
| `opening.hero_greeting_p` | 你好，我是 Sakura。 |
| `opening.opening_title_span` | 把问题， |
| `opening.opening_title_span_2` | 折成形 |
| `opening.hero_info_p` | 这里记录我的开发实践与学习方向。 |
| `opening.intro_work_link_a` | 查看两件作品 |
| `opening.intro_wordmark_b` | FORM |
| `opening.intro_wordmark_b_2` | IN THE |
| `opening.intro_wordmark_b_3` | MAKING. |
| `opening.fold_coordinate_span` | 从问题开始 |
| `opening.fold_coordinate_span_2` | 继续阅读 ↙ |
| `opening.unfold_heading_span` | 从一个想法， |
| `opening.unfold_heading_span_2` | 到具体实践。 |
| `opening.unfold_heading_small` | 认识我与正在学习的方向 |
| `opening.intro_foot_label_span` | SAKURA / FORM IN THE MAKING |
| `opening.intro_scroll_label_span` | 向下阅读 |
| `opening.motion_toggle_button` | 减少动效 |

### profile

| 内容键 | 最终文案 |
| --- | --- |
| `profile.profile_kicker_span` | 01 / 本人 |
| `profile.about_title_h2` | 我是 |
| `profile.about_title_span` | Sakura。 |
| `profile.profile_identity_span` | 正在学习，把一个需求做完整。 |
| `profile.profile_index_span` | 身份与学习方向 |
| `profile.profile_kicker_span_2` | 技术基础 |
| `profile.profile_material_h3` | 编程与软件工程 |
| `profile.profile_tech_p` | C / C++ / Python |
| `profile.profile_material_p` | 语言练习、数据组织与文件处理。 |
| `profile.profile_material_p_2` | 用软件工程连接需求、实现与验证。 |
| `profile.profile_kicker_span_3` | 目前关注 |
| `profile.profile_direction_h3` | 后端与 AI Agent |
| `profile.profile_direction_p` | 先理解请求、数据与错误处理。 |
| `profile.profile_footnote_p` | 学习与探索中，尚无已完成作品。 |
| `profile.profile_kicker_span_4` | 正在探索 |
| `profile.profile_question_h3` | 怎样完成一个小项目？ |
| `profile.profile_question_p` | 从需求、实现到验证，练习完整过程。 |
| `profile.intro_work_link_a` | 在 GitHub 看实践 |

### work_index

| 内容键 | 最终文案 |
| --- | --- |
| `work_index.eyebrow_span` | 02 / 作品 |
| `work_index.index_title_h2` | 两件作品。 |
| `work_index.index_title_span` | 项目演示、源码与实现说明 |
| `work_index.filters_div_aria_label` | 按技术筛选作品 |
| `work_index.filters_button` | 全部 / 02 |
| `work_index.filters_button_2` | Web / 01 |
| `work_index.filters_button_3` | Python / 01 |
| `work_index.filter_status_p` | 已显示 2 个项目 |
| `work_index.small_link_a` | 查看学习方向 ↗ |

### web_scene

| 内容键 | 最终文案 |
| --- | --- |
| `web_scene.web_title_h2` | 项目 01 / 个人网站 |
| `web_scene.dimension_meta_span` | 响应式设计 / 真实页面演示 |
| `web_scene.dimension_meta_span_2` | HTML · CSS · JAVASCRIPT |
| `web_scene.dimension_titles_div` | 同一内容，适应不同屏幕。 |
| `web_scene.dimension_titles_div_2` | 宽度改变，布局重排。 |
| `web_scene.dimension_titles_div_3` | 手机上的阅读顺序 |
| `web_scene.dimension_window_iframe_title` | 真实首页的响应式布局演示 |
| `web_scene.dimension_window_img_alt` | 当前首页1440×900实际浏览器截图 |
| `web_scene.dimension_measure_span` | × 900 / CSS PX |
| `web_scene.dimension_notes_span` | 布局 |
| `web_scene.dimension_notes_h3` | 从并列到纵向 |
| `web_scene.dimension_notes_p` | 标题、图形与身份信息， |
| `web_scene.dimension_notes_p_2` | 按屏幕宽度重新组织。 |
| `web_scene.dimension_notes_span_2` | 导航 |
| `web_scene.dimension_notes_h3_2` | 导航收进目录 |
| `web_scene.dimension_notes_p_3` | 760px 以内折叠导航， |
| `web_scene.dimension_notes_p_4` | 让内容获得更多空间。 |
| `web_scene.dimension_notes_span_3` | 视觉 |
| `web_scene.dimension_notes_h3_3` | 保持一致的视觉 |
| `web_scene.dimension_notes_p_5` | 改变尺寸与位置， |
| `web_scene.dimension_notes_p_6` | 保留色彩、文字和图形身份。 |
| `web_scene.dimension_caption_span` | 真实首页 / 当前本地版本 |
| `web_scene.dimension_caption_strong` | 桌面 · 并列布局 |
| `web_scene.dimension_footer_span` | 按宽度重新排版。 |
| `web_scene.dimension_footer_i` | 保留完整内容。 |
| `web_scene.dimension_footer_nav_aria_label` | 查看网站布局演出 |
| `web_scene.dimension_footer_button` | A |
| `web_scene.dimension_footer_span_2` | 桌面 |
| `web_scene.dimension_footer_button_2` | B |
| `web_scene.dimension_footer_span_3` | 重排 |
| `web_scene.dimension_footer_button_3` | C |
| `web_scene.dimension_footer_span_4` | 手机 |
| `web_scene.dimension_facts_b` | 个人网站 · HTML / CSS / JavaScript |
| `web_scene.dimension_facts_p` | 资料由 JSON 与模板生成静态页面，保留无脚本、减少动效和键盘操作的阅读方式。 |
| `web_scene.text_link_a` | 查看设计与实现 ↗ |
| `web_scene.small_link_a` | GitHub 源码 ↗ |
| `web_scene.text_link_a_2` | 读设计决策 ↓ |

### python_scene

| 内容键 | 最终文案 |
| --- | --- |
| `python_scene.python_title_h2` | 项目 02 / Python 文件整理助手 |
| `python_scene.order_meta_span` | 分类预览 → 确认 → 移动 |
| `python_scene.order_meta_span_2` | PYTHON · PATHLIB · CLI |
| `python_scene.order_headings_div` | 文件动身前， |
| `python_scene.order_headings_div_2` | 去向先落定。 |
| `python_scene.order_headings_div_3` | 按扩展名分类 |
| `python_scene.order_headings_div_4` | 移动前查看计划 |
| `python_scene.order_headings_div_5` | 输入 MOVE 确认 |
| `python_scene.order_headings_div_6` | 分类完成，保留记录 |
| `python_scene.order_opening_note_span` | 份示例文件 |
| `python_scene.order_opening_note_p` | 13 份文件混在同一目录， |
| `python_scene.order_opening_note_p_2` | 先预览，再移动。 |
| `python_scene.order_rule_note_b` | 识别依据 / 文件扩展名 |
| `python_scene.order_rule_note_p` | 不读取文件内容。 |
| `python_scene.order_rule_note_p_2` | 未知扩展名进入 others。 |
| `python_scene.order_rule_note_span` | 仅处理第一层普通文件 |
| `python_scene.order_plan_note_span` | 预览结果 / 尚未移动 |
| `python_scene.order_plan_note_small` | 待移动 |
| `python_scene.order_plan_note_small_2` | 跳过 |
| `python_scene.order_plan_note_p` | 同名目标不覆盖。核对以后，才执行。 |
| `python_scene.order_group_label_span` | 01 / 文档 |
| `python_scene.order_group_label_h3` | documents/ |
| `python_scene.order_rule_p` | .txt / .md / .pdf / .csv |
| `python_scene.order_group_count_span` | 04 项计划 |
| `python_scene.order_group_count_b` | 03 移动 + 01 原有 |
| `python_scene.order_group_label_span_2` | 02 / 图像 |
| `python_scene.order_group_label_h3_2` | images/ |
| `python_scene.order_rule_p_2` | .png / .JPG / .svg |
| `python_scene.order_group_count_span_2` | 03 项计划 |
| `python_scene.order_group_count_b_2` | 03 移动 |
| `python_scene.order_group_label_span_3` | 03 / 归档 |
| `python_scene.order_group_label_h3_3` | archives/ |
| `python_scene.order_rule_p_3` | .zip / .7z |
| `python_scene.order_group_count_span_3` | 02 项计划 |
| `python_scene.order_group_count_b_3` | 02 移动 |
| `python_scene.order_group_label_span_4` | 04 / 媒体 |
| `python_scene.order_group_label_h3_4` | media/ |
| `python_scene.order_rule_p_4` | .mp3 / .mp4 |
| `python_scene.order_group_label_span_5` | 05 / 其他 |
| `python_scene.order_group_label_h3_5` | others/ |
| `python_scene.order_rule_p_5` | 其余扩展名 |
| `python_scene.order_files_div_aria_label` | 示例文件与分类去向 |
| `python_scene.piece_art_span` | TXT |
| `python_scene.piece_info_strong` | notes.txt |
| `python_scene.piece_info_small` | 跳过 · 目标已存在 |
| `python_scene.piece_status_span` | 保留 |
| `python_scene.piece_art_span_2` | PDF |
| `python_scene.piece_info_strong_2` | brief.pdf |
| `python_scene.piece_info_small_2` | documents/brief.pdf |
| `python_scene.piece_art_span_3` | CSV |
| `python_scene.piece_info_strong_3` | table.csv |
| `python_scene.piece_info_small_3` | documents/table.csv |
| `python_scene.piece_art_span_4` | MD |
| `python_scene.piece_info_strong_4` | readme.md |
| `python_scene.piece_info_small_4` | documents/readme.md |
| `python_scene.piece_art_span_5` | PNG |
| `python_scene.piece_info_strong_5` | cover.png |
| `python_scene.piece_info_small_5` | images/cover.png |
| `python_scene.piece_art_span_6` | JPG |
| `python_scene.piece_info_strong_6` | photo.JPG |
| `python_scene.piece_info_small_6` | images/photo.JPG |
| `python_scene.piece_art_span_7` | SVG |
| `python_scene.piece_info_strong_7` | mark.svg |
| `python_scene.piece_info_small_7` | images/mark.svg |
| `python_scene.piece_art_span_8` | ZIP |
| `python_scene.piece_info_strong_8` | release.zip |
| `python_scene.piece_info_small_8` | archives/release.zip |
| `python_scene.piece_art_span_9` | 7Z |
| `python_scene.piece_info_strong_9` | backup.7z |
| `python_scene.piece_info_small_9` | archives/backup.7z |
| `python_scene.piece_art_span_10` | MP3 |
| `python_scene.piece_info_strong_10` | theme.mp3 |
| `python_scene.piece_info_small_10` | media/theme.mp3 |
| `python_scene.piece_art_span_11` | MP4 |
| `python_scene.piece_info_strong_11` | demo.mp4 |
| `python_scene.piece_info_small_11` | media/demo.mp4 |
| `python_scene.piece_art_span_12` | BIN |
| `python_scene.piece_info_strong_12` | data.bin |
| `python_scene.piece_info_small_12` | others/data.bin |
| `python_scene.piece_art_span_13` | PY |
| `python_scene.piece_info_strong_13` | script.py |
| `python_scene.piece_info_small_13` | others/script.py |
| `python_scene.order_preview_caption_div` | 默认只预览。 |
| `python_scene.order_preview_caption_span` | 文件还没有移动。 |
| `python_scene.order_confirmation_span` | 确认示意 / 工具中需输入大写 MOVE |
| `python_scene.order_confirmation_button_aria_label` | 演示确认 MOVE，查看整理结果 |
| `python_scene.order_confirmation_button` | MOVE |
| `python_scene.order_confirmation_small` | 确认后才执行 · 此网页不操作文件 |
| `python_scene.order_existing_small` | 原有目标 · 保持不变 |
| `python_scene.order_result_summary_small` | 已移动 |
| `python_scene.order_result_summary_span` | 01 跳过 / 05 类别 |
| `python_scene.order_root_caption_div` | 留在原处 / 同名目标不覆盖 |
| `python_scene.order_log_span` | 执行记录 / 12 条移动记录 |
| `python_scene.order_log_strong` | .organizer-log.jsonl |
| `python_scene.order_log_p` | cover.png → images/cover.png |
| `python_scene.order_log_p_2` | script.py → others/script.py |
| `python_scene.order_disclaimer_span` | 示例文件的真实执行结果 |
| `python_scene.order_controls_nav_aria_label` | 查看整理演出的五个场景 |
| `python_scene.order_controls_button` | A |
| `python_scene.order_controls_span` | 无序 |
| `python_scene.order_controls_button_2` | B |
| `python_scene.order_controls_span_2` | 识别 |
| `python_scene.order_controls_button_3` | C |
| `python_scene.order_controls_span_3` | 预览 |
| `python_scene.order_controls_button_4` | D |
| `python_scene.order_controls_span_4` | 确认 |
| `python_scene.order_controls_button_5` | E |
| `python_scene.order_controls_span_5` | 结果 |
| `python_scene.order_state_span` | A / 无序 |
| `python_scene.order_details_b` | 按扩展名整理，确认后执行。 |
| `python_scene.order_details_p` | 仅第一层普通文件；跳过隐藏文件、子目录与符号链接。不覆盖同名目标；不递归，无自动撤销。 |
| `python_scene.text_link_a` | 查看实现与边界 ↗ |
| `python_scene.small_link_a` | 下载 Python 源文件 ↓ |

### ending

| 内容键 | 最终文案 |
| --- | --- |
| `ending.finale_meta_span` | 03 / 学习方向 → 04 / 联系 |
| `ending.finale_meta_span_2` | 从现有实践继续学习 |
| `ending.finale_bridge_span` | 继续学习， |
| `ending.finale_bridge_span_2` | 也欢迎交流。 |
| `ending.finale_footer_span` | SAKURA |
| `ending.finale_footer_nav_aria_label` | 结尾章节 |
| `ending.finale_footer_a` | 学习方向 |
| `ending.finale_footer_a_3` | 联系 |
| `ending.finale_footer_a_4` | 回到开场 ↑ |

### learning

| 内容键 | 最终文案 |
| --- | --- |
| `learning.eyebrow_span` | 接下来的学习与实践 |
| `learning.direction_status_span` | 正在学习 / 软件工程 |
| `learning.direction_h3` | 软件工程方法 |
| `learning.direction_p` | 从需求、实现到验证，学习怎样组织一个完整的小项目。 |
| `learning.direction_status_span_2` | 准备实践 / C++ |
| `learning.direction_h3_2` | 学生信息管理练习 |
| `learning.direction_p_2` | 从添加、查询与文件保存开始，再处理重复学号和无效输入。计划中，尚无可运行版本。 |
| `learning.direction_status_span_3` | 探索方向 / 后端 · AI Agent |
| `learning.direction_h3_3` | 后端开发与 AI Agent |
| `learning.direction_p_3` | 理解请求、数据与错误的流动，再尝试边界清楚的应用。目前是学习方向。 |
| `learning.learning_record_summary` | 这些方向，目前走到哪里？ |
| `learning.learning_record_p` | 已完成的实践是上方的网站与 Python 工具。这里的 C++ 练习、后端与 AI Agent 方向，均未计入已完成项目。 |
| `learning.next_figure_label_span` | C++ / 后端 / AI Agent |

### contact

| 内容键 | 最终文案 |
| --- | --- |
| `contact.eyebrow_span` | 04 / 联系 Sakura |
| `contact.copy_email_button` | 复制邮箱 |
| `contact.contact_github_span` | GitHub / Sakura-Dt |
| `contact.contact_signature_strong` | SAKURA |
| `contact.contact_signature_span` | 折向 / FORM IN THE MAKING |
| `contact.contact_signature_p` | 从一段程序，到一个可以使用的作品。 |

### web_detail

| 内容键 | 最终文案 |
| --- | --- |
| `web_detail.meta_content` | 个人网站的响应式设计、原生前端实现与浏览器验证记录。 |
| `web_detail.title` | 个人网站 · 设计与工程记录 · Sakura |
| `web_detail.skip_link_a` | 跳到主要内容 |
| `web_detail.case_back_a` | ← 返回作品索引 |
| `web_detail.record_label_p` | 项目 01 / 个人网站 |
| `web_detail.record_intro_h1` | 个人网站的设计与实现 |
| `web_detail.record_intro_p` | 我的第一个 Web 项目。用 HTML、CSS 和 JavaScript 展示个人资料与开发实践，并根据屏幕宽度调整内容顺序。下方演示直接使用当前本地首页。 |
| `web_detail.record_grid_span` | 01 / 演示依据 |
| `web_detail.record_grid_h2` | 演示来自真实首页 |
| `web_detail.record_grid_p` | 三个关键布局来自真实首页的 HTML、CSS 和 SVG，分别在 1440×900、768×1024、390×844 下实测。中间状态对元素位置、字号和图形顶点做连续插值，展示当前本地版本。 |
| `web_detail.record_grid_p_2` | 演示与当前首页共用内容、字体和配色，保留同一组页面元素，展示响应式布局的调整过程。 |
| `web_detail.text_link_a` | 打开真实首页 ↗ |
| `web_detail.small_link_a` | 查看原始页面渲染 ↗ |
| `web_detail.decisions_span` | 02 / 响应式设计 |
| `web_detail.decisions_h2` | 为不同屏幕安排内容 |
| `web_detail.record_decisions_strong` | 空间 |
| `web_detail.record_decisions_span` | 桌面把中文命题与折面并列；手机把标题、完整折面和个人身份组织成纵向顺序。图形与正文各有自己的阅读空间。 |
| `web_detail.record_decisions_strong_2` | 比例 |
| `web_detail.record_decisions_span_2` | 字号、行高、图形尺寸和位置分别调整。中文主标题保持两行，英文品牌文字降低权重，内容整体没有被等比例压小。 |
| `web_detail.record_decisions_strong_3` | 入口 |
| `web_detail.record_decisions_span_3` | 768px仍保留完整导航；760px以内折叠为目录。菜单可由键盘操作，Escape可关闭，导航目标保留顶部补偿。 |
| `web_detail.record_decisions_strong_4` | 动效 |
| `web_detail.record_decisions_span_4` | 有限固定区间与原生滚动共存。前进、后退使用同一个进度状态；系统或站内减少动效时提供静态阅读。 |
| `web_detail.record_grid_span_2` | 03 / 技术实现 |
| `web_detail.record_grid_h2_2` | 静态生成与托管 |
| `web_detail.record_grid_p_3` | 原生 HTML、CSS 与 JavaScript。资料集中在 JSON，模板生成根目录 HTML，适配 GitHub Pages 静态托管。访问者无需安装依赖，也不需要后端或数据库。 |
| `web_detail.record_grid_p_4` | 首页至个人介绍以同一折面形成信息结构；Python项目展示真实工具在示例文件上的分类、预览、确认与日志。项目筛选、邮箱复制和原生详情展开保留独立入口。 |
| `web_detail.record_grid_p_5` | 当前视觉重构保存在本地分支，尚未部署。线上入口可查看已发布版本。 |
| `web_detail.record_grid_span_3` | 04 / 验证 |
| `web_detail.record_grid_h2_3` | 布局与交互验证 |
| `web_detail.record_grid_p_6` | 静态检查验证资源、相对路径和锚点；浏览器验证桌面、平板、手机的实际构图，检查正反向、导航、无脚本与减少动效。演示的关键位置与真实首页的测量结果对照，避免看似流畅却失真的布局。 |
| `web_detail.record_grid_p_7` | 测试结果与环境记录随实现保留。浏览器模拟不能代替真实手机、其他浏览器和人工读屏验收。 |
| `web_detail.text_link_a_2` | GitHub 源码 ↗ |
| `web_detail.small_link_a_2` | 线上入口 ↗ |
| `web_detail.small_link_a_3` | 文件整理助手详情 ↗ |

### python_detail

| 内容键 | 最终文案 |
| --- | --- |
| `python_detail.meta_content` | 本地运行的命令行工具：先预览分类计划，输入 MOVE 后执行。 |
| `python_detail.title` | 文件整理助手 · 实现与边界 · Sakura |
| `python_detail.skip_link_a` | 跳到主要内容 |
| `python_detail.case_back_a` | ← 返回作品索引 |
| `python_detail.eyebrow_span` | 项目 02 / Python 文件整理助手 |
| `python_detail.case_hero_h1` | 文件整理助手 |
| `python_detail.organizer_principle_span` | 预览 |
| `python_detail.organizer_principle_span_2` | 确认 |
| `python_detail.organizer_principle_span_3` | 移动 |
| `python_detail.eyebrow_span_2` | 01 / 工具行为 |
| `python_detail.case_grid_h2` | 分类与执行分开 |
| `python_detail.case_grid_p` | 使用 Python 标准库 pathlib 扫描目录第一层的普通文件，按扩展名安排到 images、documents、archives、media 或 others。生成计划与执行计划使用不同函数。 |
| `python_detail.case_grid_li` | 默认只显示去向，不创建目录、不移动文件。 |
| `python_detail.case_grid_li_2` | 指定 <code>--apply</code> 后，仍需输入大写 <code>MOVE</code> 确认。 |
| `python_detail.case_grid_li_5` | 已有目标不覆盖；隐藏文件、子目录和符号链接跳过。 |
| `python_detail.case_grid_li_6` | 已完成的移动逐项记录到目标目录的 <code>.organizer-log.jsonl</code>。 |
| `python_detail.eyebrow_span_3` | 02 / 本地运行 |
| `python_detail.case_grid_h2_2` | 在本地试用 |
| `python_detail.case_grid_p_2` | 需要 Python 3.12，无第三方依赖。下载脚本后，创建 sample-files 测试目录，放入几份无关紧要的文件。Windows 可将 python3 换成 py。 |
| `python_detail.code_example_span` | 01 / 预览，不移动 |
| `python_detail.code_example_span_2` | 02 / 核对预览后执行 |
| `python_detail.code_example_small` | 提示时输入 MOVE，其他输入会取消。 |
| `python_detail.solid_link_a` | 下载 Python 源文件 ↓ |
| `python_detail.fine_print_p` | 工具在你的电脑运行。此网页不读取、不上传任何本地文件。 |
| `python_detail.eyebrow_span_4` | 03 / 使用限制 |
| `python_detail.case_grid_h2_3` | 当前限制 |
| `python_detail.case_grid_p_3` | 目前不递归、不自动撤销。通过同文件系统硬链接建立目标，再删除原路径，以避免覆盖已有目标；文件系统需要支持硬链接，没有跨文件系统复制模式。 |
| `python_detail.case_grid_p_4` | 执行前会重新核对源文件。执行期间不要同时修改目录。它不是事务：中途失败时，部分移动可能已经完成。请核对目录和日志；日志写入失败时最后记录可能不完整。 |
| `python_detail.case_grid_p_5` | 恢复流程与自定义分类仍是后续方向，尚未实现。 |
| `python_detail.eyebrow_span_5` | 04 / 测试 |
| `python_detail.case_grid_h2_4` | 测试覆盖哪些情况 |
| `python_detail.case_grid_p_6` | 测试覆盖预览无副作用、取消确认、重名目标、源文件变化、目录与符号链接等情况。测试仅操作临时目录，不整理开发电脑的真实文件。 |
| `python_detail.text_link_a` | GitHub 源码 ↗ |
| `python_detail.text_link_a_2` | 个人网站详情 ↗ |
| `python_detail.command_preview` | python3 file_organizer.py ./sample-files |
| `python_detail.command_apply` | python3 file_organizer.py ./sample-files --apply |

### runtime

| 内容键 | 最终文案 |
| --- | --- |
| `runtime.copy_success` | 邮箱已复制，可以粘贴到邮件应用。 |
| `runtime.copy_denied` | 请手动复制：{email} |
| `runtime.motion_system` | 系统已减少动效 |
| `runtime.motion_resume` | 恢复动效 |
| `runtime.motion_reduce` | 减少动效 |
| `runtime.filter_status` | 已显示 {count} 个项目 |
| `runtime.scroll_work` | 继续看作品 |
| `runtime.scroll_down` | 向下阅读 |
| `runtime.source` | 真实首页 / 当前本地版本 |
| `runtime.source_mobile` | {width} × {height} / 真实首页 |
| `runtime.desktop` | 桌面 · 并列布局 |
| `runtime.tablet` | 平板 · 重新分配空间 |
| `runtime.mobile` | 手机 · 标题 → 图形 → 身份 |
| `runtime.order_states` | A / 无序；B / 按扩展名分类；C / 预览：12 待移动，1 跳过；D / 输入 MOVE 才执行；E / 12 已移动，1 跳过，12 条日志 |
