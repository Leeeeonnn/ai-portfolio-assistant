

第一部分：AI分身
是让模型能够通过 RAG 召回真实内容，而不是依赖大模型猜测。


当前代码里已经包含首页、聊天页、项目详情页、关于页面、Dify 服务端代理接口、流式聊天解析、停止生成接口、错误/重试状态，以及面向 Vercel 部署的环境变量配置方式。

![首页项目卡片素材](../public/figma-assets/project-askbot.png)

## 2. 我们是怎么协作的

这次协作的核心方式是：你提出产品目标、设计方向、资源和想要的体验，我负责把目标拆成工程任务、读现有上下文、写代码、补配置、接入服务、处理边界情况，并在本地反复验证。

协作过程大致可以概括为：

1. 先确定产品定位：不是普通作品集，而是一个可以对话的 AI 作品集助手。
2. 再确定技术路径：用 Next.js 做网站和服务端 API 代理，用 Dify 承载 AI 工作流和知识库，用 Qwen 作为 Dify 内部模型配置建议。
3. 然后把页面拆开：主页、聊天页、项目详情页、联系弹窗、作品集/简历入口、关于页面。
4. 接着实现真实交互：预设问题跳转聊天、流式输出、停止生成、错误提示、重试、后续问题建议。
5. 最后补上安全边界：Dify API Key 只在服务端环境变量里使用，前端不暴露；AI 助手不冒充真人，不泄露原始私聊或敏感信息。

我在协作中承担的部分主要是：

- 初始化并维护 Next.js + TypeScript + Tailwind CSS 项目结构。
- 根据 Figma 相关素材组织 `public/figma-assets/`，并在页面组件里引用真实资产。
- 实现首页体验，包括工具列表、功能卡片、作品入口、联系弹窗和问题输入框。
- 实现聊天体验，包括 `/chat` 页面、消息状态、流式渲染、Markdown 渲染、自动滚动、停止和重试。
- 实现服务端 API，包括 `/api/chat`、`/api/chat/stop`、`/api/chat/suggested`。
- 编写 Dify 请求构造逻辑，把助手身份、隐私边界和资料来源策略传给 Dify。
- 增加 `.env.example` 和 README，说明本地运行、Dify 配置和验证方法。
- 增加 `scripts/test-dify.mjs`，用于在命令行里直接验证 Dify API 和知识库召回链路。

你承担的部分主要是：

- 定义项目目标和受众。
- 提供作品、简历、联系方式、项目截图和设计素材。
- 决定 AI 助手要呈现的身份、语气和隐私边界。
- 提供或配置 Dify 侧的 API Key、知识库、工作流和模型。
- 决定哪些个人资料可以公开，哪些不能进入前端、GitHub 或知识库。

## 3. 从创建项目到可运行版本的流程

### 3.1 创建工程骨架

项目使用 Next.js App Router，当前 `package.json` 里的关键依赖包括：

- `next` 15.3.2
- `react` 19
- `typescript` 5.8
- `tailwindcss` 4.1
- `lucide-react`
- `zod`

