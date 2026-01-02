
# ================================================
# 腾讯云配置 - 请根据实际情况修改
# ================================================
# TODO: 请填入你的腾讯云服务器信息
$SERVER_IP = "your-tencent-cloud-ip"
$SSH_USER = "ubuntu"

# Nginx 容器名称（如果使用 1Panel 的 OpenResty）
$NGINX_CONTAINER = "1Panel-openresty-xxxx"

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔄 重启 Nginx 服务" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "ℹ 正在执行: 重载 Nginx 配置..." -ForegroundColor Blue
Write-Host ""

$RemoteScript = @"
sudo bash -c '
    echo "   检查 Nginx 容器 ($NGINX_CONTAINER)..."
    NGINX_ID=\$(docker ps -aqf name=$NGINX_CONTAINER)
    if [ ! -z "\$NGINX_ID" ]; then
         echo "   🔄 重载 Nginx..."
         docker exec \$NGINX_ID nginx -s reload
         echo "   ✅ Nginx 已重载"
    else
         echo "   ⚠️  Nginx 容器未找到"
         echo "   提示: 请检查容器名称是否正确"
    fi
'
"@

ssh -o StrictHostKeyChecking=no -t "$SSH_USER@$SERVER_IP" $RemoteScript

Write-Host ""
Write-Host "✅ 操作完成" -ForegroundColor Green
