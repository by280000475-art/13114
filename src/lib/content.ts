export type GenerateInput = {
  topic: string;
  platform: string;
  audience: string;
  style: string;
};

export type StoryboardShot = {
  scene: string;
  visual: string;
  narration: string;
  caption: string;
  duration: string;
};

export type GeneratedContent = {
  topics: string[];
  titles: string[];
  script: {
    hook: string;
    body: string[];
    closing: string;
  };
  storyboard: StoryboardShot[];
  coverCopy: {
    headline: string;
    subline: string;
    badge: string;
  };
  publishCopy: string;
  commentReplies: string[];
};

export type SavedGeneration = {
  id: string;
  createdAt: string;
  input: GenerateInput;
  result: GeneratedContent;
};

export const platforms = [
  "抖音",
  "小红书",
  "视频号",
  "B站",
  "公众号",
  "知乎",
] as const;

export const contentStyles = [
  "专业可信",
  "轻松口语",
  "犀利观点",
  "温暖陪伴",
  "高转化种草",
  "知识拆解",
] as const;
