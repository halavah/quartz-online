@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM Halavah's Tech - 管理脚本 (Windows)
REM ========================================

cd /d %~dp0
set BIN_DIR=%~dp0bin

REM 检查 bin 目录是否存在
if not exist "%BIN_DIR%" (
    echo [错误] bin 目录不存在: %BIN_DIR%
    pause
    exit /b 1
)

:MAIN_MENU
REM 重置 choice 变量，避免保留上次的输入
set "choice="

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Halavah's Tech - 管理控制台
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ═══════════════════════════════════════════════════════════
echo   项目管理
echo ═══════════════════════════════════════════════════════════
echo.
echo   1. 🚢 部署到 Git        (deploy.bat)
echo      → 自动提交并推送代码到远程仓库
echo.
echo   2. 🚀 启动开发服务器     (start.bat)
echo      → 启动 Next.js 开发环境
echo.
echo   3. 🧹 清理 Git 跟踪     (ignore.bat)
echo      → 根据 .gitignore 移除已跟踪的文件
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo   0. 🚪 退出
echo.
echo ═══════════════════════════════════════════════════════════
echo.

set /p choice="请选择操作 [0-3] (默认: 1): "

REM 如果用户直接按回车，默认选择 1
if "%choice%"=="" set choice=1

if "%choice%"=="1" goto DEPLOY
if "%choice%"=="2" goto START
if "%choice%"=="3" goto IGNORE
if "%choice%"=="0" goto EXIT
goto INVALID

:DEPLOY
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  执行: 部署到 Git
echo ╚════════════════════════════════════════════════════════════╝
echo.
call "%BIN_DIR%\deploy.bat"
goto WAIT

:START
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  执行: 启动开发服务器
echo ╚════════════════════════════════════════════════════════════╝
echo.
call "%BIN_DIR%\start.bat"
goto WAIT

:IGNORE
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  执行: 清理 Git 跟踪
echo ╚════════════════════════════════════════════════════════════╝
echo.
call "%BIN_DIR%\ignore.bat"
goto WAIT

:INVALID
echo.
echo [错误] 无效的选项: %choice%
timeout /t 2 /nobreak >nul
goto MAIN_MENU

:WAIT
echo.
echo ═══════════════════════════════════════════════════════════
pause
goto MAIN_MENU

:EXIT
echo.
echo [信息] 感谢使用 Halavah's Tech 管理控制台
echo.
exit /b 0
