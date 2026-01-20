#!/bin/bash

# Navigate to the directory where the script is located
cd "$(dirname "$0")"

# Go back to project root directory
cd ..

# Halavah's Tech 开发环境启动脚本
# 用于 macOS 和 Linux 系统

echo "=================================="
echo "🚀 Halavah's Tech 开发环境启动中..."
echo "=================================="

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    echo "请访问 https://nodejs.org 下载并安装 Node.js"
    exit 1
fi

# 显示 Node.js 版本
echo "📦 Node.js 版本: $(node --version)"

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: npm 未安装"
    exit 1
fi

# 显示 npm 版本
echo "📦 npm 版本: $(npm --version)"
echo ""

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📥 正在安装项目依赖..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ 依赖安装失败，请检查网络连接"
        exit 1
    fi
    echo ""
    echo "✅ 依赖安装完成"
    echo ""
fi

# 启动开发服务器
echo "🌐 启动开发服务器..."
echo ""
echo "📍 本地访问地址: http://localhost:31200"
echo "📍 网络访问地址: http://$(hostname -I | awk '{print $1}'):31200"
echo ""
echo "⚠️  按 Ctrl+C 停止服务器"
echo ""
echo "=================================="

npm run dev