脚本包括：

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run test:dify
```

项目目录被拆成两个主要业务域：

```txt
src/app
src/features/chat
src/features/portfolio
public/figma-assets
public/files
scripts
```

这种拆法让页面路由、聊天逻辑和作品集展示逻辑比较清楚：`src/app` 负责 Next.js 页面和 API 路由，`src/features/chat` 放聊天相关逻辑，`src/features/portfolio` 放作品集展示组件和配置数据。

### 3.2 搭建首页和作品集入口

首页入口在 `src/app/page.tsx`，核心展示组件在 `src/features/portfolio/components/`。

当前首页包含：

- 顶部个人 Logo 和工具列表。
- Figma、Codex、Qwen、ChatGPT、Dify 等工具标识。
- 下载作品集、下载简历、联系我、关于网站四个功能入口。
- AskBOT、Tokenview、TvDev、Others 四个项目入口。
- 预设问题输入，点击后进入聊天页。

项目数据集中放在 `src/features/portfolio/data.ts`，比如工具列表、功能卡片、项目卡片、预设问题和图片路径都在那里配置。这让后续替换文案或图片时不需要到处改组件。

![Tokenview 项目素材](../public/figma-assets/project-tokenview.png)

### 3.3 实现项目详情页

项目详情路由是：

```txt
src/app/projects/[slug]/page.tsx
```

当前资源目录里可以看到 AskBOT、Tokenview、TvDev 和 Others 的详情页素材：

```txt
public/figma-assets/askbot/
public/figma-assets/tokenview/
public/figma-assets/tvdev/
public/figma-assets/others/
```

也就是说，项目页不是临时占位，而是已经有了对应的真实项目截图和页面素材。

![AskBOT 页面素材](../public/figma-assets/askbot-page.png)

### 3.4 接入 AI 聊天能力

聊天页在：

```txt
src/app/chat/page.tsx
src/features/chat/components/chat-experience.tsx
```

核心交互包括：

- 从首页预设问题进入 `/chat`。
- 自动发送首个问题。
- 显示用户消息和助手消息。
- 支持 Dify SSE 流式响应。
- 支持 blocking JSON 响应兼容。
- 支持 Markdown 内容渲染。
- 支持停止生成。
- 支持错误提示和重试。
- 支持 Dify 返回或后续接口获取的建议问题。

聊天流解析逻辑在：

```txt
src/features/chat/lib/stream.ts
```

这里不仅处理普通 `answer` 字段，也兼容了 Dify workflow 中可能出现的 `workflow_finished`、`node_finished`、`suggested_questions`、`next_questions`、`follow_up_questions` 等多种结构。

### 3.5 用服务端代理保护 Dify API Key

前端不会直接请求 Dify，而是请求本站自己的接口：

```txt
POST /api/chat
POST /api/chat/stop
```

真实 Dify 请求在 Next.js 服务端完成：

```txt
src/app/api/chat/route.ts
src/app/api/chat/stop/route.ts
src/features/chat/server/dify.ts
```

这样做的原因是：

- `DIFY_API_KEY` 不会出现在浏览器里。
- 请求参数可以在服务端统一校验。
- 可以统一加入助手身份和隐私边界。
- 后续部署到 Vercel 时，只需要配置环境变量，不需要把密钥提交到仓库。

当前 `.env.example` 里列出的环境变量包括：

```txt
DIFY_API_BASE_URL
DIFY_API_KEY
DIFY_RESPONSE_MODE
DIFY_USER_ID
CHAT_REQUEST_TIMEOUT_MS
CHAT_ASSISTANT_IDENTITY
CHAT_PRIVACY_BOUNDARY
```

### 3.6 加入隐私和安全边界

项目一开始就把“个人 AI 助手”的边界写进了架构里。

当前代码会向 Dify 传入：

- `assistant_identity`：说明它是 Leon 的 AI portfolio assistant。
- `privacy_boundary`：说明不要冒充真实 Leon，不要泄露原始微信聊天记录、个人标识符或敏感信息。
- `source_policy`：要求只使用 Dify 知识库、公开作品集资料和处理后的人格摘要。

README 里也明确写了：

- 原始微信聊天记录不进入 `src/`。
- 原始微信聊天记录不进入 `public/`。
- 原始微信聊天记录不进入 GitHub 公开仓库。
- Dify 知识库只接收清洗后的资料、公开作品集材料和可公开项目经历。

这部分很重要，因为这个项目不是单纯做一个“会聊天的网页”，而是在处理真实个人资料和公开展示之间的边界。

## 4. 使用过的工具

从当前仓库可验证的内容看，项目涉及这些工具：

| 工具 | 用途 | 证据 |
| --- | --- | --- |
| Next.js | 网站、路由、服务端 API | `package.json`、`src/app/` |
| React | 前端交互组件 | `package.json`、`src/features/*/components/` |
| TypeScript | 类型约束和维护 | `tsconfig.json`、`.tsx` 文件 |
| Tailwind CSS | 页面样式 | `package.json`、`src/app/globals.css` |
| Dify | AI 工作流、知识库、Chat API | `src/features/chat/server/dify.ts`、README |
| Qwen | Dify 内建议配置的底层模型 | README、首页工具列表 |
| ChatGPT / Codex | 协作开发和代码实现 | 首页工具列表、README、当前协作过程 |
| Figma | 设计素材来源和高保真还原方向 | `public/figma-assets/`、首页工具列表 |
| Vercel | 推荐部署平台 | README 中的部署说明 |
| GitHub | 推荐版本管理平台 | README 中的版本管理说明 |
| ESLint | 代码检查 | `eslint.config.mjs`、`npm run lint` |
| Zod | API 入参校验 | `src/app/api/chat/route.ts`、`stop/route.ts` |

需要特别说明：当前本地仓库没有 git commit，也没有 git remote；因此我不能从仓库证明已经推送到 GitHub 或已经通过 Vercel 上线。

## 5. 当前可确认完成的功能

根据当前代码和 README，可确认完成的内容包括：

- Next.js 工程骨架。
- 首页和聊天页。
- 项目详情页路由和多组项目详情素材。
- 关于网站页面。
- 首页功能卡片 hover 和跳转逻辑。
- 联系弹窗。
- 作品集和简历 PDF 入口。
- Dify 服务端代理接口。
- Dify 流式响应解析。
- blocking 响应兼容。
- 停止 Dify 流式生成。
- 错误提示、重试和空回复状态。
- 建议问题解析。
- AI 助手身份说明和隐私边界。
- `.env.example` 环境变量模板。
- Dify 命令行测试脚本。
- README 本地运行和验证说明。

## 6. 上线/部署流程

当前仓库没有可验证的 Vercel 项目配置、线上 URL、GitHub remote 或部署日志。所以以下只能写成“项目设计的上线流程”，不能写成“已经完成上线”。

设计中的上线流程是：

1. 本地确认项目可以运行：

```bash
npm install
npm run dev
```

2. 本地补齐环境变量：

```bash
cp .env.example .env.local
```

然后填写：

```txt
DIFY_API_KEY=真实 Dify API Key
DIFY_API_BASE_URL=https://api.dify.ai/v1
DIFY_RESPONSE_MODE=streaming
```

3. 验证 Dify 接口：

```bash
npm run test:dify
```

4. 做代码质量检查：

```bash
npm run lint
npm run typecheck
npm run build
```

5. 提交到 GitHub。

6. 在 Vercel 导入 GitHub 仓库。

7. 在 Vercel 项目设置中配置同样的环境变量，尤其是 `DIFY_API_KEY`。

8. 部署后验证：

- 首页可以打开。
- `/chat` 可以打开。
- 预设问题能进入聊天页。
- AI 回复能流式输出。
- 浏览器端看不到 `DIFY_API_KEY`。
- 联系弹窗、项目页、PDF 链接正常。

## 7. token 消耗说明

这部分不能瞎编。

当前本地仓库没有保存 Codex/ChatGPT 协作过程中的 token 用量明细，也没有可查询的 API usage 日志或账单数据。因此无法从当前项目文件中精确统计“创建项目到现在一共消耗了多少 token”。

可以真实表述为：

- 项目过程中确实使用了 ChatGPT/Codex 进行需求拆解、代码生成、调试、文档整理和本地验证。
- 但 token 数量没有被写入项目仓库，也没有随代码一起保存。
- 如果需要精确数字，只能从使用平台的会话统计、API usage 面板、账单记录或 Codex 本身的运行统计里导出。

如果对外介绍，可以这样说：

> token 消耗没有在项目仓库中留痕，因此我没有写具体数字。这个项目更适合用“完成了哪些协作任务、减少了哪些手工工程工作、哪些关键决策由我负责”来说明 AI 协作价值，而不是编一个无法核验的 token 总量。

## 8. 可以对别人讲的项目故事

这个项目最有价值的地方，不只是“我做了一个作品集网站”，而是它把个人展示、AI 对话、设计资产和隐私边界放到了一起。

传统作品集通常是静态的：访问者只能按页面顺序看项目。但这个项目把作品集改成了可以提问的形态。面试官可以直接问“你是什么样的设计师”“你在数巅做过什么”“这个网站是怎么做的”，系统会把问题交给 Dify 工作流，再结合公开作品集资料和处理后的人格摘要生成回答。

在协作方式上，你负责判断“这个网站应该表达什么”，我负责把它拆成可运行的工程模块：Next.js 页面、Dify API 代理、聊天流解析、停止接口、隐私边界、项目资源结构和部署准备。整个过程更像是你在做产品决策，我在旁边担任工程搭档和实现助手。

这个项目也体现了一个很现实的 AI 协作方式：AI 不是替你决定个人表达，而是帮你把想法变成可运行、可验证、可迭代的产品。特别是涉及个人资料时，AI 协作不能只追求“像本人”，还必须明确什么可以公开、什么不能公开、什么只能用清洗后的摘要。

## 9. 目前仍需补充或确认的事项

以下事项当前不能从仓库中确认：

- 是否已经推送到 GitHub。
- 是否已经部署到 Vercel。
- 线上访问 URL 是什么。
- Dify 知识库最终导入了哪些资料。
- Dify 工作流中实际使用的模型是否就是 Qwen。
- Codex/ChatGPT 实际消耗 token 数。
- 具体开发起止时间和每一轮协作的时间线。

如果要把这份文档变成正式对外材料，建议再补：

- GitHub 仓库链接。
- Vercel 线上链接。
- 一张真实首页截图。
- 一张真实聊天页截图。
- Dify 工作流截图或简化架构图。
- 你自己的 3-5 句项目感受。

## 10. 附：当前项目文件证据

关键文件：

```txt
package.json
README.md
.env.example
src/app/api/chat/route.ts
src/app/api/chat/stop/route.ts
src/features/chat/server/dify.ts
src/features/chat/lib/stream.ts
src/features/chat/components/chat-experience.tsx
src/features/portfolio/data.ts
scripts/test-dify.mjs
public/figma-assets/
public/files/
```

当前仓库状态：

```txt
本地 git 分支 main 尚无 commit。
当前文件均为未跟踪状态。
未发现 git remote。
未发现 Vercel 配置文件或线上部署记录。
public/ 目录下有 94 个文件。
```

