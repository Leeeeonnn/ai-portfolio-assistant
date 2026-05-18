"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { readDifyStream } from "@/features/chat/lib/stream";
import type { ChatMessage } from "@/features/chat/types";

type PortfolioChatProps = {
  quickQuestions: string[];
};

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "你好，我是这个作品集的 AI 助手。你可以问我关于经历、项目、技能、协作方式或联系方式的问题。",
};

export function PortfolioChat({ quickQuestions }: PortfolioChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string>();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string>();
  const abortRef = useRef<AbortController | null>(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isSending,
    [input, isSending],
  );

  async function sendMessage(question: string) {
    const query = question.trim();

    if (!query || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
    };
    const assistantMessageId = crypto.randomUUID();

    setError(undefined);
    setInput("");
    setIsSending(true);
    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantMessageId, role: "assistant", content: "" },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          conversationId,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(errorBody?.error || "发送失败，请稍后重试。");
      }

      await readDifyStream(response, {
        onAnswer: (chunk) => {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantMessageId
                ? { ...message, content: message.content + chunk }
                : message,
            ),
          );
        },
        onConversationId: setConversationId,
      });
    } catch (caughtError) {
      if (caughtError instanceof DOMException && caughtError.name === "AbortError") {
        setError("已停止本次回复。");
      } else {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "AI 服务暂时不可用，请稍后重试。",
        );
      }
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessageId && !message.content
            ? { ...message, content: "抱歉，这次没有成功获取回复。" }
            : message,
        ),
      );
    } finally {
      setIsSending(false);
      abortRef.current = null;
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function stopStreaming() {
    abortRef.current?.abort();
  }

  return (
    <div className="grid flex-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="flex flex-col gap-3">
        <div className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles size={16} />
            快速提问
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {quickQuestions.map((question) => (
              <button
                className="rounded-md border border-[var(--line)] px-3 py-2 text-left text-sm leading-6 text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-60"
                disabled={isSending}
                key={question}
                onClick={() => void sendMessage(question)}
                type="button"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="flex min-h-[560px] flex-col rounded-md border border-[var(--line)] bg-[var(--panel)]">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.map((message) => (
            <article
              className={
                message.role === "user"
                  ? "ml-auto max-w-[82%] rounded-md bg-[var(--accent)] px-4 py-3 text-[var(--accent-ink)]"
                  : "mr-auto max-w-[82%] rounded-md border border-[var(--line)] px-4 py-3 text-[var(--foreground)]"
              }
              key={message.id}
            >
              <p className="whitespace-pre-wrap text-sm leading-7">
                {message.content ||
                  (message.role === "assistant" ? "正在思考..." : "")}
              </p>
            </article>
          ))}
        </div>

        {error ? (
          <p className="border-t border-[var(--line)] px-4 py-2 text-sm text-[var(--danger)]">
            {error}
          </p>
        ) : null}

        <form
          className="flex gap-2 border-t border-[var(--line)] p-3 sm:p-4"
          onSubmit={handleSubmit}
        >
          <textarea
            className="min-h-12 flex-1 resize-none rounded-md border border-[var(--line)] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[var(--accent)]"
            onChange={(event) => setInput(event.target.value)}
            placeholder="输入你想了解的问题..."
            rows={1}
            value={input}
          />
          {isSending ? (
            <button
              className="rounded-md border border-[var(--line)] px-4 text-sm font-medium"
              onClick={stopStreaming}
              type="button"
            >
              停止
            </button>
          ) : null}
          <button
            aria-label="发送问题"
            className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-ink)] transition hover:brightness-95 disabled:opacity-50"
            disabled={!canSend}
            type="submit"
          >
            {isSending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
