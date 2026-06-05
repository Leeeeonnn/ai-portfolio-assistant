"use client";

import { useEffect, useRef, useState } from "react";
import { figmaAssets } from "@/features/portfolio/data";

type ResumeModalProps = {
  fileHref: string;
  isOpen: boolean;
  onClose: () => void;
};

export function ResumeModal({ fileHref, isOpen, onClose }: ResumeModalProps) {
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
        "figma-resume-backdrop",
        isClosing ? "figma-resume-backdrop-closing" : undefined,
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseDown={closeWithMotion}
      role="dialog"
    >
      <section
        className={[
          "figma-resume-panel",
          isClosing ? "figma-resume-panel-closing" : undefined,
        ]
          .filter(Boolean)
          .join(" ")}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="figma-resume-toolbar">
          <h2>简历</h2>
          <div className="figma-resume-actions">
            <a className="figma-resume-download" download href={fileHref}>
              <img alt="" height={18} src={figmaAssets.downloadIcon} width={18} />
              下载 PDF
            </a>
            <button className="figma-resume-close" onClick={closeWithMotion} type="button">
              关闭
            </button>
          </div>
        </div>
        <div className="figma-resume-preview">
          <iframe
            className="figma-resume-frame"
            src={`${fileHref}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-width`}
            title="王璐瑶 UI 简历预览"
          />
        </div>
      </section>
    </div>
  );
}
