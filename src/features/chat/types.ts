export type ChatRole = "assistant" | "user";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  status?: "sending" | "complete" | "error";
  suggestedQuestions?: string[];
};

export type DifyStreamEvent = {
  event?: string;
  answer?: string;
  suggested_questions?: unknown;
  metadata?: {
    suggested_questions?: unknown;
  };
  conversation_id?: string;
  task_id?: string;
  message_id?: string;
  error?: string;
  message?: string;
  data?: {
    error?: string;
    message?: string;
    node_type?: string;
    outputs?: {
      answer?: string;
      text?: string;
    } & Record<string, unknown>;
    metadata?: {
      suggested_questions?: unknown;
    };
  };
};

export type DifyBlockingResponse = {
  answer?: string;
  suggested_questions?: unknown;
  metadata?: {
    suggested_questions?: unknown;
  };
  conversation_id?: string;
  message_id?: string;
  error?: string;
  message?: string;
};
