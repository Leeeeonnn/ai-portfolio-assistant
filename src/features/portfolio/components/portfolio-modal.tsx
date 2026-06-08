"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  figmaAssets,
  portfolioProjects,
} from "@/features/portfolio/data";
import { PortfolioProjectGrid } from "@/features/portfolio/components/portfolio-project-grid";
import { trackEvent } from "@/features/analytics/umami";

type PortfolioModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function PortfolioModal({ isOpen, onClose }: PortfolioModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const closeWithMotion = useCallback(() => {
    if (isClosing) {
      return;
    }

    setIsClosing(true);

    closeTimerRef.current = setTimeout(() => {
      onClose();
      setShouldRender(false);
      setIsClosing(false);
    }, 180);
  }, [isClosing, onClose]);

  useEffect(() => {
    if (!shouldRender) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeWithMotion();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shouldRender, closeWithMotion]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className={[
        "figma-portfolio-backdrop",
        isClosing ? "figma-portfolio-backdrop-closing" : undefined,
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseDown={closeWithMotion}
      role="dialog"
    >
      <section
        className={[
          "figma-portfolio-panel",
          isClosing ? "figma-portfolio-panel-closing" : undefined,
        ]
          .filter(Boolean)
          .join(" ")}
        data-node-id="339:16"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2>作品集</h2>

        <PortfolioProjectGrid projects={portfolioProjects} />

        <div className="figma-portfolio-actions" data-node-id="339:55">
          <a
            className="figma-portfolio-download"
            href="/files/portfolio.pdf"
            onClick={() => trackEvent("download_portfolio", { source: "portfolio_modal" })}
            rel="noreferrer"
            target="_blank"
          >
            <img alt="" height={18} src={figmaAssets.downloadIcon} width={18} />
            下载 PDF
          </a>
          <button
            className="figma-portfolio-close"
            onClick={closeWithMotion}
            type="button"
          >
            关闭
          </button>
        </div>
      </section>
    </div>
  );
}
