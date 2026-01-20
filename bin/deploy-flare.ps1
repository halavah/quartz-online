# ========================================
# Quartz Online - Cloudflare Pages 部署脚本 (PowerShell)
# 使用 Next.js 静态导出部署到 Cloudflare Pages
# ========================================

# 设置输出编码为 UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Navigate to the directory where the script is located
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Go back to project root directory
Set-Location (Split-Path -Parent $ScriptDir)

# 项目名称
$PROJECT_NAME = "quartz-online"

Clear-Host
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Cloudflare Pages 部署 - $PROJECT_NAME (Next.js 静态导出)"
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 检查是否安装了 wrangler
Write-Host "[信息] 检查 wrangler 是否已安装..." -ForegroundColor Cyan
$npxCmd = Get-Command npx -ErrorAction SilentlyContinue
if (-not $npxCmd) {
    Write-Host "[错误] npx 未找到，请确保 Node.js 已正确安装" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}
Write-Host "[成功] wrangler 可用" -ForegroundColor Green
Write-Host ""

# 设置 Cloudflare 认证环境变量
# 必须从 .env 文件加载
if (Test-Path ".env") {
    Write-Host "[信息] 从 .env 文件加载认证信息..." -ForegroundColor Cyan
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
        }
    }
} else {
    Write-Host "[错误] .env 文件不存在！" -ForegroundColor Red
    Write-Host ""
    Write-Host "请先创建 .env 文件并配置 Cloudflare 认证信息："
    Write-Host ""
    Write-Host "  copy .env.example .env"
    Write-Host "  notepad .env"
    Write-Host ""
    Write-Host "然后在 .env 文件中设置："
    Write-Host "  CLOUDFLARE_API_KEY=your_api_key_here"
    Write-Host "  CLOUDFLARE_EMAIL=your_email@example.com"
    Write-Host ""
    Read-Host "按 Enter 键退出"
    exit 1
}

# 检查必需的环境变量
if (-not $env:CLOUDFLARE_API_KEY) {
    Write-Host "[错误] .env 文件中缺少 CLOUDFLARE_API_KEY 配置！" -ForegroundColor Red
    Write-Host ""
    Write-Host "请确保 .env 文件包含以下配置："
    Write-Host "  CLOUDFLARE_API_KEY=your_api_key_here"
    Write-Host "  CLOUDFLARE_EMAIL=your_email@example.com"
    Write-Host ""
    Read-Host "按 Enter 键退出"
    exit 1
}

if (-not $env:CLOUDFLARE_EMAIL) {
    Write-Host "[错误] .env 文件中缺少 CLOUDFLARE_EMAIL 配置！" -ForegroundColor Red
    Write-Host ""
    Write-Host "请确保 .env 文件包含以下配置："
    Write-Host "  CLOUDFLARE_API_KEY=your_api_key_here"
    Write-Host "  CLOUDFLARE_EMAIL=your_email@example.com"
    Write-Host ""
    Read-Host "按 Enter 键退出"
    exit 1
}

# 构建 Next.js 项目（静态导出）
Write-Host "[信息] 开始构建 Next.js 项目..." -ForegroundColor Cyan
Write-Host "[信息] 运行: npm run build" -ForegroundColor Cyan
Write-Host ""

npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] 构建失败" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

Write-Host ""
Write-Host "[成功] 构建成功" -ForegroundColor Green
Write-Host ""
Write-Host "[信息] 准备部署到 Cloudflare Pages..." -ForegroundColor Cyan
Write-Host "[信息] 项目名称: $PROJECT_NAME" -ForegroundColor Cyan
Write-Host "[信息] 部署目录: out\" -ForegroundColor Cyan
Write-Host ""

# 确认部署
$confirm = Read-Host "确认部署? [y/N]"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "[警告] 部署已取消" -ForegroundColor Yellow
    Read-Host "按 Enter 键退出"
    exit 0
}

# 执行部署
Write-Host "[信息] 正在上传并部署..." -ForegroundColor Cyan
Write-Host ""

npx wrangler pages deploy out --project-name=$PROJECT_NAME

# 检查部署结果
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  部署成功!"
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host "[成功] 项目已部署到 Cloudflare Pages" -ForegroundColor Green
    Write-Host "[信息] 访问地址: https://${PROJECT_NAME}.pages.dev" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "[错误] 部署失败，请检查错误信息" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

Read-Host "按 Enter 键退出"
exit 0
