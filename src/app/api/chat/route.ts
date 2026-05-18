import { NextRequest } from "next/server";
import { z } from "zod";
import { buildDifyChatRequest, getDifyConfig } from "@/features/chat/server/dify";

export const runtime = "nodejs";

const chatRequestSchema = z.object({
  query: z.string().trim().min(1).max(4000),
  conversationId: z.string().optional(),
  user: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = chatRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "请输入有效的问题内容。" },
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

  try {
    const difyResponse = await fetch(`${config.baseUrl}/chat-messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildDifyChatRequest(parsed.data, config)),
      signal: controller.signal,
    });

    if (!difyResponse.ok || !difyResponse.body) {
      const errorText = await difyResponse.text().catch(() => "");
      return Response.json(
        {
          error:
            errorText ||
            `Dify 请求失败，状态码：${difyResponse.status}`,
        },
        { status: difyResponse.status || 502 },
      );
    }

    return new Response(difyResponse.body, {
      headers: {
        "Cache-Control": "no-cache, no-transform",
        "Content-Type":
          difyResponse.headers.get("Content-Type") || "text/event-stream",
      },
    });
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "AbortError"
        ? "Dify 请求超时，请稍后重试。"
        : "AI 服务暂时不可用，请稍后重试。";

    return Response.json({ error: message }, { status: 504 });
  } finally {
    clearTimeout(timeout);
  }
}
