# 个人 AI 作品集助手网站

这是一个从 0 开始搭建的 AI 作品集助手网站。目标用户是面试官、招聘方和潜在合作方。第一阶段重点是：工程搭建、可运行前端、Dify API 接入、后续可无缝部署到 Vercel。

## 技术栈

- Next.js App Router：适合部署到 Vercel，也适合做服务端 API 代理。
- TypeScript：减少后期维护时的低级错误。
- Tailwind CSS：方便根据 Figma 设计稿快速还原响应式页面。
- Dify API：负责 AI 工作流、知识库和 Prompt 编排。
- Qwen：建议在 Dify 工作流内配置为底层模型，前端无需直接暴露模型密钥。
- GitHub：用于代码版本管理。

## 项目目录

```txt
src/
  app/
    api/chat/route.ts          # 服务端聊天接口，负责安全调用 Dify
    globals.css                # 全局样式
    layout.tsx                 # 页面根布局和 SEO 元信息
    page.tsx                   # 首页入口
  features/
    chat/
      components/              # 聊天相关 UI 组件
      lib/                     # 浏览器端流式响应解析
      server/                  # 服务端 Dify 配置和请求构造
      types.ts                 # 聊天类型定义
```

## 你需要在哪里操作

桌面项目位置：

```txt
/Users/yaolirong/Desktop/ai-portfolio-assistant
```

## 第一次运行

1. 打开“终端”。
2. 复制下面命令并回车：

```bash
cd "/Users/yaolirong/Desktop/ai-portfolio-assistant"
npm install
```

3. 新建本地环境变量文件：

```bash
cp .env.example .env.local
```

4. 用编辑器打开 `.env.local`，把下面这一行替换成你的 Dify API Key：

```bash
DIFY_API_KEY=replace-with-your-dify-api-key
```

5. 启动本地网站：

```bash
npm run dev
```

6. 浏览器打开：

```txt
http://localhost:3000
```

## 如何验证成功

- 页面能打开，说明 Next.js 项目启动成功。
- 输入问题后，如果 `.env.local` 已配置正确的 Dify API Key，应该能看到 AI 流式回复。
- 如果没有配置 Key，页面会显示“服务端尚未配置 DIFY_API_KEY”，说明密钥保护逻辑正常。

## GitHub 版本管理

建议流程：

1. 本地完成一个可运行版本。
2. 提交到 Git。
3. 推送到 GitHub 仓库。
4. 后续部署到 Vercel 时直接导入 GitHub 仓库。

## 当前进度

- 已完成 Next.js 工程骨架。
- 已完成 Dify 服务端代理接口。
- 已完成基础聊天页面和流式响应解析。
- 已预留 Figma 高保真还原入口。
- 已预留 Vercel 环境变量部署方式。

## 下一步

1. 你提供 Dify API Key 和 Dify App 类型信息。
2. 我帮你完成真实接口联调。
3. 你提供 Figma 设计稿。
4. 我按设计稿替换当前占位页面，做高保真还原。
