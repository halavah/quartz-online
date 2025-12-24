#!/bin/bash

# ========================================
# Quartz Online - Cloudflare Pages 部署脚本
# 使用 Next.js 静态导出部署到 Cloudflare Pages
# ========================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 打印函数
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_header() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  $1"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Navigate to the directory where the script is located
cd "$(dirname "$0")"

# Go back to project root directory
cd ..

# 项目名称
PROJECT_NAME="quartz-online"

print_header "Cloudflare Pages 部署 - $PROJECT_NAME (Next.js 静态导出)"

# 检查是否安装了 wrangler
print_info "检查 wrangler 是否已安装..."
if ! command -v npx &> /dev/null; then
    print_error "npx 未找到，请确保 Node.js 已正确安装"
    exit 1
fi
print_success "wrangler 可用"

# 设置 Cloudflare 认证环境变量
# 必须从 .env 文件加载
if [ -f ".env" ]; then
    print_info "从 .env 文件加载认证信息..."
    export $(grep -v '^#' .env | xargs)
else
    print_error ".env 文件不存在！"
    echo ""
    echo "请先创建 .env 文件并配置 Cloudflare 认证信息："
    echo ""
    echo "  cp .env.example .env"
    echo "  nano .env"
    echo ""
    echo "然后在 .env 文件中设置："
    echo "  CLOUDFLARE_API_KEY=your_api_key_here"
    echo "  CLOUDFLARE_EMAIL=your_email@example.com"
    echo ""
    exit 1
fi

# 检查必需的环境变量
if [ -z "$CLOUDFLARE_API_KEY" ] || [ -z "$CLOUDFLARE_EMAIL" ]; then
    print_error ".env 文件中缺少必需的配置项！"
    echo ""
    echo "请确保 .env 文件包含以下配置："
    echo "  CLOUDFLARE_API_KEY=your_api_key_here"
    echo "  CLOUDFLARE_EMAIL=your_email@example.com"
    echo ""
    exit 1
fi

export CLOUDFLARE_API_KEY
export CLOUDFLARE_EMAIL

# 构建 Next.js 项目（静态导出）
print_info "开始构建 Next.js 项目..."
print_info "运行: npm run build"
echo ""

if npm run build; then
    print_success "构建成功"
else
    print_error "构建失败"
    exit 1
fi

echo ""
print_info "准备部署到 Cloudflare Pages..."
print_info "项目名称: $PROJECT_NAME"
print_info "部署目录: out/"
echo ""

# 确认部署
echo -ne "${YELLOW}确认部署? [y/N]:${NC} "
read -r confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    print_warning "部署已取消"
    exit 0
fi

# 执行部署
print_info "正在上传并部署..."
echo ""

npx wrangler pages deploy out --project-name="$PROJECT_NAME"

# 检查部署结果
if [ $? -eq 0 ]; then
    echo ""
    print_header "部署成功!"
    print_success "项目已部署到 Cloudflare Pages"
    print_info "访问地址: https://$PROJECT_NAME.pages.dev"
    echo ""
else
    echo ""
    print_error "部署失败，请检查错误信息"
    exit 1
fi
