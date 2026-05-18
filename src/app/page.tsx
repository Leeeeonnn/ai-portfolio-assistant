import { PortfolioChat } from "@/features/chat/components/portfolio-chat";

const quickQuestions = [
  "请用 60 秒介绍你的背景",
  "你最能代表能力的项目是什么？",
  "你适合什么类型的岗位或合作？",
  "如何联系你？",
];

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-3 border-b border-[var(--line)] pb-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[var(--accent)]">
              Personal AI Portfolio Assistant
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">
              个人 AI 作品集助手
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">
              面向面试官、招聘方和潜在合作方，快速了解经历、项目、能力和联系方式。
            </p>
          </div>
          <div className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--muted)]">
            Dify API 接入层已预留，替换环境变量后即可联调。
          </div>
        </header>

        <PortfolioChat quickQuestions={quickQuestions} />
      </section>
    </main>
  );
}
