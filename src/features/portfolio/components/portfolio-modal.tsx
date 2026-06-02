"use client";

import { useEffect, useRef, useState } from "react";
import {
  figmaAssets,
  portfolioProjects,
} from "@/features/portfolio/data";

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

  function closeWithMotion() {
    setIsClosing(true);

    closeTimerRef.current = setTimeout(() => {
      onClose();
      setShouldRender(false);
      setIsClosing(false);
    }, 180);
  }

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

        <div className="figma-portfolio-projects" data-node-id="339:18">
          {portfolioProjects.map((project) => (
            <a
              className="figma-portfolio-project"
              href={project.href}
              key={project.title}
              onClick={closeWithMotion}
            >
              <img alt="" height={104} src={project.imageSrc} width={96} />
              <span>{project.title}</span>
            </a>
          ))}
        </div>

        <div className="figma-portfolio-actions" data-node-id="339:55">
          <a
            className="figma-portfolio-download"
            href="/files/portfolio.pdf"
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
