# ========================================
# Halavah's Tech - 开发服务器启动脚本 (PowerShell)
# ========================================

# 设置输出编码为 UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# 切换到脚本所在目录
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 返回项目根目录
Set-Location (Split-Path -Parent $ScriptDir)

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "🚀 Halavah's Tech 开发环境启动中..." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js 是否安装
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host "❌ 错误: Node.js 未安装" -ForegroundColor Red
    Write-Host "请访问 https://nodejs.org 下载并安装 Node.js" -ForegroundColor Yellow
    Read-Host "按 Enter 键退出"
    exit 1
}

# 显示 Node.js 版本
$nodeVersion = node --version
Write-Host "📦 Node.js 版本: $nodeVersion" -ForegroundColor Blue

# 检查 npm 是否安装
$npmCmd = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmCmd) {
    Write-Host "❌ 错误: npm 未安装" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

# 显示 npm 版本
$npmVersion = npm --version
Write-Host "📦 npm 版本: $npmVersion" -ForegroundColor Blue
Write-Host ""

# 检查是否已安装依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 正在安装项目依赖..." -ForegroundColor Yellow
    Write-Host ""

    npm install

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ 依赖安装失败，请检查网络连接" -ForegroundColor Red
        Read-Host "按 Enter 键退出"
        exit 1
    }

    Write-Host ""
    Write-Host "✅ 依赖安装完成" -ForegroundColor Green
    Write-Host ""
}

# 获取本机IP地址（Windows）
$localIP = $null
try {
    $networkAdapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" }
    if ($networkAdapters) {
        $localIP = ($networkAdapters | Select-Object -First 1).IPAddress
    }
} catch {
    # 如果获取失败，忽略错误
}

# 启动开发服务器
Write-Host "🌐 启动开发服务器..." -ForegroundColor Green
Write-Host ""
Write-Host "📍 本地访问地址: http://localhost:3000" -ForegroundColor Cyan
if ($localIP) {
    Write-Host "📍 网络访问地址: http://${localIP}:3000" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "⚠️  按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

npm run dev

# 如果出错，暂停以查看错误信息
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ 服务器启动失败" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}
