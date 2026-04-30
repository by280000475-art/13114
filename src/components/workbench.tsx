"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Clock,
  Loader2,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { ResultView } from "@/components/result-view";
import { contentStyles, platforms } from "@/lib/content";
import type {
  GenerateInput,
  GeneratedContent,
  SavedGeneration,
} from "@/lib/content";

const storageKey = "mimo-creatorops-recent";

const initialInput: GenerateInput = {
  topic: "AI 创作者如何稳定产出一周 5 条内容",
  platform: "抖音",
  audience: "想提升内容效率的独立创作者和知识博主",
  style: "专业可信",
};

export function Workbench() {
  const [input, setInput] = useState<GenerateInput>(initialInput);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [recent, setRecent] = useState<SavedGeneration[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const cached = window.localStorage.getItem(storageKey);
      if (!cached) {
        return;
      }

      try {
        const parsed = JSON.parse(cached) as SavedGeneration[];
        setRecent(Array.isArray(parsed) ? parsed.slice(0, 5) : []);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const canSubmit = useMemo(
    () =>
      input.topic.trim().length > 0 &&
      input.platform.trim().length > 0 &&
      input.audience.trim().length > 0 &&
      input.style.trim().length > 0 &&
      !isLoading,
    [input, isLoading],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("请补全主题、平台、目标受众和内容风格。");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const payload = (await response.json()) as {
        result?: GeneratedContent;
        error?: string;
      };

      if (!response.ok || !payload.result) {
        throw new Error(payload.error || "生成失败，请稍后重试。");
      }

      setResult(payload.result);

      const nextItem: SavedGeneration = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        input,
        result: payload.result,
      };
      const nextRecent = [nextItem, ...recent].slice(0, 5);
      setRecent(nextRecent);
      window.localStorage.setItem(storageKey, JSON.stringify(nextRecent));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "生成失败，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  }

  function loadSaved(item: SavedGeneration) {
    setInput(item.input);
    setResult(item.result);
    setError("");
  }

  function clearRecent() {
    setRecent([]);
    window.localStorage.removeItem(storageKey);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[390px_1fr]">
      <aside className="h-fit rounded-lg border border-line bg-surface p-5">
        <div className="mb-5">
          <p className="text-sm font-semibold text-brand">Creator Brief</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            把一个主题变成完整发布包
          </h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium">主题</span>
            <textarea
              value={input.topic}
              onChange={(event) =>
                setInput((current) => ({
                  ...current,
                  topic: event.target.value,
                }))
              }
              className="mt-2 min-h-28 w-full resize-y rounded-lg border border-line bg-background px-3 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
              placeholder="例如：AI 创作者如何稳定产出一周 5 条内容"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <label className="block">
              <span className="text-sm font-medium">平台</span>
              <select
                value={input.platform}
                onChange={(event) =>
                  setInput((current) => ({
                    ...current,
                    platform: event.target.value,
                  }))
                }
                className="mt-2 h-11 w-full rounded-lg border border-line bg-background px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
              >
                {platforms.map((platform) => (
                  <option key={platform}>{platform}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">内容风格</span>
              <select
                value={input.style}
                onChange={(event) =>
                  setInput((current) => ({
                    ...current,
                    style: event.target.value,
                  }))
                }
                className="mt-2 h-11 w-full rounded-lg border border-line bg-background px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
              >
                {contentStyles.map((style) => (
                  <option key={style}>{style}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium">目标受众</span>
            <input
              value={input.audience}
              onChange={(event) =>
                setInput((current) => ({
                  ...current,
                  audience: event.target.value,
                }))
              }
              className="mt-2 h-11 w-full rounded-lg border border-line bg-background px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
              placeholder="例如：想提升内容效率的独立创作者"
            />
          </label>

          {error ? (
            <p className="rounded-lg border border-accent/25 bg-accent/10 px-3 py-2 text-sm text-[#9a321e]">
              {error}
            </p>
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="size-4" aria-hidden="true" />
              )}
              生成内容
            </button>
            <button
              type="button"
              onClick={() => {
                setInput(initialInput);
                setResult(null);
                setError("");
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-background text-ink-soft transition hover:border-brand hover:text-brand"
              aria-label="重置"
              title="重置"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          </div>
        </form>

        <div className="mt-8 border-t border-line pt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-brand" aria-hidden="true" />
              <h2 className="text-sm font-semibold">最近生成</h2>
            </div>
            {recent.length > 0 ? (
              <button
                type="button"
                onClick={clearRecent}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-ink-soft transition hover:bg-muted hover:text-foreground"
              >
                <Trash2 className="size-3" aria-hidden="true" />
                清空
              </button>
            ) : null}
          </div>

          <div className="space-y-2">
            {recent.length === 0 ? (
              <p className="rounded-lg bg-muted px-3 py-3 text-sm text-ink-soft">
                本地会保留最近 5 次生成结果。
              </p>
            ) : (
              recent.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => loadSaved(item)}
                  className="flex w-full items-start gap-3 rounded-lg border border-line bg-background p-3 text-left transition hover:border-brand"
                >
                  <Save
                    className="mt-1 size-4 shrink-0 text-brand"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="line-clamp-2 text-sm font-medium">
                      {item.input.topic}
                    </span>
                    <span className="mt-1 block text-xs text-ink-soft">
                      {new Date(item.createdAt).toLocaleString("zh-CN", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" · "}
                      {item.input.platform}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </aside>

      <section className="min-w-0">
        {result ? (
          <ResultView result={result} />
        ) : (
          <div className="grid min-h-[620px] place-items-center rounded-lg border border-dashed border-line bg-surface p-8 text-center">
            <div className="max-w-md">
              <div className="mx-auto grid size-12 place-items-center rounded-lg bg-muted text-brand">
                <Sparkles className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-semibold">等待生成结果</h2>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                生成后会按选题、标题、脚本、分镜、封面、发布文案和评论话术分区展示，并自动写入本地历史。
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
