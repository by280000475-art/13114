import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clapperboard,
  FileText,
  MessageSquareText,
  PenTool,
  Sparkles,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";

export default function Home() {
  return (
    <SiteShell>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="inline-flex w-fit items-center gap-2 rounded-md bg-muted px-3 py-1 text-sm font-semibold text-brand">
              <Sparkles className="size-4" aria-hidden="true" />
              Xiaomi MiMo powered MVP
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
              MiMo CreatorOps
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft">
              面向内容创作者的 AI
              内容生产工作台，从主题、平台、受众和风格出发，一次生成选题、标题、脚本、分镜、封面和互动话术。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/create"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-brand"
              >
                开始创作
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/cases"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-line bg-background px-5 text-sm font-semibold transition hover:border-brand hover:text-brand"
              >
                查看案例
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-background p-4">
            <div className="rounded-lg border border-line bg-surface p-4">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <p className="text-sm font-semibold text-brand">
                    AI 内容生成流水线
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    brief -&gt; strategy -&gt; publish kit
                  </p>
                </div>
                <span className="rounded-md bg-[#f4df52] px-3 py-1 text-xs font-semibold text-foreground">
                  Live
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["主题", "AI 创作者稳定周更"],
                  ["平台", "抖音 / 小红书"],
                  ["受众", "独立创作者"],
                  ["风格", "专业可信"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-ink-soft">{label}</p>
                    <p className="mt-1 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                {[
                  ["10 个选题", "从受众痛点拆出可连续发布的内容角度"],
                  ["5 个标题", "适配平台点击逻辑和信息差表达"],
                  ["短视频脚本", "钩子、段落、收尾 CTA 一次成型"],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="flex gap-3 rounded-lg border border-line bg-background p-3"
                  >
                    <BadgeCheck
                      className="mt-1 size-4 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-ink-soft">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: PenTool,
              title: "选题策略",
              text: "围绕主题和受众拆解 10 个可发布方向。",
            },
            {
              icon: FileText,
              title: "脚本文案",
              text: "生成短视频脚本、封面文案和发布文案。",
            },
            {
              icon: Clapperboard,
              title: "分镜规划",
              text: "把口播或剧情内容转成可拍摄镜头表。",
            },
            {
              icon: MessageSquareText,
              title: "互动话术",
              text: "提前准备评论区承接和二次转化回应。",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-line bg-surface p-5"
            >
              <item.icon className="size-5 text-brand" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
