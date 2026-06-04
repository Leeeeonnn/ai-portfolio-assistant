import type {
  DifyBlockingResponse,
  DifyStreamEvent,
} from "@/features/chat/types";

export async function readDifyStream(
  response: Response,
  handlers: {
    onAnswer: (chunk: string) => void;
    onConversationId: (conversationId: string) => void;
    onMessageId?: (messageId: string) => void;
    onSuggestedQuestions?: (questions: string[]) => void;
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

    if (payload.message_id) {
      handlers.onMessageId?.(payload.message_id);
    }

    if (payload.error || payload.message) {
      throw new Error(payload.error || payload.message);
    }

    if (payload.answer) {
      handlers.onAnswer(payload.answer);
    }

    const blockingSuggestions = extractSuggestedQuestions(payload);

    if (blockingSuggestions.length) {
      handlers.onSuggestedQuestions?.(blockingSuggestions);
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

    if (event.message_id) {
      handlers.onMessageId?.(event.message_id);
    }

    if (event.task_id) {
      handlers.onTaskId?.(event.task_id);
    }

    const suggestedQuestions = extractSuggestedQuestions(event);

    if (suggestedQuestions.length) {
      handlers.onSuggestedQuestions?.(suggestedQuestions);
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

type SuggestionSource = DifyBlockingResponse | DifyStreamEvent;

function extractSuggestedQuestions(source: SuggestionSource) {
  const possibleSources = [
    source.suggested_questions,
    source.metadata?.suggested_questions,
    "data" in source ? source.data?.metadata?.suggested_questions : undefined,
    "data" in source ? source.data?.outputs?.suggested_questions : undefined,
    "data" in source ? source.data?.outputs?.suggestedQuestions : undefined,
    "data" in source ? source.data?.outputs?.next_questions : undefined,
    "data" in source ? source.data?.outputs?.nextQuestions : undefined,
    "data" in source ? source.data?.outputs?.follow_up_questions : undefined,
    "data" in source ? source.data?.outputs?.followUpQuestions : undefined,
    "data" in source ? source.data?.outputs?.questions : undefined,
  ];

  return uniqueQuestions(possibleSources.flatMap(coerceSuggestedQuestions));
}

function coerceSuggestedQuestions(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(coerceSuggestedQuestions);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        return coerceSuggestedQuestions(JSON.parse(trimmed) as unknown);
      } catch {
        return [trimmed];
      }
    }

    return trimmed
      .split(/\n+/)
      .map((line) => line.replace(/^\s*[-*•\d.、)]+\s*/, "").trim())
      .filter(Boolean);
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    return [
      record.question,
      record.text,
      record.content,
      record.suggested_questions,
      record.suggestedQuestions,
      record.next_questions,
      record.nextQuestions,
      record.follow_up_questions,
      record.followUpQuestions,
      record.questions,
    ].flatMap(coerceSuggestedQuestions);
  }

  return [];
}

function uniqueQuestions(questions: string[]) {
  const seen = new Set<string>();

  return questions
    .map((question) => question.trim())
    .filter((question) => {
      if (!question || seen.has(question)) {
        return false;
      }

      seen.add(question);
      return true;
    })
    .slice(0, 3);
}
