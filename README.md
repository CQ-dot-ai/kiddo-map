# 🗺️ Kiddo Map · 吉隆坡童游地图

> 3 分钟决定带娃去哪儿，一键导航出发

一个 Headspace 风格的亲子地图 PWA，整合 KL 优质亲子地点。

## ✨ 功能

- 🗺️ 童趣 Lego 风格地图（Mapbox 自定义样式）
- 📍 5 个精选 KL 亲子地点
- 🎨 糖果色 + 圆润设计
- ⭐ Google 评分整合
- 🚗 一键导航（Google Maps + Waze 双选）
- ❤️ 收藏功能（本地存储）
- 💬 反馈表单
- 📱 PWA 支持（添加到主屏幕）

## 🛠️ 技术栈

- **框架**: Next.js 14
- **地图**: Mapbox GL JS
- **动画**: Framer Motion
- **图标**: Lucide React + Emoji
- **字体**: Nunito + Fredoka

## 📂 项目结构

```
kiddo-map/
├── src/
│   ├── pages/
│   │   ├── _app.js          # 入口
│   │   └── index.js          # 主页（地图）
│   ├── components/
│   │   ├── KiddoMap.js       # 地图组件
│   │   ├── PlaceDetail.js    # 详情页
│   │   ├── NavigationSheet.js # 导航选择
│   │   └── FeedbackSheet.js  # 反馈表单
│   └── data/
│       └── places.js         # 5 个地点数据
├── public/
│   └── manifest.json         # PWA 配置
├── styles/
│   └── globals.css           # 全局样式
├── package.json
├── next.config.js
└── README.md
```

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 🌐 部署到 Vercel

```bash
# 1. 推送到 GitHub
git init
git add .
git commit -m "Initial: Kiddo Map MVP"
git remote add origin https://github.com/你的用户名/kiddo-map.git
git push -u origin main

# 2. 到 Vercel 导入项目
# https://vercel.com/new
```

## 📊 验证目标（2 周）

- [ ] 30+ 真实用户访问
- [ ] 5+ 真实反馈
- [ ] 3+ 添加到主屏幕

## 🎨 设计系统

**色彩**:
- Coral `#FF8A65` (主)
- Sunshine `#FFD54F`
- Mint `#81C784`
- Sky Blue `#64B5F6`
- Lavender `#9575CD`

**圆角**: 永远 16-24px，绝不直角  
**字体**: Nunito (正文) + Fredoka (品牌)

---

Made with 💛 for KL parents
