#!/usr/bin/env python3
"""
更新文档中的文件链接引用
"""

import os
import re
import shutil
from pathlib import Path

# 文档路径
DOCS_PATH = "/Volumes/Samsung/software_xare/quartz-online/docs/chapter01"

# 需要更新的文档
DOCUMENTS = [
    "01.快速开始.md",
    "02.开发指南.md",
    "03.内容管理.md"
]

def update_document_links():
    """更新文档中的链接引用"""

    # 替换规则
    replacement_rules = [
        # Chapter 02: 01xx → 02xx
        (r'0101\.claude-code-', '0201.claude-code-'),
        (r'0102\.claude-code-', '0202.claude-code-'),
        (r'0103\.claude-code-', '0203.claude-code-'),
        (r'0104\.claude-code-', '0204.claude-code-'),
        (r'0105\.claude-code-', '0205.claude-code-'),
        (r'0106\.claude-code-', '0206.claude-code-'),
        (r'0107\.claude-code-', '0207.claude-code-'),

        # Chapter 05: 01xx → 05xx
        (r'0101\.xget-high-performance-resource', '0501.xget-high-performance-resource'),
        (r'0102\.bytebot-ai-desktop-agent', '0502.bytebot-ai-desktop-agent'),
        (r'0103\.onyx-opensource-ai-platform', '0503.onyx-opensource-ai-platform'),
        (r'0104\.trendradar-trend-monitoring-tool', '0504.trendradar-trend-monitoring-tool'),
        (r'0105\.tracy-profiler-performance-analysis', '0505.tracy-profiler-performance-analysis'),

        # Chapter 03: 011x → 03xx (使用反向引用)
        (r'011([0-9])\.', r'03\1.'),

        # 完整路径中的替换
        (r'chapter02/010([0-9])', r'chapter02/02\1'),
        (r'chapter02_ext/010([0-9])', r'chapter02_ext/02\1'),
        (r'chapter03/011([0-9])', r'chapter03/03\1'),
        (r'chapter03_ext/011([0-9])', r'chapter03_ext/03\1'),
        (r'chapter05/010([0-9])', r'chapter05/05\1'),
    ]

    total_changes = 0

    for doc_name in DOCUMENTS:
        doc_path = Path(DOCS_PATH) / doc_name

        if not doc_path.exists():
            print(f"文档不存在: {doc_path}")
            continue

        print(f"\n📄 处理文档: {doc_name}")

        # 读取文件内容
        with open(doc_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        changes_made = []

        # 应用替换规则
        for pattern, replacement in replacement_rules:
            if re.search(pattern, content):
                # 统计匹配次数
                matches = re.findall(pattern, content)

                # 应用替换
                new_content = re.sub(pattern, replacement, content)

                if new_content != content:
                    changes_made.append({
                        'pattern': pattern,
                        'replacement': replacement,
                        'count': len(matches)
                    })
                    content = new_content

        # 如果有变化，保存文件
        if content != original_content:
            # 备份原文件
            backup_path = doc_path.with_suffix(doc_path.suffix + '.backup')
            shutil.copy2(doc_path, backup_path)
            print(f"  📁 备份文件: {backup_path.name}")

            # 写入更新后的内容
            with open(doc_path, 'w', encoding='utf-8') as f:
                f.write(content)

            # 报告变化
            print(f"  ✅ 已更新文档，修改了 {len(changes_made)} 类替换")
            for change in changes_made:
                print(f"    - {change['pattern']} → {change['replacement']} ({change['count']} 处)")
            total_changes += sum(change['count'] for change in changes_made)
        else:
            print(f"  ℹ️  未发现需要更新的链接")

    print(f"\n🎉 文档链接更新完成！总计更新了 {total_changes} 处链接")

    # 验证更新结果
    print("\n🔍 验证更新结果:")
    for doc_name in DOCUMENTS:
        doc_path = Path(DOCS_PATH) / doc_name
        if doc_path.exists():
            with open(doc_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 检查是否还有旧的链接模式
            old_patterns = [
                r'010[1-7]\.claude-code-',
                r'011[0-9]\.',
                r'chapter02/010[1-7]',
                r'chapter03/011[0-9]',
                r'chapter05/010[1-5]',
            ]

            found_old = []
            for pattern in old_patterns:
                if re.search(pattern, content):
                    found_old.append(pattern)

            if found_old:
                print(f"  ⚠️  {doc_name}: 仍有旧链接模式 {found_old}")
            else:
                print(f"  ✅ {doc_name}: 链接更新正确")

if __name__ == "__main__":
    print("🔧 文档链接更新工具")
    print("=" * 60)
    update_document_links()