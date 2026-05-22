import { NextRequest } from "next/server";
import { z } from "zod";
import { getDifyConfig } from "@/features/chat/server/dify";

export const runtime = "nodejs";

const stopRequestSchema = z.object({
  taskId: z.string().trim().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = stopRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "缺少需要停止的任务 ID。" }, { status: 400 });
  }

  const config = getDifyConfig();

  if (!config.apiKey) {
    return Response.json(
      { error: "服务端尚未配置 DIFY_API_KEY，请先填写 .env.local。" },
      { status: 500 },
    );
  }

  try {
    const difyResponse = await fetch(
      `${config.baseUrl}/chat-messages/${parsed.data.taskId}/stop`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: config.defaultUserId }),
      },
    );

    if (!difyResponse.ok) {
      return Response.json(
        { error: `停止 Dify 任务失败，状态码：${difyResponse.status}` },
        { status: difyResponse.status || 502 },
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "AI 服务暂时不可用，请稍后重试。" },
      { status: 504 },
    );
  }
}
