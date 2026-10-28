# 从修改到发布

先把一个需求缩小为可验证的改动。日常在开发分支工作，主分支保存准备发布的版本。

## 1. 开始一个独立改动

确认工作区没有未处理修改，再更新主分支，创建以 `codex/` 开头的分支：

```bash
git status
git switch main
git pull --ff-only
git switch -c codex/describe-your-change
```

分支名按任务命名即可，不依赖任何开发电脑目录。若已有未提交工作，先确认归属并保存，不要直接清理或覆盖。

## 2. 验证后提交

```bash
python3 scripts/check_site.py
python3 -m unittest discover -s tests -p 'test_*.py' -v
npm test
git diff --check
git diff
```

首次测试前运行 `npm ci` 和 `npx playwright install chromium`。然后用 `git add` 明确选择本次文件，`git diff --cached` 核对，再 `git commit`。每个提交说明这次解决了什么问题，避免一次混入多个不相关任务。

## 3. 审查与合并

决定公开开发分支时，再推送该分支并创建 PR。Actions 检查通过后阅读差异，确认未包含真实文件目录、日志、凭据或无关修改，然后合并到 `main`。可使用 GitHub 的普通合并保留独立提交，也可压缩为一个清晰提交。

若只在本地开发，也可审查后使用 `git switch main`、`git merge --ff-only codex/你的分支名`；出现分叉时先检查原因，勿为绕过问题使用强制推送。

## 4. 发布与恢复

`main` 推送会触发已有 Pages 发布；本项目的自动检查目前与它并行，**失败不会自动拦截部署**。推送后同时检查 Check site 和 Pages，最后打开网站核对。

需要撤销已发布的某次变更时，先确认提交号，用 `git revert 提交号` 创建反向提交、重新验证并发布。这样保留历史，不必改写远程记录。

本轮采用 `codex/project-details-and-tools` 分支。分支中保留之前自动检查的提交，再按工具和网站改动分别提交；本地完成不等于已合并或上线。
