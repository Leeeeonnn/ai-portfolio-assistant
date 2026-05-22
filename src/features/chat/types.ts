export type ChatRole = "assistant" | "user";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  status?: "sending" | "complete" | "error";
};

export type DifyStreamEvent = {
  event?: string;
  answer?: string;
  conversation_id?: string;
  task_id?: string;
  message_id?: string;
  error?: string;
  message?: string;
  data?: {
    error?: string;
    message?: string;
  };
};

export type DifyBlockingResponse = {
  answer?: string;
  conversation_id?: string;
  message_id?: string;
  error?: string;
  message?: string;
};
