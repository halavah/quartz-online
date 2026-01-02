#!/bin/bash

# ================================================
# 腾讯云配置 - 请根据实际情况修改
# ================================================
# TODO: 请填入你的腾讯云服务器信息
SERVER_IP="your-tencent-cloud-ip"
SSH_USER="ubuntu"
REMOTE_DEPLOY_BASE="/opt/1panel/www/sites"
REMOTE_TARGET="$REMOTE_DEPLOY_BASE/quartz-online"

# Nginx 容器名称（如果使用 1Panel 的 OpenResty）
NGINX_CONTAINER="1Panel-openresty-xxxx"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}  📝 快速更新内容到腾讯云"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 获取项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}ℹ${NC} 项目根目录: $PROJECT_ROOT"
echo -e "${YELLOW}提示:${NC} 快速更新模式，仅更新 app 和 out 目录"
echo ""

# 步骤 1: 本地构建
echo -e "${CYAN}═══ 步骤 1/4: 本地构建 ═══${NC}"
cd "$PROJECT_ROOT"
echo -e "${BLUE}ℹ${NC} 正在执行: npm run build"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗${NC} 构建失败"
    exit 1
fi
echo -e "${GREEN}✓${NC} 构建完成"
echo ""

# 步骤 2: 打包内容文件
echo -e "${CYAN}═══ 步骤 2/4: 打包内容文件 ═══${NC}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PACKAGE_NAME="quartz-online-content-${TIMESTAMP}.tar.gz"

echo -e "${BLUE}ℹ${NC} 正在打包 app 和 out 目录..."

# 打包 app 和 out 目录
COPYFILE_DISABLE=1 tar -czf "/tmp/$PACKAGE_NAME" \
    --exclude=".DS_Store" \
    --exclude="._*" \
    -C "$PROJECT_ROOT" \
    app out

if [ $? -ne 0 ]; then
    echo -e "${RED}✗${NC} 打包失败"
    exit 1
fi
echo -e "${GREEN}✓${NC} 打包完成: $PACKAGE_NAME"
echo ""

# 步骤 3: 上传并部署
echo -e "${CYAN}═══ 步骤 3/4: 上传并部署 ═══${NC}"
echo -e "${BLUE}ℹ${NC} 正在上传到: $SSH_USER@$SERVER_IP"
scp -o StrictHostKeyChecking=no "/tmp/$PACKAGE_NAME" "$SSH_USER@$SERVER_IP:/tmp/"

if [ $? -ne 0 ]; then
    echo -e "${RED}✗${NC} 上传失败"
    rm -f "/tmp/$PACKAGE_NAME"
    exit 1
fi
echo -e "${GREEN}✓${NC} 上传完成"

# 清理本地临时文件
rm -f "/tmp/$PACKAGE_NAME"

# 远程解压
ssh -o StrictHostKeyChecking=no -t $SSH_USER@$SERVER_IP "sudo bash -c '
    TARGET=\"$REMOTE_TARGET\"
    PACKAGE=\"/tmp/$PACKAGE_NAME\"

    echo \"   目标路径: \$TARGET\"

    # 解压更新文件
    echo \"   📦 更新内容文件...\"
    su - $SSH_USER -c \"cd \$TARGET && tar -xzf \$PACKAGE\"

    # 设置权限
    chown -R $SSH_USER:$SSH_USER \$TARGET/app
    chown -R $SSH_USER:$SSH_USER \$TARGET/out
    chmod -R 755 \$TARGET/out

    # 清理临时文件
    rm -f \$PACKAGE

    echo \"   ✅ 内容更新完成\"
'"

if [ $? -ne 0 ]; then
    echo -e "${RED}✗${NC} 部署失败"
    exit 1
fi
echo ""

# 步骤 4: 重载 Nginx
echo -e "${CYAN}═══ 步骤 4/4: 重载 Nginx ═══${NC}"
ssh -o StrictHostKeyChecking=no -t $SSH_USER@$SERVER_IP "sudo bash -c '
    echo \"   检查 Nginx 容器...\"
    NGINX_ID=\$(docker ps -aqf name=$NGINX_CONTAINER)
    if [ ! -z \"\$NGINX_ID\" ]; then
        echo \"   🔄 重载 Nginx...\"
        docker exec \$NGINX_ID nginx -s reload
        echo \"   ✅ Nginx 已重载\"
    else
        echo \"   ⚠️  Nginx 容器未找到，跳过重载\"
    fi
'"
echo ""

echo -e "${GREEN}✅ 内容更新完成！${NC}"
echo -e "${YELLOW}提示:${NC} 此操作仅更新内容和页面，不影响其他配置文件"
