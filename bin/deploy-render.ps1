# Render 部署脚本 (PowerShell)
# 用于将 Quartz Online (Next.js) 部署到 Render

$ErrorActionPreference = "Stop"

Write-Host "==================================" -ForegroundColor Blue
Write-Host "🚀 Render 部署脚本" -ForegroundColor Blue
Write-Host "==================================" -ForegroundColor Blue
Write-Host ""

# 获取项目根目录
$ScriptDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $ScriptDir

if (-not (Test-Path "package.json")) {
    Write-Host "❌ 错误: 请在项目根目录运行此脚本" -ForegroundColor Red
    exit 1
}

if (Test-Path ".env.render") {
    Write-Host "✓ 加载 .env.render 配置" -ForegroundColor Green
    Get-Content ".env.render" | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)\s*=\s*(.+)\s*$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
} else {
    Write-Host "❌ 错误: .env.render 文件不存在" -ForegroundColor Red
    exit 1
}

Write-Host "📦 开始构建项目（本地测试）..." -ForegroundColor Blue
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 构建完成" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 准备部署到 Render..." -ForegroundColor Blue
Write-Host ""

# Render 通过 Git 自动部署
Write-Host "Render 使用 Git 自动部署" -ForegroundColor Yellow
Write-Host ""
Write-Host "部署步骤：" -ForegroundColor Blue
Write-Host "1. 确保代码已提交到 Git 仓库"
Write-Host "2. 将代码推送到远程仓库 (GitHub/GitLab/Bitbucket)"
Write-Host "3. Render 将自动检测并部署更新"
Write-Host ""

# 如果设置了 Deploy Hook，可以触发部署
if ($env:RENDER_DEPLOY_HOOK_URL) {
    Write-Host "触发 Render 部署..." -ForegroundColor Blue

    try {
        Invoke-WebRequest -Uri $env:RENDER_DEPLOY_HOOK_URL -Method POST | Out-Null

        Write-Host ""
        Write-Host "==================================" -ForegroundColor Green
        Write-Host "✅ 部署触发成功！" -ForegroundColor Green
        Write-Host "==================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 后续步骤：" -ForegroundColor Blue
        Write-Host "1. 访问 https://dashboard.render.com 查看部署进度"
        Write-Host "2. 检查构建日志"
        Write-Host "3. 配置环境变量（如需要）"
        Write-Host ""
    } catch {
        Write-Host "❌ 部署触发失败" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "💡 提示：" -ForegroundColor Yellow
    Write-Host "- 在 Render Dashboard 创建 Deploy Hook"
    Write-Host "- 将 Deploy Hook URL 添加到 .env.render 的 RENDER_DEPLOY_HOOK_URL"
    Write-Host "- 或者直接推送代码到 Git 仓库触发自动部署"
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Green
    Write-Host "✅ 本地构建验证成功！" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
}
