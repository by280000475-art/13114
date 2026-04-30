import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { ResultView } from "@/components/result-view";
import { SiteShell } from "@/components/site-shell";
import { caseStudies } from "@/lib/examples";

export default function CasesPage() {
  return (
    <SiteShell>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-sm font-semibold text-brand">
              <Layers className="size-4" aria-hidden="true" />
              Case Library
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              用真实创作场景看工作台输出
            </h1>
          </div>
          <div className="text-base leading-8 text-ink-soft">
            MiMo CreatorOps
            面向短视频、图文和知识内容生产，把创作简报转成可执行发布包。下面是适合活动申请材料展示的三组样例。
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <article
              key={study.title}
              className="rounded-lg border border-line bg-surface p-5"
            >
              <p className="text-sm font-semibold text-brand">{study.platform}</p>
              <h2 className="mt-3 text-xl font-semibold">{study.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                {study.audience}
              </p>
              <p className="mt-4 inline-flex rounded-md bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                {study.style}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <ResultView result={caseStudies[0].result} />
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/create"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-brand"
          >
            打开创作台
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
