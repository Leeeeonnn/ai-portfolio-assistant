"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, RefreshCw, Send, Sparkles } from "lucide-react";
import { readDifyStream } from "@/features/chat/lib/stream";
import type { ChatMessage } from "@/features/chat/types";

type PortfolioChatProps = {
  quickQuestions: string[];
};

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "你好，我是 Leon 的 AI 作品集助手，基于公开作品集材料和处理后的沟通风格摘要回答。你可以问我关于经历、项目、技能、协作方式或联系方式的问题。",
  status: "complete",
};

export function PortfolioChat({ quickQuestions }: PortfolioChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string>();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string>();
  const [lastFailedQuery, setLastFailedQuery] = useState<string>();
  const abortRef = useRef<AbortController | null>(null);
  const taskIdRef = useRef<string | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isSending,
    [input, isSending],
  );

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

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
    setLastFailedQuery(undefined);
    setInput("");
    setIsSending(true);
    setMessages((current) => [
      ...current,
      userMessage,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        status: "sending",
      },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;
    taskIdRef.current = null;

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
        onTaskId: (taskId) => {
          taskIdRef.current = taskId;
        },
      });

      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessageId
            ? { ...message, status: "complete" }
            : message,
        ),
      );
    } catch (caughtError) {
      if (caughtError instanceof DOMException && caughtError.name === "AbortError") {
        setError("已停止本次回复。");
      } else {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "AI 服务暂时不可用，请稍后重试。",
        );
        setLastFailedQuery(query);
      }
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessageId && !message.content
            ? {
                ...message,
                content: "抱歉，这次没有成功获取回复。",
                status: "error",
              }
            : message.id === assistantMessageId
              ? { ...message, status: "error" }
            : message,
        ),
      );
    } finally {
      setIsSending(false);
      abortRef.current = null;
      taskIdRef.current = null;
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function stopStreaming() {
    const taskId = taskIdRef.current;

    if (taskId) {
      void fetch("/api/chat/stop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId }),
      });
    }

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
        <p className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-4 text-sm leading-6 text-[var(--muted)]">
          助手不会展示原始微信聊天记录，也不会声称自己是真实的 Leon。
        </p>
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
                  (message.role === "assistant" ? "正在组织回复..." : "")}
              </p>
            </article>
          ))}
          <div ref={scrollAnchorRef} />
        </div>

        {error ? (
          <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] px-4 py-2 text-sm text-[var(--danger)]">
            <p>{error}</p>
            {lastFailedQuery ? (
              <button
                className="inline-flex items-center gap-2 rounded-md border border-[var(--line)] px-3 py-2 text-[var(--foreground)]"
                disabled={isSending}
                onClick={() => void sendMessage(lastFailedQuery)}
                type="button"
              >
                <RefreshCw size={14} />
                重试
              </button>
            ) : null}
          </div>
        ) : null}

        <form
          className="flex gap-2 border-t border-[var(--line)] p-3 sm:p-4"
          onSubmit={handleSubmit}
        >
          <textarea
            className="min-h-12 flex-1 resize-none rounded-md border border-[var(--line)] px-3 py-3 text-sm leading-6 outline-none transition focus:border-[var(--accent)]"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void sendMessage(input);
              }
            }}
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
