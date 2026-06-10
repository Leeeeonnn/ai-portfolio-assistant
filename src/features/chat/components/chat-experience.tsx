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
import { trackEvent } from "@/features/analytics/umami";
import {
  getPresetAnswer,
  presetAnswerDelayMs,
  presetAnswerSuggestedQuestions,
} from "@/features/chat/data/preset-answers";

type ChatExperienceProps = {
  initialQuestion: string;
  initialQuestionMode?: "dify" | "preset";
};

const answerRiskText =
  "⚠️ 本站为个人工程实验项目，知识库召回能力有限，AI 回答可能存在事实偏差或幻觉，重要信息请以正式简历为准。";

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "",
  status: "complete",
};

export function ChatExperience({
  initialQuestion,
  initialQuestionMode = "dify",
}: ChatExperienceProps) {
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
  const initialQuestionModeRef = useRef(initialQuestionMode);
  const hasSentInitialQuestionRef = useRef(false);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  useEffect(() => {
    const question = initialQuestionRef.current.trim();

    if (question && !hasSentInitialQuestionRef.current) {
      hasSentInitialQuestionRef.current = true;
      void sendMessage(question, {
        usePresetAnswer: initialQuestionModeRef.current === "preset",
      });
      router.replace("/chat");
    }
    // sendMessage intentionally stays outside dependencies for one-time boot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function sendMessage(
    question: string,
    options: { usePresetAnswer?: boolean } = {},
  ) {
    const query = question.trim();

    if (!query || isSending) {
      return;
    }

    trackEvent("send_ai_question", {
      hasConversation: Boolean(conversationId),
      questionLength: query.length,
    });

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
    let difyMessageId: string | undefined;
    let hasSuggestedQuestions = false;

    try {
      const presetAnswer = options.usePresetAnswer ? getPresetAnswer(query) : undefined;

      if (presetAnswer) {
        await streamPresetAnswer({
          answer: presetAnswer,
          signal: controller.signal,
          onChunk: (chunk) => {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantMessageId
                  ? { ...message, content: message.content + chunk }
                  : message,
              ),
            );
          },
        });

        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  status: "complete",
                  suggestedQuestions: presetAnswerSuggestedQuestions.filter(
                    (suggestedQuestion) => suggestedQuestion !== query,
                  ),
                }
              : message,
          ),
        );
        return;
      }

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
        onMessageId: (messageId) => {
          difyMessageId = messageId;
        },
        onSuggestedQuestions: (questions) => {
          hasSuggestedQuestions = questions.length > 0;
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantMessageId
                ? { ...message, suggestedQuestions: questions }
                : message,
            ),
          );
        },
        onTaskId: (taskId) => {
          taskIdRef.current = taskId;
        },
      });

      if (difyMessageId && !hasSuggestedQuestions) {
        const questions = await fetchSuggestedQuestions(difyMessageId);

        if (questions.length) {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantMessageId
                ? { ...message, suggestedQuestions: questions }
                : message,
            ),
          );
        }
      }

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
                  <div className="figma-answer-stack">
                    <div className="figma-answer-text">
                      {message.content ? (
                        <MarkdownRenderer content={message.content} />
                      ) : (
                        <ThinkingIndicator />
                      )}
                    </div>
                    {message.content && message.status !== "sending" ? (
                      <AnswerAfterword
                        disabled={isSending}
                        onQuestionClick={(question) => void sendMessage(question)}
                        questions={message.suggestedQuestions ?? []}
                      />
                    ) : null}
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

async function fetchSuggestedQuestions(messageId: string) {
  const response = await fetch(
    `/api/chat/suggested?messageId=${encodeURIComponent(messageId)}`,
  ).catch(() => null);

  if (!response?.ok) {
    return [];
  }

  const payload = (await response.json().catch(() => null)) as
    | { questions?: unknown }
    | null;

  if (!Array.isArray(payload?.questions)) {
    return [];
  }

  return payload.questions
    .filter((question): question is string => typeof question === "string")
    .map((question) => question.trim())
    .filter(Boolean)
    .slice(0, 3);
}

async function streamPresetAnswer({
  answer,
  onChunk,
  signal,
}: {
  answer: string;
  onChunk: (chunk: string) => void;
  signal: AbortSignal;
}) {
  await abortableDelay(presetAnswerDelayMs, signal);

  const chunks = answer.match(/[\s\S]{1,2}/g) ?? [];

  for (const chunk of chunks) {
    assertNotAborted(signal);
    onChunk(chunk);
    await abortableDelay(18, signal);
  }
}

function abortableDelay(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    assertNotAborted(signal);

    const timeoutId = window.setTimeout(() => {
      signal.removeEventListener("abort", handleAbort);
      resolve();
    }, ms);

    function handleAbort() {
      window.clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    }

    signal.addEventListener("abort", handleAbort, { once: true });
  });
}

function assertNotAborted(signal: AbortSignal) {
  if (signal.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }
}

function ThinkingIndicator() {
  return (
    <div className="figma-thinking">
      <img alt="" height={16} src={figmaAssets.chatLoading} width={16} />
      <span className="shiny-text">Hmm…稍等我组织一下语言</span>
    </div>
  );
}

function AnswerAfterword({
  disabled,
  onQuestionClick,
  questions,
}: {
  disabled: boolean;
  onQuestionClick: (question: string) => void;
  questions: string[];
}) {
  return (
    <>
      <p className="figma-answer-risk">{answerRiskText}</p>
      {questions.length ? (
        <div className="figma-suggestion-panel" data-node-id="370:130">
          <p className="figma-suggestion-title">你还可以问</p>
          <div className="figma-suggestion-list">
            {questions.map((question) => (
              <button
                className="figma-suggestion-button"
                disabled={disabled}
                key={question}
                onClick={() => onQuestionClick(question)}
                type="button"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
