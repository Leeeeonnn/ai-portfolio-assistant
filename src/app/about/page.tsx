import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/features/portfolio/components/site-header";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--figma-bg)]">
      <SiteHeader />
      <section className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col justify-center px-5 py-16 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--figma-muted)]">
          About This Website
        </p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">关于网站</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--figma-muted)]">
          这里会展示本网站从 Figma 设计、前端开发、Dify Chatflow、Qwen
          模型能力到 GitHub / Vercel 上线的搭建过程。等 Figma 中更新此按钮对应页面后，我会继续补齐为正式内容。
        </p>
        <Link
          className="mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--figma-line)] bg-white px-5 py-3 text-sm font-semibold"
          href="/"
        >
          <ArrowLeft size={16} />
          返回首页
        </Link>
      </section>
    </main>
  );
}
