
# ================================================
# 腾讯云配置 - 请根据实际情况修改
# ================================================
# TODO: 请填入你的腾讯云服务器信息
$SERVER_IP = "your-tencent-cloud-ip"
$SSH_USER = "ubuntu"
$REMOTE_DEPLOY_BASE = "/opt/1panel/www/sites"
$REMOTE_TARGET = "$REMOTE_DEPLOY_BASE/quartz-online"

# Nginx 容器名称（如果使用 1Panel 的 OpenResty）
$NGINX_CONTAINER = "1Panel-openresty-xxxx"

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  📝 快速更新内容到腾讯云" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 获取项目根目录
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

Write-Host "ℹ 项目根目录: $ProjectRoot" -ForegroundColor Blue
Write-Host "提示: 快速更新模式，仅更新 app 和 out 目录" -ForegroundColor Yellow
Write-Host ""

# 步骤 1: 本地构建
Write-Host "═══ 步骤 1/4: 本地构建 ═══" -ForegroundColor Cyan
Set-Location $ProjectRoot
Write-Host "ℹ 正在执行: npm run build" -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 构建失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 构建完成" -ForegroundColor Green
Write-Host ""

# 步骤 2: 打包内容文件
Write-Host "═══ 步骤 2/4: 打包内容文件 ═══" -ForegroundColor Cyan
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$PackageName = "quartz-online-content-$Timestamp.tar.gz"
$TempPath = Join-Path $env:TEMP $PackageName

Write-Host "ℹ 正在打包 app 和 out 目录..." -ForegroundColor Blue

# 使用 tar 打包 app 和 out 目录
tar -czf $TempPath -C $ProjectRoot app out

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 打包失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 打包完成: $PackageName" -ForegroundColor Green
Write-Host ""

# 步骤 3: 上传并部署
Write-Host "═══ 步骤 3/4: 上传并部署 ═══" -ForegroundColor Cyan
Write-Host "ℹ 正在上传到: $SSH_USER@$SERVER_IP" -ForegroundColor Blue
scp -o StrictHostKeyChecking=no $TempPath "${SSH_USER}@${SERVER_IP}:/tmp/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 上传失败" -ForegroundColor Red
    Remove-Item $TempPath -ErrorAction SilentlyContinue
    exit 1
}
Write-Host "✓ 上传完成" -ForegroundColor Green

# 清理本地临时文件
Remove-Item $TempPath -ErrorAction SilentlyContinue

# 远程解压
$RemoteScript = @"
sudo bash -c '
    TARGET="$REMOTE_TARGET"
    PACKAGE="/tmp/$PackageName"

    echo "   目标路径: \$TARGET"

    # 解压更新文件
    echo "   📦 更新内容文件..."
    su - $SSH_USER -c "cd \$TARGET && tar -xzf \$PACKAGE"

    # 设置权限
    chown -R $SSH_USER:$SSH_USER \$TARGET/app
    chown -R $SSH_USER:$SSH_USER \$TARGET/out
    chmod -R 755 \$TARGET/out

    # 清理临时文件
    rm -f \$PACKAGE

    echo "   ✅ 内容更新完成"
'
"@

ssh -o StrictHostKeyChecking=no -t "$SSH_USER@$SERVER_IP" $RemoteScript

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 部署失败" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 步骤 4: 重载 Nginx
Write-Host "═══ 步骤 4/4: 重载 Nginx ═══" -ForegroundColor Cyan

$NginxScript = @"
sudo bash -c '
    echo "   检查 Nginx 容器..."
    NGINX_ID=\$(docker ps -aqf name=$NGINX_CONTAINER)
    if [ ! -z "\$NGINX_ID" ]; then
        echo "   🔄 重载 Nginx..."
        docker exec \$NGINX_ID nginx -s reload
        echo "   ✅ Nginx 已重载"
    else
        echo "   ⚠️  Nginx 容器未找到，跳过重载"
    fi
'
"@

ssh -o StrictHostKeyChecking=no -t "$SSH_USER@$SERVER_IP" $NginxScript
Write-Host ""

Write-Host "✅ 内容更新完成！" -ForegroundColor Green
Write-Host "提示: 此操作仅更新内容和页面，不影响其他配置文件" -ForegroundColor Yellow
