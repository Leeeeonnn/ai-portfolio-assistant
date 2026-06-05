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
  portfolioProjects,
  presetQuestions,
  tools,
  type FeatureAction,
  type FeatureCard,
} from "@/features/portfolio/data";
import { ContactModal } from "@/features/portfolio/components/contact-modal";
import { PortfolioModal } from "@/features/portfolio/components/portfolio-modal";
import { QuestionComposer } from "@/features/portfolio/components/question-composer";
import { ResumeModal } from "@/features/portfolio/components/resume-modal";
import { SiteHeader } from "@/features/portfolio/components/site-header";
import { BlurText } from "@/components/react-bits/blur-text";

export function HomeExperience() {
  const router = useRouter();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [resumeHref, setResumeHref] = useState<string | null>(null);
  const loadingState = useInitialHomeLoading();
  const isHomeReady = loadingState.phase === "hidden";

  useEffect(() => {
    if (!isHomeReady) {
      return undefined;
    }

    const routesToPrefetch = [
      "/about",
      "/chat",
      ...portfolioProjects.map((project) => project.href),
    ];
    routesToPrefetch.forEach((href) => {
      router.prefetch(href as Parameters<typeof router.prefetch>[0]);
    });

    const idleId = requestBrowserIdleCallback(() => {
      void preloadImages(secondaryImageAssets);
    });

    return () => {
      cancelBrowserIdleCallback(idleId);
    };
  }, [isHomeReady, router]);

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
      setResumeHref(action.href);
    }
  }

  return (
    <main className="figma-page figma-home" data-node-id="4:96">
      {loadingState.phase !== "hidden" ? (
        <InitialHomeLoading
          isLeaving={loadingState.phase === "leaving"}
          progress={loadingState.progress}
        />
      ) : null}

      {isHomeReady ? (
        <>
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
                  text="AI 产品设计师 (UX/UI) · 9 年工作经验"
                />
              </div>
              <div className="figma-welcome-text" data-node-id="4:115">
                <BlurText
                  as="h1"
                  className="figma-home-title-desktop"
                  delay={360}
                  step={24}
                  text="👋 Hi, 我是王璐瑶"
                />
                <h1 aria-label="👋 Hi, 我是王璐瑶" className="figma-home-title-mobile">
                  <BlurText
                    className="figma-home-title-mobile-line"
                    delay={360}
                    step={24}
                    text="👋 Hi,"
                  />
                  <BlurText
                    className="figma-home-title-mobile-line"
                    delay={520}
                    step={24}
                    text="我是王璐瑶"
                  />
                </h1>
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
          <ResumeModal
            fileHref={resumeHref ?? "/files/resume.pdf"}
            isOpen={resumeHref !== null}
            onClose={() => setResumeHref(null)}
          />
        </>
      ) : null}
    </main>
  );
}

type LoadingPhase = "hidden" | "visible" | "leaving";

const criticalHomeImages = [
  figmaAssets.logo,
  figmaAssets.loadingIcon,
  figmaAssets.loadingWave,
  figmaAssets.send,
  ...tools.map((tool) => tool.src),
  ...featureCards.flatMap((card) => [
    card.action.type === "contact" ? figmaAssets.contactLooks[4] : card.iconSrc,
    card.buttonIconSrc,
  ]),
  ...figmaAssets.contactLooks,
];

const secondaryImageAssets = [
  ...figmaAssets.contactLooks,
  figmaAssets.contactQr,
  figmaAssets.contactAvatar,
  ...portfolioProjects.map((project) => project.imageSrc),
  "/figma-assets/about/head-left.png",
  "/figma-assets/about/head-right.png",
  "/figma-assets/about/laptop-avatar.png",
  "/figma-assets/askbot/hero-doc.png",
  "/figma-assets/askbot/hero-mobile.png",
  "/figma-assets/askbot/flow.png",
  "/figma-assets/askbot/input.png",
  "/figma-assets/askbot/understanding.png",
  "/figma-assets/askbot/result.png",
  "/figma-assets/askbot/feedback.png",
  "/figma-assets/askbot/gradient.png",
  "/figma-assets/askbot/palette.png",
  "/figma-assets/askbot/section-banner.png",
  "/figma-assets/askbot/other-screens.png",
  "/figma-assets/askbot/detail-background.png",
  ...Array.from({ length: 19 }, (_, index) => `/figma-assets/tokenview/section-${index + 1}.png`),
  ...Array.from({ length: 5 }, (_, index) => `/figma-assets/tvdev/section-${index + 1}.png`),
  ...Array.from({ length: 10 }, (_, index) => `/figma-assets/others/section-${index + 1}.png`),
];

