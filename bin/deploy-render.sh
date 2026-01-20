#!/bin/bash

# Render 部署脚本
# 用于将 Quartz Online (Next.js) 部署到 Render

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=================================="
echo "🚀 Render 部署脚本"
echo -e "==================================${NC}"
echo ""

# 获取项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

if [ -f ".env.render" ]; then
    echo -e "${GREEN}✓ 加载 .env.render 配置${NC}"
    export $(cat .env.render | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ 错误: .env.render 文件不存在${NC}"
    exit 1
fi

echo -e "${BLUE}📦 开始构建项目（本地测试）...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 构建失败${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 构建完成${NC}"
echo ""

echo -e "${BLUE}🚀 准备部署到 Render...${NC}"
echo ""

# Render 通过 Git 自动部署
echo -e "${YELLOW}Render 使用 Git 自动部署${NC}"
echo ""
echo -e "${BLUE}部署步骤：${NC}"
echo "1. 确保代码已提交到 Git 仓库"
echo "2. 将代码推送到远程仓库 (GitHub/GitLab/Bitbucket)"
echo "3. Render 将自动检测并部署更新"
echo ""

# 如果设置了 Deploy Hook，可以触发部署
if [ -n "$RENDER_DEPLOY_HOOK_URL" ]; then
    echo -e "${BLUE}触发 Render 部署...${NC}"
    curl -X POST "$RENDER_DEPLOY_HOOK_URL"

    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}=================================="
        echo "✅ 部署触发成功！"
        echo -e "==================================${NC}"
        echo ""
        echo -e "${BLUE}📝 后续步骤：${NC}"
        echo "1. 访问 https://dashboard.render.com 查看部署进度"
        echo "2. 检查构建日志"
        echo "3. 配置环境变量（如需要）"
        echo ""
    else
        echo -e "${RED}❌ 部署触发失败${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}💡 提示：${NC}"
    echo "- 在 Render Dashboard 创建 Deploy Hook"
    echo "- 将 Deploy Hook URL 添加到 .env.render 的 RENDER_DEPLOY_HOOK_URL"
    echo "- 或者直接推送代码到 Git 仓库触发自动部署"
    echo ""
    echo -e "${GREEN}=================================="
    echo "✅ 本地构建验证成功！"
    echo -e "==================================${NC}"
fi
