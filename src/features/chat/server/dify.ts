type DifyConfig = {
  apiKey: string;
  baseUrl: string;
  responseMode: "streaming" | "blocking";
  timeoutMs: number;
  defaultUserId: string;
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
  };
}

export function buildDifyChatRequest(
  input: BuildDifyChatRequestInput,
  config: DifyConfig,
) {
  return {
    inputs: {},
    query: input.query,
    response_mode: config.responseMode,
    conversation_id: input.conversationId || undefined,
    user: input.user || config.defaultUserId,
    auto_generate_name: false,
  };
}
