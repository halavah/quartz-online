# ========================================
# Quartz Online - 统一部署脚本 (PowerShell)
# ========================================

# 设置输出编码为 UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# 获取脚本所在目录
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BinDir = Join-Path $ScriptDir "bin"

# 检查 bin 目录是否存在
if (-not (Test-Path $BinDir)) {
    Write-Host "[错误] bin 目录不存在: $BinDir" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

# 主菜单函数
function Show-MainMenu {
    Clear-Host
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗"
    Write-Host "║  Quartz Online - 部署管理"
    Write-Host "╚════════════════════════════════════════════════════════════╝"
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════"
    Write-Host "  选择部署平台"
    Write-Host "═══════════════════════════════════════════════════════════"
    Write-Host ""
    Write-Host "  1. ▲ Vercel"
    Write-Host "     → 部署到 Vercel 边缘网络 (推荐)"
    Write-Host ""
    Write-Host "  2. 🌊 Netlify"
    Write-Host "     → 部署到 Netlify 平台"
    Write-Host ""
    Write-Host "  3. 🎨 Render"
    Write-Host "     → 部署到 Render (Git 自动部署)"
    Write-Host ""
    Write-Host "  4. ☁️  Cloudflare Pages"
    Write-Host "     → 部署到 Cloudflare Pages (使用 @cloudflare/next-on-pages)"
    Write-Host ""
    Write-Host "  5. 🏢 1Panel"
    Write-Host "     → 部署到腾讯云 1Panel 服务器"
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════"
    Write-Host ""
    Write-Host "  9. 🚪 退出"
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════"
    Write-Host ""
}

# 执行部署脚本函数
function Invoke-DeployScript {
    param(
        [string]$ScriptName,
        [string]$PlatformName
    )

    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗"
    Write-Host "║  开始部署到 $PlatformName"
    Write-Host "╚════════════════════════════════════════════════════════════╝"
    Write-Host ""

    $scriptPath = Join-Path $BinDir $ScriptName

    if (Test-Path $scriptPath) {
        Push-Location $BinDir
        & $scriptPath
        $exitCode = $LASTEXITCODE
        Pop-Location
        return $exitCode
    } else {
        Write-Host "[错误] 脚本不存在: $scriptPath" -ForegroundColor Red
        return 1
    }
}

# 主循环
$continue = $true
while ($continue) {
    Show-MainMenu

    $input = Read-Host "请选择部署平台 [1-5, 9] (默认: 9)"

    # 如果用户直接按回车，默认退出
    if ([string]::IsNullOrWhiteSpace($input)) {
        $input = "9"
    }

    switch ($input) {
        "1" {
            Invoke-DeployScript "deploy-vercel.ps1" "Vercel"
        }
        "2" {
            Invoke-DeployScript "deploy-netlify.ps1" "Netlify"
        }
        "3" {
            Invoke-DeployScript "deploy-render.ps1" "Render"
        }
        "4" {
            Invoke-DeployScript "deploy-flare.ps1" "Cloudflare Pages"
        }
        "5" {
            Invoke-DeployScript "deploy-1panel.ps1" "1Panel"
        }
        "9" {
            Write-Host ""
            Write-Host "[信息] 感谢使用 Quartz Online 部署工具" -ForegroundColor Cyan
            Write-Host ""
            $continue = $false
        }
        default {
            Write-Host ""
            Write-Host "[错误] 无效的选项: $input" -ForegroundColor Red
            Start-Sleep -Seconds 2
        }
    }

    # 操作完成后，等待用户按键（退出除外）
    if ($continue) {
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════════"
        Read-Host "按 Enter 键返回主菜单"
    }
}

exit 0
