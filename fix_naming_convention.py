#!/usr/bin/env python3
"""
修复文件命名规范脚本
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
    """
    找到目录中前缀不正确的文件

    Args:
        directory: 目录路径
        correct_prefix: 正确的前缀（如"02", "03"）

    Returns:
        List[Tuple[str, str]]: (原文件名, 正确文件名) 的列表
    """
    wrong_files = []
    dir_path = Path(BASE_PATH) / directory

    if not dir_path.exists():
        print(f"警告: 目录 {dir_path} 不存在")
        return wrong_files

    # 匹配markdown和html文件
    for file_path in dir_path.glob("*.md"):
        if file_path.is_file():
            old_name = file_path.name
            # 检查是否是四位数字开头
            match = re.match(r'^(\d{4})(.*)', old_name)
            if match:
                current_prefix = match.group(1)[:2]  # 取前两位
                if current_prefix != correct_prefix:
                    # 生成正确的文件名
                    suffix = match.group(2)
                    new_name = f"{correct_prefix}{match.group(1)[2:]}{suffix}"
                    wrong_files.append((old_name, new_name))

    for file_path in dir_path.glob("*.html"):
        if file_path.is_file():
            old_name = file_path.name
            # 检查是否是四位数字开头
            match = re.match(r'^(\d{4})(.*)', old_name)
            if match:
                current_prefix = match.group(1)[:2]  # 取前两位
                if current_prefix != correct_prefix:
                    # 生成正确的文件名
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

def print_rename_plan(rename_plan: Dict[str, List[Tuple[str, str]]]):
    """打印重命名计划"""
    print("=" * 80)
    print("文件重命名计划")
    print("=" * 80)

    total_files = 0
    for directory, files in rename_plan.items():
        print(f"\n目录: {directory}")
        print("-" * 40)
        for old_name, new_name in files:
            print(f"  {old_name} → {new_name}")
            total_files += 1

    print(f"\n总计需要重命名 {total_files} 个文件")
    print("=" * 80)

def execute_rename(rename_plan: Dict[str, List[Tuple[str, str]]], dry_run: bool = True):
    """执行重命名操作"""
    if dry_run:
        print("\n🔍 模拟运行（不会实际重命名文件）")
    else:
        print("\n🚀 开始执行重命名操作")

    success_count = 0
    error_count = 0

    for directory, files in rename_plan.items():
        dir_path = Path(BASE_PATH) / directory

        for old_name, new_name in files:
            old_path = dir_path / old_name
            new_path = dir_path / new_name

            try:
                if dry_run:
                    print(f"  [模拟] {old_path} → {new_path}")
                else:
                    # 检查目标文件是否已存在
                    if new_path.exists():
                        print(f"  ⚠️  警告: 目标文件已存在，跳过 {new_name}")
                        continue

                    # 执行重命名
                    shutil.move(str(old_path), str(new_path))
                    print(f"  ✅ {old_name} → {new_name}")

                success_count += 1

            except Exception as e:
                print(f"  ❌ 错误: {old_name} 重命名失败 - {str(e)}")
                error_count += 1

    if dry_run:
        print(f"\n✅ 模拟完成，共检查 {success_count} 个文件")
    else:
        print(f"\n✅ 重命名完成: 成功 {success_count} 个，失败 {error_count} 个")

def scan_documents_for_old_links() -> List[Tuple[str, List[str]]]:
    """
    扫描文档中的旧链接

    Returns:
        List[Tuple[str, List[str]]]: (文档路径, 需要更新的链接列表)
    """
    doc_paths = [
        "/Volumes/Samsung/software_xare/quartz-online/docs/chapter01/01.快速开始.md",
        "/Volumes/Samsung/software_xare/quartz-online/docs/chapter01/02.开发指南.md",
        "/Volumes/Samsung/software_xare/quartz-online/docs/chapter01/03.内容管理.md"
    ]

    documents_with_old_links = []

    for doc_path in doc_paths:
        if not os.path.exists(doc_path):
            print(f"警告: 文档 {doc_path} 不存在")
            continue

        with open(doc_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 查找可能的旧链接模式
        old_link_patterns = [
            r'010[0-9]\.claude-code-',  # Chapter 02的旧链接
            r'011[0-9]\.',             # Chapter 03的旧链接
        ]

        found_links = []
        for pattern in old_link_patterns:
            matches = re.findall(pattern, content)
            if matches:
                found_links.extend(matches)

        # 也查找完整路径中的问题
        path_patterns = [
            r'chapter02/\d+\.claude-code-',
            r'chapter02_ext/\d+\.claude-code-',
            r'chapter03/\d+',
            r'chapter03_ext/\d+',
        ]

        for pattern in path_patterns:
            matches = re.findall(pattern, content)
            if matches:
                found_links.extend(matches)

        if found_links:
            documents_with_old_links.append((doc_path, found_links))

    return documents_with_old_links

def update_document_links():
    """更新文档中的链接"""
    doc_paths = [
        "/Volumes/Samsung/software_xare/quartz-online/docs/chapter01/01.快速开始.md",
        "/Volumes/Samsung/software_xare/quartz-online/docs/chapter01/02.开发指南.md",
        "/Volumes/Samsung/software_xare/quartz-online/docs/chapter01/03.内容管理.md"
    ]

    # 链接替换规则
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
            continue

        print(f"\n处理文档: {doc_path}")

        with open(doc_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        changes_made = []

        for pattern, replacement in replacement_rules:
            matches = re.findall(pattern, content)
            if matches:
                # 如果replacement包含反向引用，需要特殊处理
                if isinstance(replacement, str) and re.search(r'\\[0-9]', replacement):
                    new_content = re.sub(pattern, replacement, content)
                else:
                    new_content = content.replace(pattern, replacement)

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
    print("🔧 文件命名规范修复工具")
    print("=" * 80)

    # 步骤1: 生成重命名计划
    print("\n📋 步骤1: 分析文件命名问题...")
    rename_plan = generate_rename_plan()

    if not rename_plan:
        print("✅ 所有文件命名规范正确，无需修复")
    else:
        # 步骤2: 显示重命名计划
        print_rename_plan(rename_plan)

        # 步骤3: 询问是否执行
        print("\n是否执行重命名操作？")
        print("1. 仅模拟运行（推荐）")
        print("2. 实际执行重命名")
        print("3. 跳过重命名")

        choice = input("请选择 (1/2/3): ").strip()

        if choice == "1":
            execute_rename(rename_plan, dry_run=True)
        elif choice == "2":
            confirm = input("⚠️  这将实际重命名文件，确认继续？(y/N): ").strip().lower()
            if confirm == 'y':
                execute_rename(rename_plan, dry_run=False)
            else:
                print("已取消重命名操作")
        elif choice == "3":
            print("跳过重命名步骤")
        else:
            print("无效选择，跳过重命名步骤")

    # 步骤4: 扫描并更新文档链接
    print("\n📋 步骤2: 扫描文档中的链接引用...")
    documents_with_links = scan_documents_for_old_links()

    if documents_with_links:
        print("\n发现需要更新的文档:")
        for doc_path, links in documents_with_links:
            print(f"  📄 {doc_path}")
            for link in links:
                print(f"    - {link}")

        update_choice = input("\n是否更新文档中的链接？(y/N): ").strip().lower()
        if update_choice == 'y':
            update_document_links()
        else:
            print("跳过文档更新")
    else:
        print("✅ 未发现需要更新的文档链接")

    print("\n🎉 操作完成！")

if __name__ == "__main__":
    main()