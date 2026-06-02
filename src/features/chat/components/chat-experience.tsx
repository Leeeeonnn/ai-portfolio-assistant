"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { readDifyStream } from "@/features/chat/lib/stream";
import { MarkdownRenderer } from "@/features/chat/components/markdown-renderer";
import type { ChatMessage } from "@/features/chat/types";
import { figmaAssets } from "@/features/portfolio/data";
import { QuestionComposer } from "@/features/portfolio/components/question-composer";
import { SiteHeader } from "@/features/portfolio/components/site-header";

type ChatExperienceProps = {
  initialQuestion: string;
};

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "",
  status: "complete",
};

export function ChatExperience({ initialQuestion }: ChatExperienceProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [conversationId, setConversationId] = useState<string>();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string>();
  const [lastFailedQuery, setLastFailedQuery] = useState<string>();
  const abortRef = useRef<AbortController | null>(null);
  const taskIdRef = useRef<string | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const initialQuestionRef = useRef(initialQuestion);
  const hasSentInitialQuestionRef = useRef(false);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  useEffect(() => {
    const question = initialQuestionRef.current.trim();

    if (question && !hasSentInitialQuestionRef.current) {
      hasSentInitialQuestionRef.current = true;
      void sendMessage(question);
      router.replace("/chat");
    }
    // sendMessage intentionally stays outside dependencies for one-time boot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function sendMessage(question: string) {
    const query = question.trim();

    if (!query || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
      status: "complete",
    };
    const assistantMessageId = crypto.randomUUID();

    setError(undefined);
    setLastFailedQuery(undefined);
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
    <main className="figma-page figma-chat-page" data-node-id="4:231">
      <SiteHeader />

      <section className="figma-chat-main" data-node-id="4:245">
        <div className="figma-chat-log" aria-live="polite" data-node-id="4:246">
          {messages
            .filter((message) => message.content || message.status === "sending")
            .map((message) => (
              <article
                className={`figma-chat-message figma-chat-${message.role}`}
                key={message.id}
              >
                {message.role === "user" ? (
                  <div className="figma-user-bubble">
                    <p>{message.content}</p>
                  </div>
                ) : (
                  <div className="figma-answer-text">
                    {message.content ? (
                      <MarkdownRenderer content={message.content} />
                    ) : (
                      <ThinkingIndicator />
                    )}
                  </div>
                )}
              </article>
            ))}
          <div ref={scrollAnchorRef} />
        </div>

        {error ? (
          <div className="figma-chat-error">
            <p>{error}</p>
            {lastFailedQuery ? (
              <button
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
      </section>

      <section className="figma-conversation-chat" data-node-id="4:252">
        {isSending ? (
          <button className="figma-stop-button" onClick={stopStreaming} type="button">
            停止
          </button>
        ) : null}
        <div className="figma-input-area">
          <QuestionComposer
            disabled={isSending}
            onSubmit={(question) => void sendMessage(question)}
          />
          <p>仅作为能力展示，重要信息请联系本人核查。</p>
        </div>
      </section>
    </main>
  );
}

function ThinkingIndicator() {
  return (
    <div className="figma-thinking">
      <img alt="" height={16} src={figmaAssets.chatLoading} width={16} />
      <span className="shiny-text">Hmm…稍等我组织一下语言</span>
    </div>
  );
}
