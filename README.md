# MiMo CreatorOps

面向内容创作者的 AI 内容生产工作台 MVP。用户输入主题、平台、目标受众和内容风格后，系统通过服务端 `/api/generate` 调用 Xiaomi MiMo API，生成结构化发布包。

## 功能亮点

- Next.js App Router + TypeScript + Tailwind CSS
- 首页、创作页、案例页三页结构
- 无登录、无数据库，最近 5 次生成结果存储在浏览器 localStorage
- 结构化展示 10 个选题、5 个标题、短视频脚本、分镜表、封面文案、发布文案、评论区互动话术
- MiMo API Key、Base URL、Model 全部从环境变量读取，密钥只在服务端使用
- SaaS 风格界面，适合用于 AI 创作者活动申请演示

## 本地运行

```bash
npm install
npm run dev
```

默认访问：

```text
http://localhost:3000
```

## 环境变量

复制 `.env.example` 为 `.env.local`，填入你的 MiMo 配置：

```bash
cp .env.example .env.local
```

Windows PowerShell 可以使用：

```powershell
Copy-Item .env.example .env.local
```

`.env.local` 示例：

```env
XIAOMI_MIMO_API_KEY=your_mimo_api_key
XIAOMI_MIMO_BASE_URL=https://your-mimo-base-url/v1
XIAOMI_MIMO_MODEL=your-mimo-model
```

`XIAOMI_MIMO_BASE_URL` 填写 Xiaomi MiMo 开发者入口或活动提供的根地址。接口会自动补全 `/chat/completions`；如果你填的是完整 chat completions 地址，也可以直接使用。

## 可用命令

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## 项目结构

```text
src/app/page.tsx                首页
src/app/create/page.tsx         创作页
src/app/cases/page.tsx          案例页
src/app/api/generate/route.ts   MiMo API 调用接口
src/components/workbench.tsx    创作工作台
src/components/result-view.tsx  结构化结果展示
src/lib/content.ts              内容类型与选项
src/lib/examples.ts             案例数据
```
