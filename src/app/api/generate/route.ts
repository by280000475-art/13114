import type {
  GenerateInput,
  GeneratedContent,
  StoryboardShot,
} from "@/lib/content";

export const runtime = "nodejs";

type MimoMessage = {
  role: "system" | "user";
  content: string;
};

type MimoResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export async function POST(request: Request) {
  let input: GenerateInput;

  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "请求体不是有效 JSON。" }, { status: 400 });
  }

  const validationError = validateInput(input);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  const apiKey = process.env.XIAOMI_MIMO_API_KEY;
  const baseUrl = process.env.XIAOMI_MIMO_BASE_URL;
  const model = process.env.XIAOMI_MIMO_MODEL;

  if (!apiKey || !baseUrl || !model) {
    return Response.json(
      {
        error:
          "缺少 MiMo 环境变量，请配置 XIAOMI_MIMO_API_KEY、XIAOMI_MIMO_BASE_URL 和 XIAOMI_MIMO_MODEL。",
      },
      { status: 500 },
    );
  }

  const endpoint = normalizeEndpoint(baseUrl);
  const messages = buildMessages(input);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "api-key": apiKey,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.72,
        top_p: 0.9,
        stream: false,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text();
      return Response.json(
        {
          error: `MiMo API 调用失败：${response.status} ${response.statusText}`,
          detail: detail.slice(0, 800),
        },
        { status: 502 },
      );
    }

    const data = (await response.json()) as MimoResponse;
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return Response.json(
        { error: "MiMo API 没有返回可解析的内容。" },
        { status: 502 },
      );
    }

    const result = normalizeGeneratedContent(parseJsonContent(content));
    return Response.json({ result });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? `MiMo API 请求异常：${error.message}`
            : "MiMo API 请求异常。",
      },
      { status: 502 },
    );
  }
}

function validateInput(value: GenerateInput) {
  if (!isRecord(value)) {
    return "请求参数无效。";
  }

  const requiredFields: Array<keyof GenerateInput> = [
    "topic",
    "platform",
    "audience",
    "style",
  ];

  for (const field of requiredFields) {
    if (typeof value[field] !== "string" || value[field].trim().length === 0) {
      return `缺少 ${field}。`;
    }
  }

  return "";
}

function normalizeEndpoint(baseUrl: string) {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  if (trimmed.endsWith("/chat/completions")) {
    return trimmed;
  }
  return `${trimmed}/chat/completions`;
}

function buildMessages(input: GenerateInput): MimoMessage[] {
  return [
    {
      role: "system",
      content:
        "你是 MiMo CreatorOps 的资深内容策略引擎，擅长为中文内容创作者生成可执行的结构化内容方案。只返回 JSON，不要返回 Markdown、代码块或解释。",
    },
    {
      role: "user",
      content: `请基于以下创作简报，生成一份可直接发布前生产的内容包。

主题：${input.topic}
平台：${input.platform}
目标受众：${input.audience}
内容风格：${input.style}

必须返回严格 JSON，字段和类型如下：
{
  "topics": ["10 个选题，每个 18-36 个中文字符"],
  "titles": ["5 个爆款标题，每个标题要有明确点击理由"],
  "script": {
    "hook": "1 句 3 秒开场钩子",
    "body": ["3-5 个脚本段落，每段包含观点或动作"],
    "closing": "1 句收尾 CTA"
  },
  "storyboard": [
    {
      "scene": "场景名称",
      "visual": "画面说明",
      "narration": "旁白",
      "caption": "屏幕字幕",
      "duration": "时长，例如 0-3s"
    }
  ],
  "coverCopy": {
    "headline": "封面主标题",
    "subline": "封面副标题",
    "badge": "角标文案"
  },
  "publishCopy": "平台发布文案，包含价值点和轻 CTA",
  "commentReplies": ["4-6 条评论区互动话术"]
}

要求：topics 必须正好 10 条，titles 必须正好 5 条，storyboard 至少 4 行。`,
    },
  ];
}

function parseJsonContent(content: string) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced?.[1]?.trim() ?? trimmed;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("模型返回内容不是 JSON 对象。");
  }

  return JSON.parse(raw.slice(start, end + 1)) as unknown;
}

function normalizeGeneratedContent(value: unknown): GeneratedContent {
  if (!isRecord(value)) {
    throw new Error("模型返回 JSON 不是对象。");
  }

  const script = isRecord(value.script) ? value.script : {};
  const coverCopy = isRecord(value.coverCopy) ? value.coverCopy : {};

  return {
    topics: stringArray(value.topics, 10, "选题"),
    titles: stringArray(value.titles, 5, "标题"),
    script: {
      hook: stringValue(script.hook, "补充 3 秒开场钩子"),
      body: stringArray(script.body, 3, "脚本段落"),
      closing: stringValue(script.closing, "引导评论、收藏或关注。"),
    },
    storyboard: storyboardArray(value.storyboard),
    coverCopy: {
      headline: stringValue(coverCopy.headline, "封面主标题"),
      subline: stringValue(coverCopy.subline, "封面副标题"),
      badge: stringValue(coverCopy.badge, "内容亮点"),
    },
    publishCopy: stringValue(value.publishCopy, "补充平台发布文案。"),
    commentReplies: stringArray(value.commentReplies, 4, "评论区互动话术"),
  };
}

function storyboardArray(value: unknown): StoryboardShot[] {
  const source = Array.isArray(value) ? value : [];
  const normalized = source.filter(isRecord).map((item, index) => ({
    scene: stringValue(item.scene, `场景 ${index + 1}`),
    visual: stringValue(item.visual, "补充画面说明"),
    narration: stringValue(item.narration, "补充旁白"),
    caption: stringValue(item.caption, "补充字幕"),
    duration: stringValue(item.duration, `${index * 8}-${index * 8 + 7}s`),
  }));

  while (normalized.length < 4) {
    const index = normalized.length;
    normalized.push({
      scene: `场景 ${index + 1}`,
      visual: "补充分镜画面",
      narration: "补充分镜旁白",
      caption: "补充屏幕字幕",
      duration: `${index * 8}-${index * 8 + 7}s`,
    });
  }

  return normalized;
}

function stringArray(value: unknown, length: number, label: string) {
  const source = Array.isArray(value) ? value : [];
  const normalized = source
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, length);

  while (normalized.length < length) {
    normalized.push(`${label} ${normalized.length + 1}`);
  }

  return normalized;
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
