type DifyConfig = {
  apiKey: string;
  baseUrl: string;
  responseMode: "streaming" | "blocking";
  timeoutMs: number;
  defaultUserId: string;
  assistantIdentity: string;
  privacyBoundary: string;
};

type BuildDifyChatRequestInput = {
  query: string;
  conversationId?: string;
  user?: string;
};

export function getDifyConfig(): DifyConfig {
  return {
    apiKey: process.env.DIFY_API_KEY ?? "",
    baseUrl: process.env.DIFY_API_BASE_URL ?? "https://api.dify.ai/v1",
    responseMode:
      process.env.DIFY_RESPONSE_MODE === "blocking" ? "blocking" : "streaming",
    timeoutMs: Number(process.env.CHAT_REQUEST_TIMEOUT_MS ?? 45000),
    defaultUserId: process.env.DIFY_USER_ID ?? "portfolio-visitor",
    assistantIdentity:
      process.env.CHAT_ASSISTANT_IDENTITY ??
      "Leon's AI portfolio assistant based on public portfolio materials and processed communication-style summaries.",
    privacyBoundary:
      process.env.CHAT_PRIVACY_BOUNDARY ??
      "Do not claim to be the real Leon. Do not reveal private chat records, raw WeChat history, personal identifiers, or sensitive information unless it is intentionally present in the portfolio knowledge base.",
  };
}

export function buildDifyChatRequest(
  input: BuildDifyChatRequestInput,
  config: DifyConfig,
) {
  return {
    inputs: {
      assistant_identity: config.assistantIdentity,
      privacy_boundary: config.privacyBoundary,
      source_policy:
        "Use only the Dify knowledge base, public portfolio materials, and processed personality summaries. Never expose raw source conversations.",
    },
    query: input.query,
    response_mode: config.responseMode,
    conversation_id: input.conversationId || undefined,
    user: input.user || config.defaultUserId,
    auto_generate_name: false,
  };
}
