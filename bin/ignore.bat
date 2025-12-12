@echo off
setlocal enabledelayedexpansion

:: 切换到脚本所在目录
cd /d "%~dp0"

:: 返回项目根目录
cd ..

:: ignore.bat - 根据 .gitignore 内容移除已被 Git 跟踪的文件
:: 适用于 Windows 系统

echo ===========================================
echo 根据 .gitignore 内容清理 Git 跟踪文件
echo ===========================================

:: 检查是否在 Git 仓库中
git rev-parse --git-dir >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：当前目录不是 Git 仓库
    exit /b 1
)

:: 检查 .gitignore 文件是否存在
if not exist ".gitignore" (
    echo 错误：未找到 .gitignore 文件
    exit /b 1
)

:: 创建临时文件
set "temp_file=%temp%\git_ignore_files.txt"

:: 清空临时文件
type nul > "%temp_file%"

echo 第一步：查找被跟踪但应该被忽略的文件...
echo.

:: 方法1: 直接处理最常见的目录模式
echo 处理 out/ 目录...
for /f "usebackq tokens=*" %%f in (`git ls-files ^| findstr "^out/"`) do (
    echo %%f >> "%temp_file%"
)

echo 处理 .next/ 目录...
for /f "usebackq tokens=*" %%f in (`git ls-files ^| findstr "^\\.next/"`) do (
    echo %%f >> "%temp_file%"
)

echo 处理 node_modules/ 目录...
for /f "usebackq tokens=*" %%f in (`git ls-files ^| findstr "^node_modules/"`) do (
    echo %%f >> "%temp_file%"
)

echo 处理 build/ 目录...
for /f "usebackq tokens=*" %%f in (`git ls-files ^| findstr "^build/"`) do (
    echo %%f >> "%temp_file%"
)

echo 处理 dist/ 目录...
for /f "usebackq tokens=*" %%f in (`git ls-files ^| findstr "^dist/"`) do (
    echo %%f >> "%temp_file%"
)

:: 方法2: 处理其他常见模式
echo.
echo 处理 .gitignore 中的其他模式...

:: 处理日志文件
for /f "usebackq tokens=*" %%f in (`git ls-files ^| findstr "\.log$"`) do (
    echo %%f >> "%temp_file%"
)

:: 处理环境文件
for /f "usebackq tokens=*" %%f in (`git ls-files ^| findstr "^\\.env"`) do (
    echo %%f >> "%temp_file%"
)

:: 处理临时文件
for /f "usebackq tokens=*" %%f in (`git ls-files ^| findstr "\.tmp$"`) do (
    echo %%f >> "%temp_file%"
)

:: 处理 .DS_Store 文件
for /f "usebackq tokens=*" %%f in (`git ls-files ^| findstr "\\.DS_Store$"`) do (
    echo %%f >> "%temp_file%"
)

:: 处理 package-lock.json
for /f "usebackq tokens=*" %%f in (`git ls-files ^| findstr "package-lock\\.json$"`) do (
    echo %%f >> "%temp_file%"
)

:: 处理 yarn.lock
for /f "usebackq tokens=*" %%f in (`git ls-files ^| findstr "yarn\\.lock$"`) do (
    echo %%f >> "%temp_file%"
)

:: 处理 pnpm-lock.yaml
for /f "usebackq tokens=*" %%f in (`git ls-files ^| findstr "pnpm-lock\\.yaml$"`) do (
    echo %%f >> "%temp_file%"
)

:: 处理 coverage 目录
for /f "usebackq tokens=*" %%f in (`git ls-files ^| findstr "^coverage/"`) do (
    echo %%f >> "%temp_file%"
)

:: 处理 .cache 文件/目录
for /f "usebackq tokens=*" %%f in (`git ls-files ^| findstr "^\\.cache"`) do (
    echo %%f >> "%temp_file%"
)

:: 去重
set "temp_file_sorted=%temp%\git_ignore_files_sorted.txt"
if exist "%temp_file_sorted%" del "%temp_file_sorted%"

:: 使用 sort 命令去重（Windows 自带）
sort "%temp_file%" /O "%temp_file_sorted%"
move /Y "%temp_file_sorted%" "%temp_file%" >nul

echo.
echo 第二步：检查要移除的文件...
echo.

:: 检查是否有文件需要移除
for %%F in ("%temp_file%") do (
    if %%~zF gtr 0 (
        set "has_files=1"
    ) else (
        set "has_files=0"
    )
)

if "%has_files%"=="1" (
    :: 计算文件数量
    set /p count=<"%temp_file%"
    for /f %%i in ('type "%temp_file%" ^| find /c /v ""') do set "file_count=%%i"

    echo 找到 %file_count% 个文件将被从 Git 跟踪中移除（但不会删除本地文件）：
    echo ---------------------------------------------------
    type "%temp_file%"
    echo ---------------------------------------------------
    echo.

    :: 询问用户确认
    set /p "confirm=确定要移除这些文件的 Git 跟踪吗？(y/N): "
    if /i "%confirm%"=="y" (
        echo.
        echo 第三步：移除 Git 跟踪...

        :: 移除文件跟踪
        for /f "usebackq tokens=*" %%f in ("%temp_file%") do (
            if not "%%f"=="" (
                echo 移除跟踪: %%f
                git rm --cached "%%f" 2>nul || echo 警告：无法移除 %%f
            )
        )

        echo.
        echo 操作完成！已从 Git 跟踪中移除匹配 .gitignore 的文件。
        echo.
        echo 提示：
        echo - 文件仍保留在本地文件系统中
        echo - 运行 'git status' 查看当前状态
        echo - 提交更改：'git add .gitignore ^&^& git commit -m "Add .gitignore and remove ignored files"'
    ) else (
        echo 操作已取消。
    )
) else (
    echo 没有找到需要移除的被跟踪文件。
)

:: 清理临时文件
if exist "%temp_file%" del "%temp_file%"
if exist "%temp_file_sorted%" del "%temp_file_sorted%"

echo.
echo 脚本执行完成。
endlocal