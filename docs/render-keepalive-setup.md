# Quartz Online - Render 服务保活配置

## 📋 已完成配置

### 1. GitHub Actions 工作流

**文件位置**：`.github/workflows/keepalive.yml`

**功能说明**：
- 每 10 分钟自动访问健康检查端点
- 防止 Render 免费实例休眠（15 分钟无访问会休眠）
- 支持手动触发测试

**配置详情**：
```yaml
- 定时任务：每 10 分钟执行一次
- 目标 URL：https://quartz-online.onrender.com/api/health
- 运行环境：Ubuntu Latest
```

### 2. 健康检查 API 端点

**文件位置**：`app/api/health/route.ts`

**访问地址**：
- 本地：http://localhost:3000/api/health
- 生产：https://quartz-online.onrender.com/api/health

**响应示例**：
```json
{
  "status": "ok",
  "timestamp": "2025-12-16T04:00:00.000Z",
  "uptime": 3600.5,
  "service": "quartz-online"
}
```

## 🚀 部署步骤

### 步骤 1：提交代码到 GitHub

```bash
cd /Volumes/Samsung/software_xare/quartz-online

# 添加新文件
git add .github/workflows/keepalive.yml
git add app/api/health/route.ts

# 提交
git commit -m "feat: 添加 Render 服务保活配置

- 添加 GitHub Actions 每 10 分钟 ping 服务
- 添加健康检查 API 端点 /api/health
- 防止 Render 免费实例休眠"

# 推送到远程
git push origin master
```

### 步骤 2：验证 GitHub Actions

1. 访问 GitHub 仓库
2. 进入 **Actions** 标签页
3. 查看 "Keep Render Service Alive" 工作流
4. 点击 **Run workflow** 手动测试

### 步骤 3：部署到 Render

Render 会自动检测到代码更新并重新部署。

### 步骤 4：测试健康检查端点

```bash
# 等待 Render 部署完成后测试
curl https://quartz-online.onrender.com/api/health

# 预期输出
# {"status":"ok","timestamp":"2025-12-16T...","uptime":123.45,"service":"quartz-online"}
```

## 📊 监控和验证

### 查看 GitHub Actions 运行日志

```
GitHub Repository → Actions → Keep Render Service Alive → 选择运行记录
```

您将看到：
- 🔄 开始 ping 的时间戳
- ✅ 服务状态码（应为 200）
- 📊 完成时间和目标 URL

### 验证服务不再休眠

1. **冷启动测试**：
   - 等待 20 分钟不访问应用
   - 然后访问主页
   - 应该立即响应（无冷启动延迟）

2. **查看 Render 日志**：
   ```
   Render Dashboard → quartz-online → Logs
   ```
   每 10 分钟应该看到健康检查的 GET 请求

## 🔧 配置选项

### 修改 Ping 频率

编辑 `.github/workflows/keepalive.yml` 的 `cron` 表达式：

```yaml
schedule:
  # 每 5 分钟（最短）
  - cron: '*/5 * * * *'

  # 每 10 分钟（推荐）
  - cron: '*/10 * * * *'

  # 每 15 分钟
  - cron: '*/15 * * * *'
```

### 手动触发工作流

```
GitHub → Actions → Keep Render Service Alive → Run workflow
```

## 📈 预期效果

### 服务可用性

- **之前**：15 分钟无访问 → 休眠 → 冷启动需要 30-60 秒
- **之后**：每 10 分钟自动访问 → 服务持续运行 → 即时响应

### GitHub Actions 用量

- 执行频率：每天 144 次（10 分钟间隔）
- 单次耗时：约 5-10 秒
- 月度用量：约 72-144 分钟（远低于免费 2000 分钟额度）

## 🛠️ 故障排查

### 问题 1：健康检查返回 404

**原因**：API 端点未正确部署

**解决**：
```bash
# 本地测试
npm run dev
curl http://localhost:3000/api/health

# 检查文件是否存在
ls app/api/health/route.ts
```

### 问题 2：GitHub Actions 执行失败

**原因**：URL 错误或服务未启动

**解决**：
1. 检查 Render 服务名称是否为 `quartz-online`
2. 确认 Render 服务已部署成功
3. 手动访问 https://quartz-online.onrender.com/api/health

### 问题 3：Cron 不按时执行

**说明**：GitHub Actions 可能延迟 5-10 分钟，这是正常现象

**对策**：
- 不影响保活效果（延迟仍在 15 分钟阈值内）
- 如需更精确，可使用 UptimeRobot（参考主文档）

## 📚 相关文档

- [Render 服务保活方案](./15.Render服务保活方案.md)（完整方案对比）
- [UptimeRobot 设置指南](./13.UptimeRobot设置指南.md)（推荐的主要方案）
- [GitHub Actions 文档](https://docs.github.com/actions)

## ✅ 配置清单

- [x] 创建 `.github/workflows/keepalive.yml`
- [x] 创建 `app/api/health/route.ts`
- [ ] 提交代码到 GitHub
- [ ] 等待 Render 自动部署
- [ ] 测试健康检查端点
- [ ] 在 GitHub Actions 中手动运行一次测试
- [ ] 等待 20 分钟后验证服务不休眠

## 💡 补充建议

### 推荐：组合使用 UptimeRobot

为了更高的可靠性，建议同时使用 UptimeRobot（免费、5 分钟间隔）：

1. **UptimeRobot**（主）：5 分钟间隔，99.9% 可靠性
2. **GitHub Actions**（备）：10 分钟间隔，双重保障

### 成本分析

- **Render 免费计划**：750 小时/月运行时间
- **GitHub Actions**：2000 分钟/月免费额度
- **UptimeRobot**：50 个监控器免费

**总成本**：¥0 完全免费！

---

**配置日期**：2025-12-16
**项目名称**：Quartz Online
**Render 服务**：quartz-online
**部署区域**：Singapore
