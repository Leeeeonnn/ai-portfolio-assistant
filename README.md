# 个人 AI 作品集助手网站

这是一个从 0 开始搭建的 AI 作品集助手网站。目标用户是面试官、招聘方和潜在合作方。第一阶段重点是：工程搭建、可运行前端、Dify API 接入、后续可无缝部署到 Vercel。

当前子任务是构建 Personal Conversation Agent：网站访客可以和 “Leon 的 AI 作品集助手” 自由对话，了解作品、经历、协作方式、设计思考和经过处理后的沟通风格。助手只使用公开作品集材料、处理后的 personality summary、Dify 知识库和工作流，不会在前端或公开仓库中暴露原始微信聊天记录。

## 技术栈

- Next.js App Router：适合部署到 Vercel，也适合做服务端 API 代理。
- TypeScript：减少后期维护时的低级错误。
- Tailwind CSS：方便根据 Figma 设计稿快速还原响应式页面。
- Dify API：负责 AI 工作流、知识库和 Prompt 编排。
- Qwen：建议在 Dify 工作流内配置为底层模型，前端无需直接暴露模型密钥。
- GitHub：用于代码版本管理。

## 对话架构

```txt
Visitor Browser
  -> Next.js chat UI
  -> /api/chat server proxy
  -> Dify chat workflow / knowledge base
  -> Qwen model configured inside Dify
```

关键原则：

- 浏览器只请求本站 `/api/chat`，永远不直接请求 Dify。
- `DIFY_API_KEY` 只放在 `.env.local`、Vercel 环境变量或其他服务端环境变量中。
- 原始微信聊天记录不进入 `src/`、`public/`、GitHub 公开仓库或任何客户端文件。
- Dify 知识库只接收清洗后的资料、公开作品集材料、人格/语气摘要和可公开的项目经历。
- API 代理会向 Dify 传入身份和隐私边界，提醒工作流不要声称自己是真实 Leon，也不要泄露私密聊天内容。
- 流式模式下，前端会读取 Dify 返回的 `task_id`，点击“停止”时通过服务端 `/api/chat/stop` 调用 Dify 停止生成接口。

## 项目目录

```txt
src/
  app/
    api/chat/route.ts          # 服务端聊天接口，负责安全调用 Dify
    api/chat/stop/route.ts     # 停止 Dify 流式生成
    about/page.tsx             # 关于网站页面，等待 Figma 后续内容完善
    chat/page.tsx              # 问答页
    globals.css                # 全局样式
    layout.tsx                 # 页面根布局和 SEO 元信息
    page.tsx                   # 首页入口
  features/
    chat/
      components/              # 聊天相关 UI 组件
      lib/                     # 浏览器端流式响应解析
      server/                  # 服务端 Dify 配置和请求构造
      types.ts                 # 聊天类型定义
    portfolio/
      components/              # 首页、Header、联系弹窗、输入框等展示组件
      data.ts                  # 工具、卡片、预设问题和联系信息配置
public/
  files/                       # 后续放 portfolio.pdf 和 resume.pdf
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
cd "/Users/yaolirong/Documents/New project 3"
npm install
```

如果你在桌面项目中运行，请使用：

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

根据 Dify 官方 Chat Message API，`response_mode=streaming` 会返回 SSE 流，`response_mode=blocking` 会返回完整 JSON。建议优先使用 streaming；如果你的 Dify 应用使用 blocking 模式，也可以设置：

```bash
DIFY_RESPONSE_MODE=blocking
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
- 进入首页后，顶部应看到左侧个人 Logo 和右侧工具列表。
- 鼠标移动到四个功能卡片上，应看到 icon 平滑切换为按钮。
- 点击“联系我”，应出现带高斯模糊背景的联系名片；点击空白处关闭。
- 点击预设问题或输入问题发送，会跳转到 `/chat` 并开始流式输出。
- 输入问题后，如果 `.env.local` 已配置正确的 Dify API Key，应该能看到 AI 流式回复。
- 如果没有配置 Key，页面会显示“服务端尚未配置 DIFY_API_KEY”，说明密钥保护逻辑正常。
- 访问浏览器开发者工具时，不应看到 `DIFY_API_KEY`、原始微信聊天记录或任何私密数据。
- 可以测试这些问题：Leon 是什么样的设计师、如何思考产品设计、作为队友是什么风格、遇到设计挑战会怎么回应。

## Dify 工作流建议

在 Dify 侧建议准备三类资料：

- `portfolio_public_materials`：项目、经历、技能、联系方式等可公开信息。
- `personality_summary`：从清洗后的聊天记录提取出的语气、表达习惯、价值观、协作偏好和常见回应方式。
- `safety_boundary`：明确助手身份为 “Leon's AI portfolio assistant based on public portfolio materials and processed communication-style summaries.”，禁止冒充真人、禁止泄露原始私聊、禁止回答未公开的敏感身份问题。

推荐系统提示词方向：

```txt
You are Leon's AI portfolio assistant based on public portfolio materials and processed communication-style summaries.
You are not the real Leon.
Answer naturally in a tone consistent with the processed communication-style summary.
Use only public portfolio materials and approved knowledge base content.
Never reveal raw WeChat chat records, private conversations, personal identifiers, or sensitive information.
When a question asks for private or unsupported information, politely explain the boundary and redirect to portfolio-relevant context.
```

## GitHub 版本管理

建议流程：

1. 本地完成一个可运行版本。
2. 提交到 Git。
3. 推送到 GitHub 仓库。
4. 后续部署到 Vercel 时直接导入 GitHub 仓库。

## 当前进度

- 已完成 Next.js 工程骨架。
- 已完成 Dify 服务端代理接口。
- 已完成首页、问答页、加载页、关于网站占位页。
- 已完成首页功能卡片 hover 微动效和联系弹窗。
- 已完成基础聊天页面、流式响应解析和 blocking 响应兼容。
- 已完成加载、服务端停止、错误、重试和空回复状态。
- 已加入人格助手身份说明和隐私边界提示。
- 已预留 Figma 高保真还原入口。
- 已预留 Vercel 环境变量部署方式。

## 下一步

1. 你把 Figma 文件共享给当前 Figma MCP 登录邮箱 `qukaili97@gmail.com`，我再做像素级还原。
2. 你提供 Dify Chatflow 的 API Key，我帮你完成真实接口联调。
3. 你提供作品集 PDF 和简历 PDF，我放到 `public/files/portfolio.pdf` 和 `public/files/resume.pdf`。
4. 你在 Figma 更新“关于网站”页面后，我继续实现对应页面。
