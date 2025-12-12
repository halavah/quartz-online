#!/bin/bash

# ignore.sh - 根据 .gitignore 内容移除已被 Git 跟踪的文件
# 适用于 macOS/Linux 系统

echo "==========================================="
echo "根据 .gitignore 内容清理 Git 跟踪文件"
echo "==========================================="

# 检查是否在 Git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "错误：当前目录不是 Git 仓库"
    exit 1
fi

# 检查 .gitignore 文件是否存在
if [ ! -f ".gitignore" ]; then
    echo "错误：未找到 .gitignore 文件"
    exit 1
fi

# 临时文件存储要处理的文件
TEMP_FILES=$(mktemp)
TEMP_DIRS=$(mktemp)

echo "第一步：分析 .gitignore 文件..."
echo ""

# 处理 .gitignore 中的每一行
while IFS= read -r line || [[ -n "$line" ]]; do
    # 跳过空行和注释
    if [[ -z "$line" || "$line" == \#* ]]; then
        continue
    fi

    # 跳过以 ! 开头的否定模式
    if [[ "$line" == \!* ]]; then
        continue
    fi

    # 移除末尾的斜杠（目录标记）
    pattern="${line%/}"

    echo "处理模式: $pattern"

    # 查找匹配的被跟踪文件
    # 使用 git ls-files 列出所有被跟踪的文件，然后匹配模式
    if [[ "$line" == */ ]]; then
        # 如果是目录模式（以 / 结尾）
        git ls-files | grep -E "^${pattern}(/|$)" | head -10 >> "$TEMP_FILES"
    else
        # 普通文件模式
        # 转换 glob 模式到正则表达式
        regex_pattern=$(echo "$pattern" | sed 's/\./\\./g' | sed 's/\*/.*/g')
        git ls-files | grep -E "$regex_pattern" | head -10 >> "$TEMP_FILES"
    fi

done < .gitignore

# 去重
if [ -f "$TEMP_FILES" ]; then
    sort -u "$TEMP_FILES" > "${TEMP_FILES}.sorted"
    mv "${TEMP_FILES}.sorted" "$TEMP_FILES"
fi

echo ""
echo "第二步：检查要移除的文件..."
echo ""

# 显示将要移除的文件
if [ -s "$TEMP_FILES" ]; then
    echo "以下文件将被从 Git 跟踪中移除（但不会删除本地文件）："
    echo "---------------------------------------------------"
    cat "$TEMP_FILES"
    echo "---------------------------------------------------"
    echo ""

    # 询问用户确认
    read -p "确定要移除这些文件的 Git 跟踪吗？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "第三步：移除 Git 跟踪..."

        # 移除文件跟踪
        while IFS= read -r file; do
            if [ -n "$file" ]; then
                echo "移除跟踪: $file"
                git rm --cached -r "$file" 2>/dev/null || echo "警告：无法移除 $file"
            fi
        done < "$TEMP_FILES"

        echo ""
        echo "操作完成！已从 Git 跟踪中移除匹配 .gitignore 的文件。"
        echo ""
        echo "提示："
        echo "- 文件仍保留在本地文件系统中"
        echo "- 运行 'git status' 查看当前状态"
        echo "- 提交更改：'git add .gitignore && git commit -m \"Add .gitignore and remove ignored files\"'"
    else
        echo "操作已取消。"
    fi
else
    echo "没有找到需要移除的被跟踪文件。"
fi

# 清理临时文件
rm -f "$TEMP_FILES" "$TEMP_DIRS"

echo ""
echo "脚本执行完成。"