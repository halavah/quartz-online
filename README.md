# TechVerse - 高档次技术博客系统

一个基于 Next.js 15 构建的现代化技术博客，支持外部 HTML 文章挂载和 JSON 配置管理。

## ✨ 特性

- 🚀 基于 Next.js 15+ (App Router)
- 🎨 现代化设计，高档次视觉体验
- 📝 支持外部 HTML 文章文件
- ⚙️ 简单的 JSON 配置管理
- 📱 完全响应式设计
- ⚡ 静态站点生成，支持部署到任何静态服务器
- 🎯 极简主义，内容为王

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

### 3. 构建静态网站

```bash
npm run build
```

生成的静态文件在 `out/` 目录。

## 📁 项目结构

```
media-online/
├── app/                     # Next.js App Router
│   ├── page.tsx            # 首页
│   ├── article/[id]/       # 文章详情页动态路由
│   │   └── page.tsx
│   ├── layout.tsx          # 根布局
│   └── globals.css         # 全局样式
│
├── data/
│   └── articles.json       # 文章配置文件 ⭐
│
├── public/
│   └── articles/           # HTML 文章文件 ⭐
│       ├── nextjs-15-features.html
│       └── ai-dev-tools.html
│
├── docs/                   # 项目文档
│   ├── REQUIREMENTS.md     # 需求文档
│   └── DESIGN_SPEC.md      # 设计规范
│
└── [配置文件]
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── postcss.config.js
    └── package.json
```

## 📝 如何添加新文章

### 步骤 1: 编写 HTML 文章

在 `public/articles/` 目录创建新的 HTML 文件：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>我的文章标题</title>
    <!-- 可选：添加自定义样式 -->
    <style>
        body { font-family: sans-serif; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>我的文章标题</h1>
    <p>文章内容...</p>
</body>
</html>
```

### 步骤 2: 更新 JSON 配置

编辑 `data/articles.json`，在 `articles` 数组中添加新文章：

```json
{
  "id": "my-article-slug",
  "title": "我的文章标题",
  "description": "文章简介",
  "htmlFile": "my-article.html",
  "author": "作者名",
  "date": "2024-12-11",
  "readTime": "5 分钟",
  "tags": ["标签1", "标签2"],
  "featured": false
}
```

### 步骤 3: 完成！

刷新浏览器或重新构建网站即可看到新文章。

## 🎨 设计特点

- **极简美学**: 去除冗余元素，聚焦内容
- **优雅排版**: 使用 Inter 字体和精心调整的间距
- **高级质感**: 精心设计的阴影、圆角和过渡动画
- **专业配色**: 基于 Slate/Gray 的中性色系，蓝色作为强调色

## 🛠️ 技术栈

- **框架**: Next.js 15.1.5
- **样式**: Tailwind CSS 3.4
- **排版**: Tailwind Typography
- **语言**: TypeScript
- **图标**: 内联 SVG (Heroicons)

## 📤 部署指南

### 静态托管

1. 构建项目：
   ```bash
   npm run build
   ```

2. 将 `out` 目录上传到任何静态托管服务：
   - Nginx/Apache
   - AWS S3 + CloudFront
   - Vercel
   - Netlify
   - GitHub Pages

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/out;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }
}
```

## 🎯 核心配置

### next.config.ts

```typescript
const nextConfig = {
  output: 'export',           // 启用静态导出
  images: {
    unoptimized: true         // 静态导出时禁用图片优化
  },
  trailingSlash: true,        // URL 末尾添加斜杠
};
```

### 文章渲染

文章详情页通过 `dangerouslySetInnerHTML` 渲染 HTML 文件，支持：

- 标准 HTML 标签
- 内联 CSS 样式
- 代码高亮
- 图片、链接等所有 HTML 元素

## 📚 相关文档

- [需求文档](./docs/REQUIREMENTS.md) - 详细的功能需求说明
- [设计规范](./docs/DESIGN_SPEC.md) - 设计系统和 UI 规范

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
