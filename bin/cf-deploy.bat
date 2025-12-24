@echo off
setlocal EnableDelayedExpansion

REM ========================================
REM Quartz Online - Cloudflare Pages 部署脚本
REM 使用 Next.js 静态导出部署到 Cloudflare Pages
REM ========================================

REM Navigate to the directory where the script is located
cd /d "%~dp0"

REM Go back to project root directory
cd ..

REM 项目名称
set "PROJECT_NAME=quartz-online"

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Cloudflare Pages 部署 - %PROJECT_NAME% (Next.js 静态导出)
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM 检查是否安装了 wrangler
echo [信息] 检查 wrangler 是否已安装...
where npx >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] npx 未找到，请确保 Node.js 已正确安装
    pause
    exit /b 1
)
echo [成功] wrangler 可用
echo.

REM 设置 Cloudflare 认证环境变量
REM 必须从 .env 文件加载
if exist ".env" (
    echo [信息] 从 .env 文件加载认证信息...
    for /f "tokens=1,2 delims==" %%a in (.env) do (
        set "%%a=%%b"
    )
) else (
    echo [错误] .env 文件不存在！
    echo.
    echo 请先创建 .env 文件并配置 Cloudflare 认证信息：
    echo.
    echo   copy .env.example .env
    echo   notepad .env
    echo.
    echo 然后在 .env 文件中设置：
    echo   CLOUDFLARE_API_KEY=your_api_key_here
    echo   CLOUDFLARE_EMAIL=your_email@example.com
    echo.
    pause
    exit /b 1
)

REM 检查必需的环境变量
if "%CLOUDFLARE_API_KEY%"=="" (
    echo [错误] .env 文件中缺少 CLOUDFLARE_API_KEY 配置！
    echo.
    echo 请确保 .env 文件包含以下配置：
    echo   CLOUDFLARE_API_KEY=your_api_key_here
    echo   CLOUDFLARE_EMAIL=your_email@example.com
    echo.
    pause
    exit /b 1
)

if "%CLOUDFLARE_EMAIL%"=="" (
    echo [错误] .env 文件中缺少 CLOUDFLARE_EMAIL 配置！
    echo.
    echo 请确保 .env 文件包含以下配置：
    echo   CLOUDFLARE_API_KEY=your_api_key_here
    echo   CLOUDFLARE_EMAIL=your_email@example.com
    echo.
    pause
    exit /b 1
)

REM 构建 Next.js 项目（静态导出）
echo [信息] 开始构建 Next.js 项目...
echo [信息] 运行: npm run build
echo.

call npm run build
if %errorlevel% neq 0 (
    echo [错误] 构建失败
    pause
    exit /b 1
)

echo.
echo [成功] 构建成功
echo.
echo [信息] 准备部署到 Cloudflare Pages...
echo [信息] 项目名称: %PROJECT_NAME%
echo [信息] 部署目录: out\
echo.

REM 确认部署
set /p confirm="确认部署? [y/N]: "
if /i not "%confirm%"=="y" (
    echo [警告] 部署已取消
    pause
    exit /b 0
)

REM 执行部署
echo [信息] 正在上传并部署...
echo.

npx wrangler pages deploy out --project-name=%PROJECT_NAME%

REM 检查部署结果
if %errorlevel% equ 0 (
    echo.
    echo ╔════════════════════════════════════════════════════════════╗
    echo ║  部署成功!
    echo ╚════════════════════════════════════════════════════════════╝
    echo [成功] 项目已部署到 Cloudflare Pages
    echo [信息] 访问地址: https://%PROJECT_NAME%.pages.dev
    echo.
) else (
    echo.
    echo [错误] 部署失败，请检查错误信息
    pause
    exit /b 1
)

pause
exit /b 0
