@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo ========================================
echo   自动更新 articles.json 脚本
echo ========================================
echo.

:: 设置路径 (脚本在 bin 目录下)
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%.."
set "PROJECT_ROOT=%CD%"
set "PUBLIC_DIR=%PROJECT_ROOT%\public"
set "ARTICLES_JSON=%PROJECT_ROOT%\data\articles.json"
cd /d "%SCRIPT_DIR%"

:: 检查目录是否存在
if not exist "%PUBLIC_DIR%" (
    echo 错误: 目录不存在 %PUBLIC_DIR%
    pause
    exit /b 1
)

:: 创建临时文件
set "TEMP_ARTICLES=%TEMP%\articles_temp.json"
if exist "%TEMP_ARTICLES%" del "%TEMP_ARTICLES%"

echo 正在扫描 HTML 文件...
echo.

:: 处理每个章节
for /L %%c in (1,1,4) do (
    if exist "%PUBLIC_DIR%\chapter0%%c" (
        for %%f in ("%PUBLIC_DIR%\chapter0%%c\*.html") do (
            call :extract_metadata "%%f" "chapter0%%c"
        )
    )
)

:: 生成新的 articles.json
(
    echo {
    echo   "config": {
    echo     "siteName": "Halavah's Tech",
    echo     "siteDescription": "探索前沿技术,提升开发效率",
    echo     "githubUrl": "https://github.com/halavah",
    echo     "beianNumber": "京ICP备12345678号",
    echo     "copyrightText": "© 2025 Halavah's Tech. All rights reserved.",
    echo     "adLink": "https://api.nekoapi.com"
    echo   },
    echo   "articles": [
) > "%ARTICLES_JSON%"

:: 添加文章数据
powershell -Command "(Get-Content '%TEMP_ARTICLES%') -replace ',$(?=[^,]*$)', '' | Out-File -Encoding UTF8 '%TEMP_ARTICLES%.tmp'"
type "%TEMP_ARTICLES%.tmp" >> "%ARTICLES_JSON%"
del "%TEMP_ARTICLES%.tmp"

:: 结束 JSON
(
    echo   ]
    echo }
) >> "%ARTICLES_JSON%"

:: 清理临时文件
del "%TEMP_ARTICLES%" 2>nul

echo.
echo ========================================
echo ✓ articles.json 更新完成!
echo ========================================
echo.
echo 文件路径: %ARTICLES_JSON%
echo.
pause
exit /b 0

:extract_metadata
setlocal
set "HTML_FILE=%~1"
set "CHAPTER=%~2"

:: 提取文件名
set "FILENAME=%~nx1"
set "RELATIVE_PATH=%CHAPTER%/%FILENAME%"

:: 提取 title (使用 PowerShell)
for /f "usebackq delims=" %%a in (`powershell -Command "(Get-Content '%HTML_FILE%' -Encoding UTF8 | Select-String -Pattern '<title>').ToString() -replace '<[^>]*>', '' | ForEach-Object { $_.Trim() }"`) do set "TITLE=%%a"

:: 提取 description (使用 PowerShell,支持两种格式)
for /f "usebackq delims=" %%a in (`powershell -Command "$content = Get-Content '%HTML_FILE%' -Encoding UTF8 -Raw; if ($content -match 'name=[\"'']?description[\"'']?[^>]*content=[\"'']([^\"'']*)[\"'']') { $matches[1] }"`) do set "DESC=%%a"

:: 确定分类
if "%CHAPTER%"=="chapter01" set "CATEGORY=安装指南"
if "%CHAPTER%"=="chapter02" set "CATEGORY=使用技巧"
if "%CHAPTER%"=="chapter03" set "CATEGORY=插件工具"
if "%CHAPTER%"=="chapter04" set "CATEGORY=开发工具"

:: 输出到临时文件
(
    echo     {
    echo       "title": "!TITLE!",
    echo       "description": "!DESC!",
    echo       "htmlFile": "!RELATIVE_PATH!",
    echo       "category": "!CATEGORY!"
    echo     },
) >> "%TEMP_ARTICLES%"

echo ✓ !RELATIVE_PATH!
echo   标题: !TITLE!
echo   分类: !CATEGORY!
echo.

endlocal
exit /b 0
