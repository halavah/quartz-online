# Halavah's Tech - 专注前沿技术的分享平台

一个基于 Next.js 15 构建的现代化技术博客，专注于 AI 工具、开发技术和前沿科技的分享。

## ✨ 特性

- 🚀 基于 Next.js 15+ (App Router)
- 🎨 深色科技主题，专业视觉体验
- 📝 支持 Markdown 和 HTML 文章
- ⚙️ 灵活的 JSON 配置管理
- 📱 完全响应式设计
- 🔄 网格/列表视图切换
- 🔍 全文搜索功能
- 🌓 深色/浅色主题切换
- ⚡ 静态站点生成，支持部署到任何静态服务器
- 📋 分类筛选和分页
- 🎯 简洁优雅，专注内容

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
quartz-online/
├── app/                     # Next.js App Router
│   ├── page.tsx            # 首页
│   ├── components/         # 共享组件
│   │   ├── Navbar.tsx       # 导航栏
│   │   ├── Footer.tsx       # 页脚
│   │   └── Pagination.tsx  # 分页组件
│   ├── layout.tsx          # 根布局
│   └── globals.css         # 全局样式
│
├── data/
│   └── articles.json       # 文章配置文件 ⭐
│
├── public/
│   ├── chapter01/          # 安装指南
│   │   ├── 0101.windows-installation.html
│   │   ├── 0102.macos-installation.html
│   │   ├── 0103.linux-wsl2-installation.html
│   │   └── 0201.claude-code-native-installation.html
│   └── chapter02/          # 工具介绍
│       ├── 0101.xget-high-performance-resource.html
│       ├── 0102.bytebot-ai-desktop-agent.html
│       ├── 0103.onyx-opensource-ai-platform.html
│       ├── 0104.trendradar-trend-monitoring-tool.html
│       └── 0105.tracy-profiler-performance-analysis.html
│
├── docs/                   # 项目文档
│   ├── 01.项目总览与快速开始.md
│   ├── 02.开发指南.md
│   ├── 03.内容管理.md
│   ├── 04.部署与运维.md
│   └── 05.Vercel部署.md
│
└── [配置文件]
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── postcss.config.js
    └── package.json
```

## 📝 内容管理

### 添加新文章

#### 方式一：HTML 文章（推荐）

1. 在 `public/chapter01/` 或 `public/chapter02/` 目录创建 HTML 文件
2. 使用统一的深色主题样式模板
3. 添加 TOC（目录导航）便于内容浏览

#### 方式二：JSON 配置

编辑 `data/articles.json`，添加新文章配置：

```json
{
  "title": "文章标题",
  "description": "文章简介",
  "htmlFile": "chapter01/your-article.html",
  "category": "分类名称"
}
```

### 配置说明

- **siteName**: 网站名称
- **siteDescription**: 网站描述
- **beianNumber**: 备案号（可选）
- **copyrightText**: 版权信息（可完整版权声明）
- **adLink**: 广告链接（用于导航栏横幅）

### 分类系统

自动从文章中提取唯一分类，支持多级分类：
- 安装指南
- AI工具
- 开发工具
- 技术趋势

### 分页设置

首页每页显示 6 篇文章，可通过修改 `ARTICLES_PER_PAGE` 常量调整。

## 🎨 设计特点

- **深色主题**: 专业的深色背景，保护眼睛
- **优雅动画**: 平滑的过渡效果和微交互
- **响应式**: 完美适配桌面和移动设备
- **可访问性**: 支持键盘导航和屏幕阅读器

## 🛠️ 技术栈

- **框架**: Next.js 15.1.5 (App Router)
- **样式**: Tailwind CSS + 自定义 CSS 变量
- **语言**: TypeScript
- **搜索**: 客户端全文搜索
- **部署**: 静态导出，支持 CDN

## 🔧 核心功能

### 1. 视图模式
- **网格视图**: 卡片式布局，信息密度适中
- **列表视图**: 简洁列表，快速浏览

### 2. 搜索功能
- 实时搜索文章标题、描述和分类
- 搜索结果高亮显示
- 键盘快捷键支持

### 3. 主题切换
- 深色/浅色主题
- 用户偏好持久化存储
- 平滑的过渡动画

## 📤 部署指南

### 本地部署

1. 安装依赖：
   ```bash
   npm install
   ```

2. 开发模式：
   ```bash
   npm run dev
   ```

3. 生产构建：
   ```bash
   npm run build
   ```

### 静态托管

1. 构建项目后，将 `out` 目录上传到任何静态托管服务：
   - Vercel（推荐）
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront
   - Nginx/Apache
   - 腾讯云 COS + CDN

### Docker 部署

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/out;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css text/js application/json application/javascript;

    # 缓存静态资源
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Vercel 部署（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

## 🔧 环境变量

创建 `.env.local` 文件（开发环境）或部署平台配置文件（生产环境）：

```env
NEXT_PUBLIC_SITE_NAME=Halavah's Tech
NEXT_PUBLIC_SITE_DESCRIPTION=探索前沿技术，提升开发效率
```

## 🚀 性能优化

1. **图片优化**：使用 WebP 格式，添加适当的尺寸
2. **代码分割**：Next.js 自动优化代码分割
3. **预加载关键资源**：关键 CSS 和字体预加载
4. **CDN 加速**：使用 CDN 加速静态资源

## 🎯 核心配置

### next.config.ts

```typescript
const nextConfig = {
  output: 'export',           // 启用静态导出
  images: {
    unoptimized: true         // 静态导出时禁用图片优化
  },
  trailingSlash: true,        // URL 末尾添加斜杠
  experimental: {
    optimizePackageImports: true,  // 包导入优化
    scrollRestoration: true    // 滚动位置恢复
  }
};
```

### 路由配置

- `/` - 首页（带筛选和视图切换）
- `/article/[id]` - 文章详情页
- `/about` - 关于页面（如需要）

### 文章渲染

文章详情页通过 `fetch` 获取 HTML 文件，支持：

- 标准 HTML 标签
- 内联 CSS 样式
- 返回顶部功能
- 阅读进度指示
- 代码块优化

## 📊 站点统计

集成了百度统计功能，如需启用请配置：

```html
<script>
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();
</script>
```

## 🔐 安全最佳实践

1. **XSS 防护**：使用 `dangerouslySetInnerHTML` 时确保内容可信
2. **依赖安全**：定期更新依赖包
3. **环境变量**：敏感信息使用环境变量
4. **HTTPS**: 生产环境强制使用 HTTPS

## 📚 项目文档

详细文档请参考 `docs/` 目录：

- [01.项目总览与快速开始](./docs/01.项目总览与快速开始.md)
- [02.开发指南](./docs/02.开发指南.md)
- [03.内容管理](./docs/03.内容管理.md)
- [04.部署与运维](./docs/04.部署与运维.md)
- [05.Vercel部署](./docs/05.Vercel部署.md)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🌟 联系方式

- GitHub：[https://github.com/halavah](https://github.com/halavah)
- 邮箱：联系邮箱可通过 GitHub Issues
