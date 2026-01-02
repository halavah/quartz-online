#!/bin/bash

# ================================================
# 腾讯云配置 - 请根据实际情况修改
# ================================================
# TODO: 请填入你的腾讯云服务器信息
SERVER_IP="your-tencent-cloud-ip"
SSH_USER="ubuntu"

# Nginx 容器名称（如果使用 1Panel 的 OpenResty）
NGINX_CONTAINER="1Panel-openresty-xxxx"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}  🔄 重启 Nginx 服务"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}ℹ${NC} 正在执行: 重载 Nginx 配置..."
echo ""

ssh -o StrictHostKeyChecking=no -t $SSH_USER@$SERVER_IP "sudo bash -c '
    echo \"   检查 Nginx 容器 ($NGINX_CONTAINER)...\"
    NGINX_ID=\$(docker ps -aqf name=$NGINX_CONTAINER)
    if [ ! -z \"\$NGINX_ID\" ]; then
         echo \"   🔄 重载 Nginx...\"
         docker exec \$NGINX_ID nginx -s reload
         echo \"   ✅ Nginx 已重载\"
    else
         echo \"   ⚠️  Nginx 容器未找到\"
         echo \"   提示: 请检查容器名称是否正确\"
    fi
'"

echo ""
echo -e "${GREEN}✅ 操作完成${NC}"
