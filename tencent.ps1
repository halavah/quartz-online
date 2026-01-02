# ========================================
# 腾讯云部署管理脚本 (PowerShell)
# ========================================

# 打印函数
function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Blue
}

function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  $Message" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

# 获取脚本所在目录
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BinDir = Join-Path $ScriptDir "bin"

# 检查脚本是否存在
function Test-Script {
    param([string]$ScriptName)

    $ScriptPath = Join-Path $BinDir $ScriptName

    if (-not (Test-Path $ScriptPath)) {
        Write-ErrorMsg "脚本不存在: $ScriptPath"
        return $false
    }

    return $true
}

# 执行脚本
function Invoke-Script {
    param(
        [string]$ScriptName,
        [string[]]$Arguments = @()
    )

    if (Test-Script $ScriptName) {
        Write-Info "正在执行: $ScriptName $Arguments"
        Write-Host ""

        Push-Location $BinDir
        & ".\$ScriptName" @Arguments
        $result = $LASTEXITCODE
        Pop-Location

        return $result
    }
    else {
        return 1
    }
}

# 显示主菜单
function Show-Menu {
    Clear-Host
    Write-Header "腾讯云部署管理控制台 - Quartz Online"

    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Magenta
    Write-Host "  部署管理" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Magenta
    Write-Host ""

    Write-Host "  1." -ForegroundColor Green -NoNewline
    Write-Host " 🚀 " -NoNewline
    Write-Host "完整部署到腾讯云" -ForegroundColor Blue -NoNewline
    Write-Host "     (tencent-deploy.ps1)"
    Write-Host "     " -NoNewline
    Write-Host "→" -ForegroundColor Magenta -NoNewline
    Write-Host " 构建并部署完整站点到腾讯云服务器"
    Write-Host ""

    Write-Host "  2." -ForegroundColor Green -NoNewline
    Write-Host " 🔄 " -NoNewline
    Write-Host "重启服务" -ForegroundColor Blue -NoNewline
    Write-Host "             (tencent-restart.ps1)"
    Write-Host "     " -NoNewline
    Write-Host "→" -ForegroundColor Magenta -NoNewline
    Write-Host " 重载 Nginx 服务"
    Write-Host ""

    Write-Host "  3." -ForegroundColor Green -NoNewline
    Write-Host " 📝 " -NoNewline
    Write-Host "快速更新���容" -ForegroundColor Blue -NoNewline
    Write-Host "         (tencent-update-content.ps1)"
    Write-Host "     " -NoNewline
    Write-Host "→" -ForegroundColor Magenta -NoNewline
    Write-Host " ��更新内容文件（快速部署）"
    Write-Host ""

    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Magenta
    Write-Host ""

    Write-Host "  9." -ForegroundColor Green -NoNewline
    Write-Host " 🚪 " -NoNewline
    Write-Host "退出" -ForegroundColor Blue
    Write-Host ""

    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Magenta
    Write-Host ""
}

# 主循环
function Start-Main {
    while ($true) {
        Show-Menu

        $choice = Read-Host "请选择操作 [1-3, 9] (默认: 1)"

        # 如果用户直接按回车，默认选择 1
        if ([string]::IsNullOrWhiteSpace($choice)) {
            $choice = "1"
        }

        switch ($choice) {
            "1" {
                Write-Header "执行: 完整部署到腾讯云"
                Invoke-Script "tencent-deploy.ps1"
            }

            "2" {
                Write-Header "执行: 重启服务"
                Invoke-Script "tencent-restart.ps1"
            }

            "3" {
                Write-Header "执行: 快速更新内容"
                Invoke-Script "tencent-update-content.ps1"
            }

            "9" {
                Write-Info "感谢使用腾讯云部署管理控制台"
                Write-Host ""
                exit 0
            }

            default {
                Write-ErrorMsg "无效的选项: $choice"
            }
        }

        # 操作完成后，等待用户按键
        if ($choice -ne "9") {
            Write-Host ""
            Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Magenta
            Write-Host "按 Enter 键返回主菜单..." -ForegroundColor Yellow -NoNewline
            Read-Host
        }
    }
}

# 检查 bin 目录是否存在
if (-not (Test-Path $BinDir)) {
    Write-ErrorMsg "bin 目录不存在: $BinDir"
    exit 1
}

# 启动主循环
Start-Main
