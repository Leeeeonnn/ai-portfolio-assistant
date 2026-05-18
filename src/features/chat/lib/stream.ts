import type { DifyStreamEvent } from "@/features/chat/types";

export async function readDifyStream(
  response: Response,
  handlers: {
    onAnswer: (chunk: string) => void;
    onConversationId: (conversationId: string) => void;
  },
) {
  if (!response.body) {
    throw new Error("浏览器没有收到可读取的流式响应。");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const eventText of events) {
      const dataLine = eventText
        .split("\n")
        .find((line) => line.startsWith("data:"));

      if (!dataLine) {
        continue;
      }

      const payload = dataLine.replace(/^data:\s*/, "");

      if (payload === "[DONE]") {
        return;
      }

      const event = JSON.parse(payload) as DifyStreamEvent;

      if (event.conversation_id) {
        handlers.onConversationId(event.conversation_id);
      }

      if (event.answer) {
        handlers.onAnswer(event.answer);
      }

      if (event.event === "error" || event.error) {
        throw new Error(event.error || "Dify 返回了错误事件。");
      }
    }
  }
}
