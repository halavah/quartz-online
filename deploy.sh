#!/bin/bash

# ========================================
# Quartz Online - 统一部署脚本
# ========================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="$SCRIPT_DIR/bin"

# 打印函数
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
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

# 检查脚本是否存在
check_script() {
    local script_name=$1
    local script_path="$BIN_DIR/$script_name"

    if [ ! -f "$script_path" ]; then
        print_error "脚本不存在: $script_path"
        return 1
    fi

    if [ ! -x "$script_path" ]; then
        print_info "脚本没有执行权限，正在添加..."
        chmod +x "$script_path"
        print_success "已添加执行权限"
    fi

    return 0
}

# 执行部署脚本
run_deploy() {
    local script_name=$1
    local platform_name=$2

    if check_script "$script_name"; then
        print_header "开始部署到 $platform_name"
        echo ""
        cd "$BIN_DIR"
        ./"$script_name"
        local exit_code=$?
        cd "$SCRIPT_DIR"
        return $exit_code
    else
        return 1
    fi
}

# 显示主菜单
show_menu() {
    clear
    print_header "Quartz Online - 部署管理"

    echo -e "${PURPLE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  选择部署平台${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════${NC}"
    echo ""

    echo -e "${GREEN}  1.${NC} ▲ ${BLUE}Vercel${NC}"
    echo -e "     ${PURPLE}→${NC} 部署到 Vercel 边缘网络 (推荐)"
    echo ""

    echo -e "${GREEN}  2.${NC} 🌊 ${BLUE}Netlify${NC}"
    echo -e "     ${PURPLE}→${NC} 部署到 Netlify 平台"
    echo ""

    echo -e "${GREEN}  3.${NC} 🎨 ${BLUE}Render${NC}"
    echo -e "     ${PURPLE}→${NC} 部署到 Render (Git 自动部署)"
    echo ""

    echo -e "${GREEN}  4.${NC} ☁️  ${BLUE}Cloudflare Pages${NC}"
    echo -e "     ${PURPLE}→${NC} 部署到 Cloudflare Pages (使用 @cloudflare/next-on-pages)"
    echo ""

    echo -e "${GREEN}  5.${NC} 🏢 ${BLUE}1Panel${NC}"
    echo -e "     ${PURPLE}→${NC} 部署到腾讯云 1Panel 服务器"
    echo ""

    echo -e "${PURPLE}═══════════════════════════════════════════════════════════${NC}"
    echo ""

    echo -e "${GREEN}  9.${NC} 🚪 ${BLUE}退出${NC}"
    echo ""

    echo -e "${PURPLE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

# 主循环
main() {
    # 检查 bin 目录是否存在
    if [ ! -d "$BIN_DIR" ]; then
        print_error "bin 目录不存在: $BIN_DIR"
        exit 1
    fi

    while true; do
        show_menu

        # 重置 choice 变量
        choice=""

        echo -ne "${YELLOW}请选择部署平台 [1-5, 9] (默认: 9):${NC} "
        read -r choice

        # 如果用户直接按回车，默认退出
        choice=${choice:-9}

        case $choice in
            1)
                run_deploy "deploy-vercel.sh" "Vercel"
                ;;

            2)
                run_deploy "deploy-netlify.sh" "Netlify"
                ;;

            3)
                run_deploy "deploy-render.sh" "Render"
                ;;

            4)
                run_deploy "deploy-flare.sh" "Cloudflare Pages"
                ;;

            5)
                run_deploy "deploy-1panel.sh" "1Panel"
                ;;

            9)
                print_info "感谢使用 Quartz Online 部署工具"
                echo ""
                exit 0
                ;;

            *)
                print_error "无效的选项: $choice"
                ;;
        esac

        # 操作完成后，等待用户按键
        if [ "$choice" != "9" ]; then
            echo ""
            echo -e "${PURPLE}═══════════════════════════════════════════════════════════${NC}"
            echo -ne "${YELLOW}按 Enter 键返回主菜单...${NC}"
            read -r
        fi
    done
}

# 启动主循环
main
