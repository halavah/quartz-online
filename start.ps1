# ========================================
# Halavah's Tech - 管理脚本 (PowerShell)
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
    Write-Host "║  Halavah's Tech - 管理控制台"
    Write-Host "╚════════════════════════════════════════════════════════════╝"
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════"
    Write-Host "  项目管理"
    Write-Host "═══════════════════════════════════════════════════════════"
    Write-Host ""
    Write-Host "  1. 🚀 启动开发服务器     (start-server.ps1)"
    Write-Host "     → 启动 Next.js 开发环境"
    Write-Host ""
    Write-Host "  2. 📝 更新文章列表      (update-articles.ps1)"
    Write-Host "     → 自动扫描 HTML 文件并更新 articles.json"
    Write-Host ""
    Write-Host "  3. ☁️  部署到 Cloudflare (deploy-cf.ps1)"
    Write-Host "     → 构建并部署到 Cloudflare Pages"
    Write-Host ""
    Write-Host "  4. 🚀 部署到腾讯云     (tencent.ps1)"
    Write-Host "     → 部署到腾讯云服务器"
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════"
    Write-Host ""
    Write-Host "  9. 🚪 退出"
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════"
    Write-Host ""
}

# 执行脚本函数
function Invoke-Script {
    param(
        [string]$ScriptName,
        [string]$DisplayName
    )

    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗"
    Write-Host "║  执行: $DisplayName"
    Write-Host "╚════════════════════════════════════════════════════════════╝"
    Write-Host ""

    $scriptPath = Join-Path $BinDir $ScriptName

    if (Test-Path $scriptPath) {
        & $scriptPath
        return $LASTEXITCODE
    } else {
        Write-Host "[错误] 脚本不存在: $scriptPath" -ForegroundColor Red
        return 1
    }
}

# 主循环
$continue = $true
while ($continue) {
    Show-MainMenu

    $input = Read-Host "请选择操作 [1-4, 9] (默认: 1)"

    # 如果用户直接按回车，默认选择 1
    if ([string]::IsNullOrWhiteSpace($input)) {
        $input = "1"
    }

    switch ($input) {
        "1" {
            Invoke-Script "start-server.ps1" "启动开发服务器"
        }
        "2" {
            Invoke-Script "update-articles.ps1" "更新文章列表"
        }
        "3" {
            Invoke-Script "deploy-cf.ps1" "部署到 Cloudflare"
        }
        "4" {
            Write-Host ""
            Write-Host "╔════════════════════════════════════════════════════════════╗"
            Write-Host "║  执行: 部署到腾讯云"
            Write-Host "╚════════════════════════════════════════════════════════════╝"
            Write-Host ""
            # 直接执行 tencent.ps1（在项目根目录）
            $tencentScript = Join-Path $ScriptDir "tencent.ps1"
            if (Test-Path $tencentScript) {
                & $tencentScript
            } else {
                Write-Host "[错误] 脚本不存在: $tencentScript" -ForegroundColor Red
            }
        }
        "9" {
            Write-Host ""
            Write-Host "[信息] 感谢使用 Halavah's Tech 管理控制台" -ForegroundColor Cyan
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
