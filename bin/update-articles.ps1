# ========================================
# 自动更新 articles.json 脚本 (PowerShell)
# ========================================

# 设置输出编码为 UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  自动更新 articles.json 脚本" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 设置路径 (脚本在 bin 目录下)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$PublicDir = Join-Path $ProjectRoot "public"
$ArticlesJson = Join-Path $ProjectRoot "data\articles.json"

# 检查目录是否存在
if (-not (Test-Path $PublicDir)) {
    Write-Host "错误: 目录不存在 $PublicDir" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

# 创建临时文件
$TempArticles = [System.IO.Path]::GetTempFileName()

Write-Host "正在扫描 HTML 文件..." -ForegroundColor Yellow
Write-Host ""

# 定义分类映射
$categoryMap = @{
    "chapter01" = "安装指南"
    "chapter02" = "使用技巧"
    "chapter03" = "使用工具"
    "chapter04" = "最新动态"
    "chapter05" = "网络工具"
}

# 处理每个章节
foreach ($chapterNum in 1..4) {
    $chapterName = "chapter0$chapterNum"
    $chapterPath = Join-Path $PublicDir $chapterName

    if (Test-Path $chapterPath) {
        $htmlFiles = Get-ChildItem -Path $chapterPath -Filter "*.html"

        foreach ($htmlFile in $htmlFiles) {
            # 读取文件内容
            $content = Get-Content $htmlFile.FullName -Encoding UTF8 -Raw

            # 提取 title
            if ($content -match '<title>(.*?)</title>') {
                $title = $matches[1].Trim()
            } else {
                $title = $htmlFile.BaseName
            }

            # 提取 description (支持两种格式)
            $description = ""
            if ($content -match 'name=["'']?description["'']?[^>]*content=["'']([^"'']*)["'']') {
                $description = $matches[1].Trim()
            }

            # 确定分类
            $category = if ($categoryMap.ContainsKey($chapterName)) {
                $categoryMap[$chapterName]
            } else {
                "其他"
            }

            # 相对路径
            $relativePath = "$chapterName/$($htmlFile.Name)"

            # 输出 JSON 格式到临时文件
            $jsonEntry = @"
    {
      "title": "$title",
      "description": "$description",
      "htmlFile": "$relativePath",
      "category": "$category"
    },
"@
            Add-Content -Path $TempArticles -Value $jsonEntry

            Write-Host "✓ $relativePath" -ForegroundColor Green
            Write-Host "  标题: $title" -ForegroundColor White
            Write-Host "  分类: $category" -ForegroundColor Cyan
            Write-Host ""
        }
    }
}

# 生成新的 articles.json
$configSection = @'
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
'@

Set-Content -Path $ArticlesJson -Value $configSection -Encoding UTF8

# 添加文章数据（移除最后一个逗号）
$tempContent = Get-Content $TempArticles -Raw
if ($tempContent.EndsWith(",")) {
    $tempContent = $tempContent.Substring(0, $tempContent.Length - 1)
}
Add-Content -Path $ArticlesJson -Value $tempContent -Encoding UTF8

# 结束 JSON
Add-Content -Path $ArticlesJson -Value "  ]" -Encoding UTF8
Add-Content -Path $ArticlesJson -Value "}" -Encoding UTF8

# 清理临时文件
Remove-Item $TempArticles -Force -ErrorAction SilentlyContinue

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ articles.json 更新完成!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "文件路径: $ArticlesJson" -ForegroundColor Yellow
Write-Host ""

# 显示统计信息
$totalArticles = (Select-String -Path $ArticlesJson -Pattern '"title"' -AllMatches).Matches.Count
Write-Host "总文章数: $totalArticles" -ForegroundColor Green
Write-Host ""

Read-Host "按 Enter 键退出"
exit 0