function useInitialHomeLoading() {
  const [phase, setPhase] = useState<LoadingPhase>("visible");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.sessionStorage.getItem("portfolio-home-assets-ready") === "true") {
      setPhase("hidden");
      setProgress(100);
      return undefined;
    }

    let isCancelled = false;
    let completed = 0;
    let visualProgress = 0;
    const uniqueCriticalImages = Array.from(new Set(criticalHomeImages));

    setPhase("visible");
    setProgress(0);

    const progressTimer = window.setInterval(() => {
      if (isCancelled) {
        return;
      }

      visualProgress = Math.min(visualProgress + 1, 92);
      setProgress((current) => Math.max(current, visualProgress));
    }, 90);

    preloadImages(uniqueCriticalImages, () => {
      completed += 1;
      const loadedProgress = Math.round((completed / uniqueCriticalImages.length) * 96);

      if (!isCancelled) {
        setProgress((current) => Math.max(current, loadedProgress));
      }
    }).finally(() => {
      window.sessionStorage.setItem("portfolio-home-assets-ready", "true");
      window.clearInterval(progressTimer);

      if (isCancelled) {
        return;
      }

      setProgress(100);
      setPhase("leaving");
      window.setTimeout(() => {
        if (!isCancelled) {
          setPhase("hidden");
        }
      }, 220);
    });

    return () => {
      isCancelled = true;
      window.clearInterval(progressTimer);
    };
  }, []);

  return { phase, progress };
}

function preloadImages(srcList: string[], onSettle?: () => void) {
  const uniqueSrcList = Array.from(new Set(srcList));

  return Promise.allSettled(
    uniqueSrcList.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new Image();

          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = src;
        }).finally(() => {
          onSettle?.();
        }),
    ),
  );
}

function requestBrowserIdleCallback(callback: () => void) {
  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(callback, { timeout: 2500 });
  }

  return globalThis.setTimeout(callback, 900);
}

function cancelBrowserIdleCallback(id: ReturnType<typeof requestBrowserIdleCallback>) {
  if ("cancelIdleCallback" in window) {
    window.cancelIdleCallback(id as number);
    return;
  }

  globalThis.clearTimeout(id);
}

function InitialHomeLoading({
  isLeaving,
  progress,
}: {
  isLeaving: boolean;
  progress: number;
}) {
  return (
    <div
      aria-label="加载中"
      className={[
        "figma-loading",
        "figma-initial-loading",
        isLeaving ? "figma-initial-loading-leaving" : undefined,
      ]
        .filter(Boolean)
        .join(" ")}
      data-node-id="4:225"
      role="status"
    >
      <img
        alt=""
        className="figma-loading-wave"
        height={386}
        src={figmaAssets.loadingWave}
        width={1512}
      />
      <div className="figma-loading-logo" data-node-id="4:227">
        <img
          alt=""
          className="figma-loading-icon"
          height={40}
          src={figmaAssets.loadingIcon}
          width={40}
        />
        <p>王璐瑶的作品集</p>
        <div className="figma-loading-hint">
          <span>网站部署在 Vercel，建议开启 VPN，会顺畅很多</span>
          <span className="figma-loading-hint-mobile">使用 PC 浏览器访问，体验会更好</span>
        </div>
        <strong>{progress}%</strong>
      </div>
    </div>
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
        card.action.type === "about" ? "figma-feature-card-about" : undefined,
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
