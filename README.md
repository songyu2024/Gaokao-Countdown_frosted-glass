# 高考倒计时 - 毛玻璃效果版

一个基于Web的高考倒计时应用，采用现代毛玻璃（Frosted Glass）视觉效果设计，支持Wallpaper Engine动态壁纸。

## ✨ 特性

- 🎓 **精准倒计时**：实时显示距离2026年高考的剩余时间（天、时、分、秒）
- 🌟 **毛玻璃效果**：采用CSS backdrop-filter技术，呈现优雅的毛玻璃质感
- 🌤️ **实时天气**：通过API获取实时天气信息和温度
- 💬 **每日一言**：多API支持，随机显示励志语句和诗词
- 🖼️ **动态背景**：支持多种背景API，可点击切换不同风格
- 🖱️ **交互式设计**：点击不同卡片实现不同功能
- 🎮 **Wallpaper Engine支持**：完美适配动态壁纸软件
- ⌨️ **快捷键支持**：键盘操作更便捷
- 📱 **响应式设计**：完美适配各种屏幕尺寸

## 🎨 视觉效果

毛玻璃效果特点：
- 25px背景模糊效果
- 半透明白色遮罩层
- 优雅的阴影和辉光效果
- 流畅的悬停动画

## 🖼️ 界面布局

应用采用垂直三层卡片布局：
- **天气卡片**：显示天气类型和温度范围
- **倒计时卡片**：显示高考倒计时的核心信息
- **一言卡片**：显示励志名言或诗句

## 🎮 交互功能

### 鼠标点击
- **倒计时卡片**：切换到fj风景背景
- **天气卡片**：随机切换pc/moe/moez背景
- **一言卡片**：刷新励志语句

### 快捷键操作
- **按键1**：切换到fj风景背景
- **按键2**：随机切换特殊背景
- **按键3**：刷新一言内容

### Wallpaper Engine支持
- 支持桌面壁纸点击交互
- 音频可视化接口预留
- 全屏自适应布局

## 🚀 快速开始

### 本地运行

1. 克隆项目到本地
```bash
git clone [your-repo-url]
cd gaokao-countdown
```

2. 准备字体文件
确保 `front/` 文件夹包含以下字体：
- `苹方字体.ttf` - 现代中文字体
- `AaLanTingTiShi-LuoBiRuShen-2.ttf` - 兰亭体字体
- `DS-DIGI-1.ttf` - 数字显示字体

3. 使用本地服务器运行
```bash
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx http-server

# 或使用Live Server插件（VS Code）
```

4. 在浏览器中访问 `http://localhost:8000`

### Wallpaper Engine使用

1. 将整个项目文件夹复制到Wallpaper Engine工作坊目录
2. 在Wallpaper Engine中选择"网页"类型壁纸
3. 指向项目中的 `index.html` 文件
4. 享受交互式动态壁纸体验

## 📁 项目结构

```
gaokao-countdown/
├── index.html          # 主页面
├── style.css           # 样式文件（毛玻璃效果）
├── script.js           # JavaScript逻辑
├── front/              # 字体文件夹
│   ├── 苹方字体.ttf
│   ├── AaLanTingTiShi-LuoBiRuShen-2.ttf
│   └── DS-DIGI-1.ttf
└── README.md
```

## 🛠️ 技术栈

- **HTML5**：页面结构
- **CSS3**：毛玻璃效果和响应式设计
  - `backdrop-filter: blur(25px)` - 背景模糊
  - `rgba(255, 255, 255, 0.35)` - 半透明遮罩
  - 优雅的盒阴影和辉光效果
- **JavaScript**：交互逻辑和API调用
- **Web APIs**：背景图片、天气信息、一言内容

## 🌐 API 接口

### 背景图片API
- **fj** - 风景图片：`https://t.alcy.cc/fj`
- **pc** - PC壁纸：`https://t.alcy.cc/pc`
- **moe** - 动漫图片：`https://t.alcy.cc/moe`
- **moez** - 动漫图片2：`https://t.alcy.cc/moez`

### 一言API（多重备用）
- 主API：`https://v1.hitokoto.cn/`
- 备用API1：`international.v1.hitokoto.cn`
- 备用API2：`https://api.oick.cn/yiyan/api.php`
- 备用API3：`https://saying.api.azwcl.com/saying/get`

### 天气API
- 天气信息：`https://api.vvhan.com/api/weather`

## ⚙️ 自定义配置

### 修改高考日期
在 `script.js` 中找到并修改：
```javascript
const targetDate = new Date("2026-06-07T00:00:00"); // 修改为目标日期
```

### 调整毛玻璃效果
在 `style.css` 中可以调整：
```css
.glass-card, .quote-card {
  background: rgba(255, 255, 255, 0.35); /* 调整透明度 */
  backdrop-filter: blur(25px); /* 调整模糊程度 */
}
```

### 自定义刷新间隔
```javascript
// 背景自动刷新（默认10分钟）
setInterval(refreshBackground, 10 * 60 * 1000);

// 一言自动刷新（默认2分钟）
setInterval(loadHitokoto, 2 * 60 * 1000);
```

## 🌐 浏览器兼容性

- ✅ Chrome 76+（完整支持）
- ✅ Firefox 103+（完整支持）
- ✅ Safari 14+（完整支持）
- ✅ Edge 79+（完整支持）
- ⚠️ 旧版浏览器可能不支持backdrop-filter

## 🎯 使用场景

- **学生备考**：高考倒计时提醒
- **动态壁纸**：Wallpaper Engine桌面美化
- **Web展示**：现代毛玻璃设计案例
- **教育机构**：考试倒计时展示

## 🔄 自动功能

- **背景轮换**：每10分钟自动更换背景图片
- **一言刷新**：每2分钟自动更新励志语句
- **天气更新**：每2分钟自动获取最新天气
- **倒计时更新**：每秒精确更新剩余时间

## 📝 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 如何贡献
1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📞 支持与反馈

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- [添加你的联系方式]

---

**为所有高考学子加油！愿每一天的努力都成为通往梦想的阶梯！** 🎓✨

*"宝剑锋从磨砺出，梅花香自苦寒来" - 坚持就是胜利！*
