#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目路径 (脚本在 bin 目录下)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PUBLIC_DIR="$PROJECT_ROOT/public"
ARTICLES_JSON="$PROJECT_ROOT/data/articles.json"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  自动更新 articles.json 脚本${NC}"
echo -e "${BLUE}========================================${NC}\n"

# 检查目录是否存在
if [ ! -d "$PUBLIC_DIR" ]; then
    echo -e "${RED}错误: 目录不存在 $PUBLIC_DIR${NC}"
    exit 1
fi

# 创建临时文件存储文章数据
TEMP_ARTICLES=$(mktemp)

# 提取 HTML 文件的 title 和 description
extract_metadata() {
    local html_file="$1"
    local relative_path="${html_file#$PUBLIC_DIR/}"

    # 提取 title
    title=$(grep -m 1 '<title>' "$html_file" | sed 's/<[^>]*>//g' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

    # 提取 description (支持两种格式: name="description" 和 name=description)
    description=$(grep -m 1 -iE 'name=["]?description["]?' "$html_file" | sed -E 's/.*content="([^"]*)".*/\1/' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

    # 根据目录确定分类
    if [[ "$relative_path" == chapter01/* ]]; then
        category="安装指南"
    elif [[ "$relative_path" == chapter02/* ]]; then
        category="使用技巧"
    elif [[ "$relative_path" == chapter03/* ]]; then
        category="使用工具"
    elif [[ "$relative_path" == chapter04/* ]]; then
        category="最新动态"
    elif [[ "$relative_path" == chapter05/* ]]; then
        category="网络工具"
    else
        category="其他"
    fi

    # 输出 JSON 格式
    cat << EOF >> "$TEMP_ARTICLES"
    {
      "title": "$title",
      "description": "$description",
      "htmlFile": "$relative_path",
      "category": "$category"
    },
EOF

    echo -e "${GREEN}✓${NC} $relative_path"
    echo -e "  标题: $title"
    echo -e "  分类: $category\n"
}

echo -e "${YELLOW}正在扫描 HTML 文件...${NC}\n"

# 按章节顺序查找并处理 HTML 文件
find "$PUBLIC_DIR" -type f -name "*.html" | sort | while read -r html_file; do
    extract_metadata "$html_file"
done

# 读取配置部分
config_section=$(sed -n '/"config":/,/"articles":/p' "$ARTICLES_JSON" | sed '/"articles":/d')

# 生成新的 articles.json
cat > "$ARTICLES_JSON" << 'EOF'
{
  "config": {
    "siteName": "Halavah's Tech",
    "siteDescription": "探索前沿技术,提升开发效率",
    "githubUrl": "https://github.com/halavah",
    "beianNumber": "京ICP备12345678号",
    "copyrightText": "© 2025 Halavah's Tech. All rights reserved.",
    "adLink": "https://api.nekoapi.com",
    "defaultViewMode": "table"
  },
  "articles": [
EOF

# 添加文章数据(移除最后一个逗号)
sed '$ s/,$//' "$TEMP_ARTICLES" >> "$ARTICLES_JSON"

# 结束 JSON
cat >> "$ARTICLES_JSON" << 'EOF'
  ]
}
EOF

# 清理临时文件
rm -f "$TEMP_ARTICLES"

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ articles.json 更新完成!${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "\n文件路径: ${YELLOW}$ARTICLES_JSON${NC}"

# 显示统计信息
total_articles=$(grep -c '"title"' "$ARTICLES_JSON")
echo -e "总文章数: ${GREEN}$total_articles${NC}\n"
