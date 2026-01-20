# Vercel 部署脚本 (PowerShell)
# 用于将 Quartz Online (Next.js) 部署到 Vercel

$ErrorActionPreference = "Stop"

Write-Host "==================================" -ForegroundColor Blue
Write-Host "🚀 Vercel 部署脚本" -ForegroundColor Blue
Write-Host "==================================" -ForegroundColor Blue
Write-Host ""

# 获取项目根目录
$ScriptDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $ScriptDir

if (-not (Test-Path "package.json")) {
    Write-Host "❌ 错误: 请在项目根目录运行此脚本" -ForegroundColor Red
    exit 1
}

if (Test-Path ".env.vercel") {
    Write-Host "✓ 加载 .env.vercel 配置" -ForegroundColor Green
    Get-Content ".env.vercel" | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)\s*=\s*(.+)\s*$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
} else {
    Write-Host "❌ 错误: .env.vercel 文件不存在" -ForegroundColor Red
    exit 1
}

try {
    $vercelVersion = vercel --version
    Write-Host "✓ Vercel CLI: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Vercel CLI 未安装，正在安装..." -ForegroundColor Yellow
    npm install -g vercel
}
Write-Host ""

Write-Host "📦 开始构建项目..." -ForegroundColor Blue
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 构建完成" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 开始部署到 Vercel..." -ForegroundColor Blue
Write-Host ""

if ($env:VERCEL_TOKEN) {
    vercel --prod --yes --token="$env:VERCEL_TOKEN"
} else {
    vercel --prod --yes
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Green
    Write-Host "✅ 部署成功！" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 后续步骤：" -ForegroundColor Blue
    Write-Host "1. 访问 https://vercel.com/dashboard 查看部署详情"
    Write-Host "2. 配置自定义域名（可选）"
    Write-Host "3. 检查环境变量设置"
    Write-Host ""
} else {
    Write-Host "❌ 部署失败" -ForegroundColor Red
    exit 1
}
