export type ChatRole = "assistant" | "user";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type DifyStreamEvent = {
  event?: string;
  answer?: string;
  conversation_id?: string;
  message_id?: string;
  error?: string;
};
