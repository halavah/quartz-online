@echo off
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
set "temp_dirs=%temp%\git_ignore_dirs.txt"

echo 第一步：分析 .gitignore 文件...
echo.

:: 清空临时文件
type nul > "%temp_file%"

:: 处理 .gitignore 中的每一行
for /f "usebackq tokens=* delims=" %%a in (".gitignore") do (
    set "line=%%a"
    call :process_line "%%a"
)

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
    echo 以下文件将被从 Git 跟踪中移除（但不会删除本地文件）：
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
        for /f "usebackq tokens=* delims=" %%f in ("%temp_file%") do (
            if not "%%f"=="" (
                echo 移除跟踪: %%f
                git rm --cached -r "%%f" 2>nul || echo 警告：无法移除 %%f
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
if exist "%temp_dirs%" del "%temp_dirs%"

echo.
echo 脚本执行完成。
goto :eof

:process_line
set "line=%~1"
:: 跳过空行
if "%line%"=="" goto :eof
:: 跳过注释行
if "%line:~0,1%"=="#" goto :eof
:: 跳过否定模式
if "%line:~0,1%"=="!" goto :eof

:: 移除末尾的斜杠
set "pattern=%line:/=%"

echo 处理模式: %pattern%

:: 获取匹配的文件
for /f "usebackq tokens=* delims=" %%f in (`git ls-files`) do (
    call :check_match "%%f" "%pattern%"
)
goto :eof

:check_match
set "file=%~1"
set "pattern=%~2"

:: 简单的模式匹配（可以扩展以支持更复杂的 glob 模式）
echo %file% | findstr /r /c:"%pattern%" >nul
if %errorlevel% equ 0 (
    echo %file% >> "%temp_file%"
)
goto :eof