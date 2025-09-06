# Little_100 个人主页

这是一个集成了GitHub项目展示和Bilibili数据分析的个人主页。

## 功能特性

- 📊 GitHub项目自动展示
- 📹 Bilibili视频数据分析
- 🎯 实时弹幕展示
- 🌙 深色/浅色主题切换
- 📱 响应式设计
- 🤖 GitHub Actions自动数据更新

## 自动化部署

项目使用GitHub Actions每天自动更新数据：

1. 获取最新的GitHub仓库信息
2. 抓取Bilibili视频数据和统计信息
3. 生成数据文件并提交到仓库

## 配置说明

在GitHub仓库的Settings > Secrets中添加以下环境变量：

- `BILIBILI_UID`: 你的Bilibili用户ID

## 本地运行

1. 克隆仓库
2. 安装Python依赖：`pip install requests pyyaml openpyxl bilibili-api-python`
3. 运行数据获取脚本：`python unified_data_fetcher.py`
4. 启动HTTP服务器：`python -m http.server 8000`
5. 访问 `http://localhost:8000`

## 文件结构

- `index.html` - 主页面
- `styles.css` - 样式文件
- `script.js` - 前端脚本
- `unified_data_fetcher.py` - 统一数据获取脚本
- `bilibili_fetcher.py` - Bilibili数据获取模块
- `github_data.js` - GitHub数据文件（自动生成）
- `bilibili_data.js` - Bilibili数据文件（自动生成）

## 弹幕功能

弹幕会在Bilibili数据分析区域内随机位置出现，从右向左移动，鼠标悬停可暂停并放大显示。
