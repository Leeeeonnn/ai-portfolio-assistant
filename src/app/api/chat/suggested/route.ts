import { NextRequest } from "next/server";
import { z } from "zod";
import { getDifyConfig } from "@/features/chat/server/dify";

export const runtime = "nodejs";

const suggestedRequestSchema = z.object({
  messageId: z.string().trim().min(1),
});

type DifySuggestedQuestionsResponse = {
  data?: unknown;
  error?: string;
  message?: string;
};

export async function GET(request: NextRequest) {
  const parsed = suggestedRequestSchema.safeParse({
    messageId: request.nextUrl.searchParams.get("messageId"),
  });

  if (!parsed.success) {
    return Response.json(
      { error: "缺少有效的 messageId。" },
      { status: 400 },
    );
  }

  const config = getDifyConfig();

  if (!config.apiKey) {
    return Response.json(
      { error: "服务端尚未配置 DIFY_API_KEY，请先填写 .env.local。" },
      { status: 500 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  const suggestedUrl = new URL(
    `${config.baseUrl}/messages/${encodeURIComponent(parsed.data.messageId)}/suggested`,
  );
  suggestedUrl.searchParams.set("user", config.defaultUserId);

  try {
    const difyResponse = await fetch(suggestedUrl, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
      signal: controller.signal,
    });

    const payload = (await difyResponse
      .json()
      .catch(() => null)) as DifySuggestedQuestionsResponse | null;

    if (!difyResponse.ok) {
      console.error("Dify suggested questions request failed", {
        status: difyResponse.status,
        body: payload,
      });

      return Response.json(
        { error: `Dify 推荐问题请求失败，状态码：${difyResponse.status}` },
        { status: difyResponse.status || 502 },
      );
    }

    return Response.json({
      questions: normalizeQuestions(payload?.data),
    });
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "AbortError"
        ? "Dify 推荐问题请求超时，请稍后重试。"
        : "推荐问题暂时不可用，请稍后重试。";

    return Response.json({ error: message }, { status: 504 });
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeQuestions(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((question): question is string => typeof question === "string")
    .map((question) => question.trim())
    .filter(Boolean)
    .slice(0, 3);
}
