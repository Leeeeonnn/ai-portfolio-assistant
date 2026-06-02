"use client";

import { useRouter } from "next/navigation";
import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  featureCards,
  figmaAssets,
  presetQuestions,
  type FeatureAction,
  type FeatureCard,
} from "@/features/portfolio/data";
import { ContactModal } from "@/features/portfolio/components/contact-modal";
import { PortfolioModal } from "@/features/portfolio/components/portfolio-modal";
import { QuestionComposer } from "@/features/portfolio/components/question-composer";
import { SiteHeader } from "@/features/portfolio/components/site-header";
import { BlurText } from "@/components/react-bits/blur-text";

export function HomeExperience() {
  const router = useRouter();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);

  function ask(question: string) {
    router.push(`/chat?q=${encodeURIComponent(question)}`);
  }

  function handleAction(action: FeatureAction) {
    if (action.type === "portfolio") {
      setIsPortfolioOpen(true);
      return;
    }

    if (action.type === "contact") {
      setIsContactOpen(true);
      return;
    }

    if (action.type === "about") {
      router.push("/about");
      return;
    }

    if (action.type === "resume") {
      window.open(action.href, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <main className="figma-page figma-home" data-node-id="4:96">
      <SiteHeader />

      <section className="figma-home-body" data-node-id="4:110">
        <div className="figma-welcome" data-node-id="4:111">
          <div className="figma-title-pill" data-node-id="4:112">
            <span aria-hidden="true" />
            <BlurText
              as="p"
              by="word"
              delay={120}
              step={18}
              text="资深 UX/UI 设计师 · AI 产品设计师 · 8 年工作经验"
            />
          </div>
          <div className="figma-welcome-text" data-node-id="4:115">
            <BlurText as="h1" delay={360} step={24} text="👋 Hi, 我是王璐瑶" />
            <BlurText
              as="p"
              by="word"
              delay={680}
              step={54}
              text="What would you like to know about me?"
            />
          </div>
        </div>

        <div className="figma-card-row" data-node-id="4:118">
          {featureCards.map((card, index) => (
            <FeatureCardButton
              card={card}
              index={index}
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
      <PortfolioModal
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
      />
    </main>
  );
}

function FeatureCardButton({
  card,
  index,
  onAction,
}: {
  card: FeatureCard;
  index: number;
  onAction: (action: FeatureAction) => void;
}) {
  const isContactCard = card.action.type === "contact";
  const [contactLookIndex, setContactLookIndex] = useState(4);
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const cardDelay = 1180 + index * 110;
  const iconSrc = isContactCard
    ? figmaAssets.contactLooks[contactLookIndex]
    : card.iconSrc;

  useEffect(() => {
    if (!isContactCard) {
      return undefined;
    }

    function updateContactLook(event: globalThis.MouseEvent) {
      const rect = cardRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deadZoneX = rect.width * 0.18;
      const deadZoneY = rect.height * 0.18;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const column = deltaX < -deadZoneX ? 0 : deltaX > deadZoneX ? 2 : 1;
      const row = deltaY < -deadZoneY ? 0 : deltaY > deadZoneY ? 2 : 1;

      setContactLookIndex(row * 3 + column);
    }

    window.addEventListener("mousemove", updateContactLook);

    return () => {
      window.removeEventListener("mousemove", updateContactLook);
    };
  }, [isContactCard]);

  return (
    <button
      aria-label={card.title}
      className={[
        "figma-feature-card",
        isContactCard ? "figma-feature-card-contact" : undefined,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onAction(card.action)}
      ref={cardRef}
      style={
        {
          "--card-reveal-delay": `${cardDelay}ms`,
        } as CSSProperties
      }
      type="button"
    >
      <span className="figma-card-icon">
        <img
          alt=""
          className={[
            card.iconClassName,
            isContactCard ? "portfolio-card-icon-contact-look" : undefined,
          ]
            .filter(Boolean)
            .join(" ")}
          height={100}
          src={iconSrc}
          width={100}
        />
      </span>
      <span className="figma-card-button">
        <img alt="" height={18} src={card.buttonIconSrc} width={18} />
        <BlurText
          by="word"
          className="figma-card-button-label"
          delay={cardDelay + 120}
          step={42}
          text={card.buttonLabel}
        />
      </span>
    </button>
  );
}
