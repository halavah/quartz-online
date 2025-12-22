#!/usr/bin/env python3
"""
自动修复文件命名规范脚本
确保各chapter目录下的文件名前缀与chapter编号匹配
"""

import os
import re
import shutil
from pathlib import Path
from typing import Dict, List, Tuple

# 基础路径
BASE_PATH = "/Volumes/Samsung/software_xare/quartz-online/public"

# 需要处理的目录
DIRECTORIES = [
    "chapter02",
    "chapter02_ext",
    "chapter03",
    "chapter03_ext",
    "chapter05"
]

# 文件名前缀映射
PREFIX_MAPPING = {
    "chapter02": "02",
    "chapter02_ext": "02",
    "chapter03": "03",
    "chapter03_ext": "03",
    "chapter05": "05"
}

def find_files_with_wrong_prefix(directory: str, correct_prefix: str) -> List[Tuple[str, str]]:
    """找到目录中前缀不正确的文件"""
    wrong_files = []
    dir_path = Path(BASE_PATH) / directory

    if not dir_path.exists():
        print(f"警告: 目录 {dir_path} 不存在")
        return wrong_files

    for file_path in dir_path.glob("*.md"):
        if file_path.is_file():
            old_name = file_path.name
            match = re.match(r'^(\d{4})(.*)', old_name)
            if match:
                current_prefix = match.group(1)[:2]
                if current_prefix != correct_prefix:
                    suffix = match.group(2)
                    new_name = f"{correct_prefix}{match.group(1)[2:]}{suffix}"
                    wrong_files.append((old_name, new_name))

    for file_path in dir_path.glob("*.html"):
        if file_path.is_file():
            old_name = file_path.name
            match = re.match(r'^(\d{4})(.*)', old_name)
            if match:
                current_prefix = match.group(1)[:2]
                if current_prefix != correct_prefix:
                    suffix = match.group(2)
                    new_name = f"{correct_prefix}{match.group(1)[2:]}{suffix}"
                    wrong_files.append((old_name, new_name))

    return wrong_files

def generate_rename_plan() -> Dict[str, List[Tuple[str, str]]]:
    """生成重命名计划"""
    rename_plan = {}
    for directory in DIRECTORIES:
        correct_prefix = PREFIX_MAPPING.get(directory)
        if correct_prefix:
            wrong_files = find_files_with_wrong_prefix(directory, correct_prefix)
            if wrong_files:
                rename_plan[directory] = wrong_files
    return rename_plan

def execute_rename(rename_plan: Dict[str, List[Tuple[str, str]]]):
    """执行重命名操作"""
    print("\n🚀 开始执行重命名操作")
    success_count = 0
    error_count = 0

    for directory, files in rename_plan.items():
        dir_path = Path(BASE_PATH) / directory

        for old_name, new_name in files:
            old_path = dir_path / old_name
            new_path = dir_path / new_name

            try:
                if new_path.exists():
                    print(f"  ⚠️  警告: 目标文件已存在，跳过 {new_name}")
                    continue

                shutil.move(str(old_path), str(new_path))
                print(f"  ✅ {old_name} → {new_name}")
                success_count += 1

            except Exception as e:
                print(f"  ❌ 错误: {old_name} 重命名失败 - {str(e)}")
                error_count += 1

    print(f"\n✅ 重命名完成: 成功 {success_count} 个，失败 {error_count} 个")

def update_document_links():
    """更新文档中的链接"""
    doc_paths = [
        "/Volumes/Samsung/software_xare/quartz-online/docs/chapter01/01.快速开始.md",
        "/Volumes/Samsung/software_xare/quartz-online/docs/chapter01/02.开发指南.md",
        "/Volumes/Samsung/software_xare/quartz-online/docs/chapter01/03.内容管理.md"
    ]

    replacement_rules = [
        # Chapter 02: 01xx → 02xx
        (r'0101\.claude-code-', '0201.claude-code-'),
        (r'0102\.claude-code-', '0202.claude-code-'),
        (r'0103\.claude-code-', '0203.claude-code-'),
        (r'0104\.claude-code-', '0204.claude-code-'),
        (r'0105\.claude-code-', '0205.claude-code-'),
        (r'0106\.claude-code-', '0206.claude-code-'),
        (r'0107\.claude-code-', '0207.claude-code-'),

        # Chapter 03: 011x → 03xx
        (r'011([0-9])\.', r'03\1.'),

        # 完整路径中的替换
        (r'chapter02/010([0-9])', r'chapter02/02\1'),
        (r'chapter02_ext/010([0-9])', r'chapter02_ext/02\1'),
        (r'chapter03/011([0-9])', r'chapter03/03\1'),
        (r'chapter03_ext/011([0-9])', r'chapter03_ext/03\1'),
    ]

    for doc_path in doc_paths:
        if not os.path.exists(doc_path):
            print(f"文档不存在: {doc_path}")
            continue

        print(f"\n📄 处理文档: {doc_path}")

        with open(doc_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        changes_made = []

        for pattern, replacement in replacement_rules:
            if re.search(pattern, content):
                new_content = re.sub(pattern, replacement, content)
                if new_content != content:
                    changes_made.append((pattern, replacement))
                    content = new_content

        if content != original_content:
            # 备份原文件
            backup_path = doc_path + '.backup'
            shutil.copy2(doc_path, backup_path)
            print(f"  📁 备份文件: {backup_path}")

            # 写入更新后的内容
            with open(doc_path, 'w', encoding='utf-8') as f:
                f.write(content)

            print(f"  ✅ 已更新文档，修改了 {len(changes_made)} 处链接")
            for pattern, replacement in changes_made:
                print(f"    - {pattern} → {replacement}")
        else:
            print(f"  ℹ️  未发现需要更新的链接")

def main():
    """主函数"""
    print("🔧 自动文件命名规范修复工具")
    print("=" * 80)

    # 步骤1: 生成重命名计划
    print("\n📋 步骤1: 分析文件命名问题...")
    rename_plan = generate_rename_plan()

    if not rename_plan:
        print("✅ 所有文件命名规范正确，无需修复")
    else:
        # 显示重命名计划
        print("\n📝 发现需要重命名的文件:")
        total_files = 0
        for directory, files in rename_plan.items():
            print(f"\n目录: {directory}")
            print("-" * 40)
            for old_name, new_name in files:
                print(f"  {old_name} → {new_name}")
                total_files += 1
        print(f"\n总计: {total_files} 个文件")

        # 直接执行重命名
        execute_rename(rename_plan)

    # 步骤2: 更新文档链接
    print("\n📋 步骤2: 更新文档中的链接引用...")
    update_document_links()

    print("\n🎉 所有操作完成！")

if __name__ == "__main__":
    main()