"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  featureCards,
  presetQuestions,
  type FeatureAction,
  type FeatureCard,
} from "@/features/portfolio/data";
import { ContactModal } from "@/features/portfolio/components/contact-modal";
import { QuestionComposer } from "@/features/portfolio/components/question-composer";
import { SiteHeader } from "@/features/portfolio/components/site-header";

export function HomeExperience() {
  const router = useRouter();
  const [isContactOpen, setIsContactOpen] = useState(false);

  function ask(question: string) {
    router.push(`/chat?q=${encodeURIComponent(question)}`);
  }

  function handleAction(action: FeatureAction) {
    if (action.type === "contact") {
      setIsContactOpen(true);
      return;
    }

    if (action.type === "about") {
      router.push("/about");
      return;
    }

    window.open(action.href, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="figma-page figma-home" data-node-id="4:96">
      <SiteHeader />

      <section className="figma-home-body" data-node-id="4:110">
        <div className="figma-welcome" data-node-id="4:111">
          <div className="figma-title-pill" data-node-id="4:112">
            <span aria-hidden="true" />
            <p>资深 UX/UI 设计师 · AI 产品设计师 · 8 年工作经验</p>
          </div>
          <div className="figma-welcome-text" data-node-id="4:115">
            <h1>👋 Hi, 我是王璐瑶</h1>
            <p>What would you like to know about me?</p>
          </div>
        </div>

        <div className="figma-card-row" data-node-id="4:118">
          {featureCards.map((card) => (
            <FeatureCardButton
              card={card}
              key={card.title}
              onAction={handleAction}
            />
          ))}
        </div>
      </section>

      <section className="figma-conversation-home" data-node-id="4:127">
        <div className="figma-preset-list" data-node-id="4:128">
          {presetQuestions.map((question) => (
            <button key={question} onClick={() => ask(question)} type="button">
              {question}
            </button>
          ))}
        </div>
        <div className="figma-input-area">
          <QuestionComposer onSubmit={ask} />
          <p>仅作为能力展示，重要信息请联系本人核查。</p>
        </div>
      </section>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </main>
  );
}

function FeatureCardButton({
  card,
  onAction,
}: {
  card: FeatureCard;
  onAction: (action: FeatureAction) => void;
}) {
  return (
    <button
      aria-label={card.title}
      className="figma-feature-card"
      onClick={() => onAction(card.action)}
      type="button"
    >
      <span className="figma-card-icon">
        <img
          alt=""
          className={card.iconClassName}
          height={100}
          src={card.iconSrc}
          width={100}
        />
      </span>
      <span className="figma-card-button">{card.buttonLabel}</span>
    </button>
  );
}
