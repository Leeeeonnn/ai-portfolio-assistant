import type {
  DifyBlockingResponse,
  DifyStreamEvent,
} from "@/features/chat/types";

export async function readDifyStream(
  response: Response,
  handlers: {
    onAnswer: (chunk: string) => void;
    onConversationId: (conversationId: string) => void;
    onTaskId?: (taskId: string) => void;
  },
) {
  if (!response.body) {
    throw new Error("浏览器没有收到可读取的流式响应。");
  }

  const contentType = response.headers.get("Content-Type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await response.json()) as DifyBlockingResponse;

    if (payload.conversation_id) {
      handlers.onConversationId(payload.conversation_id);
    }

    if (payload.error || payload.message) {
      throw new Error(payload.error || payload.message);
    }

    if (payload.answer) {
      handlers.onAnswer(payload.answer);
    }

    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let hasEmittedAnswer = false;

  function processEvent(eventText: string) {
    const dataLine = eventText
      .split("\n")
      .find((line) => line.startsWith("data:"));

    if (!dataLine) {
      return false;
    }

    const payload = dataLine.replace(/^data:\s*/, "");

    if (payload === "[DONE]") {
      return true;
    }

    let event: DifyStreamEvent;

    try {
      event = JSON.parse(payload) as DifyStreamEvent;
    } catch {
      return false;
    }

    if (event.conversation_id) {
      handlers.onConversationId(event.conversation_id);
    }

    if (event.task_id) {
      handlers.onTaskId?.(event.task_id);
    }

    const errorMessage =
      event.error || event.message || event.data?.error || event.data?.message;

    if (event.event === "error" || errorMessage) {
      throw new Error(errorMessage || "Dify 返回了错误事件。");
    }

    const workflowAnswer =
      event.event === "workflow_finished"
        ? event.data?.outputs?.answer
        : undefined;
    const answerNodeText =
      event.event === "node_finished" && event.data?.node_type === "answer"
        ? event.data.outputs?.answer || event.data.outputs?.text
        : undefined;
    const answer =
      event.answer ||
      (!hasEmittedAnswer ? answerNodeText || workflowAnswer : undefined);

    if (answer) {
      hasEmittedAnswer = true;
      handlers.onAnswer(answer);
    }

    return false;
  }

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const eventText of events) {
      if (processEvent(eventText)) {
        return;
      }
    }
  }

  const trailingEvent = `${buffer}${decoder.decode()}`.trim();

  if (trailingEvent) {
    processEvent(trailingEvent);
  }
}
