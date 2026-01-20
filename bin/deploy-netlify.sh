#!/bin/bash

# Netlify 部署脚本
# 用于将 Quartz Online (Next.js) 部署到 Netlify

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=================================="
echo "🚀 Netlify 部署脚本"
echo -e "==================================${NC}"
echo ""

# 获取项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

if [ -f ".env.netlify" ]; then
    echo -e "${GREEN}✓ 加载 .env.netlify 配置${NC}"
    export $(cat .env.netlify | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ 错误: .env.netlify 文件不存在${NC}"
    exit 1
fi

if [ -z "$NETLIFY_AUTH_TOKEN" ]; then
    echo -e "${RED}❌ 错误: NETLIFY_AUTH_TOKEN 未设置${NC}"
    echo -e "${YELLOW}请在 .env.netlify 中设置 NETLIFY_AUTH_TOKEN${NC}"
    exit 1
fi

if ! command -v netlify &> /dev/null; then
    echo -e "${YELLOW}⚠️  Netlify CLI 未安装，正在安装...${NC}"
    npm install -g netlify-cli
fi
echo -e "${GREEN}✓ Netlify CLI: $(netlify --version)${NC}"
echo ""

echo -e "${BLUE}📦 开始构建项目...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 构建失败${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 构建完成${NC}"
echo ""

echo -e "${BLUE}🚀 开始部署到 Netlify...${NC}"
echo ""

# 部署
if [ -n "$NETLIFY_SITE_ID" ]; then
    netlify deploy --prod --auth="$NETLIFY_AUTH_TOKEN" --site="$NETLIFY_SITE_ID"
else
    netlify deploy --prod --auth="$NETLIFY_AUTH_TOKEN"
fi

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=================================="
    echo "✅ 部署成功！"
    echo -e "==================================${NC}"
    echo ""
    echo -e "${BLUE}📝 后续步骤：${NC}"
    echo "1. 访问 https://app.netlify.com 查看部署详情"
    echo "2. 配置自定义域名（可选）"
    echo "3. 检查环境变量和构建设置"
    echo ""
else
    echo -e "${RED}❌ 部署失败${NC}"
    exit 1
fi
