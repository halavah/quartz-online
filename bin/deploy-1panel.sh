#!/bin/bash
# quartz-online → 187 一键部署（blog.myslayers.top）
# 用法：bash bin/deploy-1panel.sh    （Mac 侧执行；依赖 nvm node 22 与 187 免密 ssh）
set -euo pipefail
export PATH="$HOME/.nvm/versions/node/v22.22.1/bin:$PATH"
SERVER="ubuntu@101.42.36.187"
DEST="/opt/1panel/www/sites/quartz-online/web"
cd "$(dirname "$0")/.."
echo "── [1/5] 依赖安装（peer 冲突为 dev 依赖所致，legacy 安全）"
npm install --legacy-peer-deps --no-audit --no-fund
echo "── [2/5] 构建（Next.js 静态导出 → out/）"
npm run build
echo "── [3/5] 打包上传"
tar czf /tmp/quartz-online-web.tgz -C out .
scp -q /tmp/quartz-online-web.tgz "$SERVER":/tmp/
echo "── [4/5] 187 侧解包（原子：新目录替换）"
ssh -n "$SERVER" "sudo rm -rf $DEST.new && sudo mkdir -p $DEST.new && sudo tar xzf /tmp/quartz-online-web.tgz -C $DEST.new && sudo chown -R ubuntu:ubuntu $DEST.new 2>/dev/null; sudo rm -rf $DEST.old && sudo mv $DEST $DEST.old 2>/dev/null; sudo mv $DEST.new $DEST && sudo rm -rf $DEST.old && rm -f /tmp/quartz-online-web.tgz"
echo "── [5/5] 验证"
sleep 1; CODE=$(curl -sk -o /dev/null -m 10 -w '%{http_code}' https://blog.myslayers.top/)
[ "$CODE" = 200 ] && echo "[OK] blog.myslayers.top = 200" || { echo "[ERROR] HTTP $CODE"; exit 1; }
