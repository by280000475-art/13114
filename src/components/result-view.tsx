import {
  Clapperboard,
  ClipboardList,
  Image as ImageIcon,
  MessageCircle,
  PenLine,
  Quote,
} from "lucide-react";
import type { GeneratedContent } from "@/lib/content";

export function ResultView({ result }: { result: GeneratedContent }) {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-line bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardList className="size-5 text-brand" aria-hidden="true" />
          <h2 className="text-lg font-semibold">10 个选题</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {result.topics.map((topic, index) => (
            <div
              key={`${topic}-${index}`}
              className="rounded-lg border border-line bg-background p-3 text-sm leading-6"
            >
              <span className="mr-2 font-semibold text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              {topic}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-line bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <Quote className="size-5 text-accent" aria-hidden="true" />
          <h2 className="text-lg font-semibold">5 个爆款标题</h2>
        </div>
        <div className="space-y-2">
          {result.titles.map((title, index) => (
            <p
              key={`${title}-${index}`}
              className="rounded-lg bg-muted px-4 py-3 text-sm font-medium leading-6"
            >
              {title}
            </p>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-line bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <PenLine className="size-5 text-brand" aria-hidden="true" />
          <h2 className="text-lg font-semibold">短视频脚本</h2>
        </div>
        <div className="space-y-3 text-sm leading-7 text-ink-soft">
          <p>
            <span className="font-semibold text-foreground">开场钩子：</span>
            {result.script.hook}
          </p>
          {result.script.body.map((line, index) => (
            <p key={`${line}-${index}`}>
              <span className="font-semibold text-foreground">
                段落 {index + 1}：
              </span>
              {line}
            </p>
          ))}
          <p>
            <span className="font-semibold text-foreground">收尾 CTA：</span>
            {result.script.closing}
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <Clapperboard className="size-5 text-accent" aria-hidden="true" />
          <h2 className="text-lg font-semibold">分镜表</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="text-ink-soft">
              <tr>
                <th className="border-b border-line px-3 py-2 font-medium">
                  场景
                </th>
                <th className="border-b border-line px-3 py-2 font-medium">
                  画面
                </th>
                <th className="border-b border-line px-3 py-2 font-medium">
                  旁白
                </th>
                <th className="border-b border-line px-3 py-2 font-medium">
                  字幕
                </th>
                <th className="border-b border-line px-3 py-2 font-medium">
                  时长
                </th>
              </tr>
            </thead>
            <tbody>
              {result.storyboard.map((shot, index) => (
                <tr key={`${shot.scene}-${index}`} className="align-top">
                  <td className="border-b border-line px-3 py-3 font-medium">
                    {shot.scene}
                  </td>
                  <td className="border-b border-line px-3 py-3 text-ink-soft">
                    {shot.visual}
                  </td>
                  <td className="border-b border-line px-3 py-3 text-ink-soft">
                    {shot.narration}
                  </td>
                  <td className="border-b border-line px-3 py-3 text-ink-soft">
                    {shot.caption}
                  </td>
                  <td className="border-b border-line px-3 py-3 text-ink-soft">
                    {shot.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <ImageIcon className="size-5 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">封面文案</h2>
          </div>
          <div className="rounded-lg bg-foreground p-5 text-background">
            <p className="text-2xl font-semibold">{result.coverCopy.headline}</p>
            <p className="mt-2 text-sm text-background/75">
              {result.coverCopy.subline}
            </p>
            <p className="mt-5 inline-flex rounded-md bg-accent px-3 py-1 text-xs font-semibold text-white">
              {result.coverCopy.badge}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <MessageCircle className="size-5 text-accent" aria-hidden="true" />
            <h2 className="text-lg font-semibold">发布文案</h2>
          </div>
          <p className="text-sm leading-7 text-ink-soft">{result.publishCopy}</p>
        </section>
      </div>

      <section className="rounded-lg border border-line bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <MessageCircle className="size-5 text-brand" aria-hidden="true" />
          <h2 className="text-lg font-semibold">评论区互动话术</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {result.commentReplies.map((reply, index) => (
            <p
              key={`${reply}-${index}`}
              className="rounded-lg border border-line bg-background p-3 text-sm leading-6 text-ink-soft"
            >
              {reply}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
