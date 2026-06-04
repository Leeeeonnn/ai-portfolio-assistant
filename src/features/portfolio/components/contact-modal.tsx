"use client";

import { useEffect, useRef, useState } from "react";
import { figmaAssets } from "@/features/portfolio/data";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
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
        "figma-contact-backdrop",
        isClosing ? "figma-contact-backdrop-closing" : undefined,
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseDown={closeWithMotion}
      role="dialog"
    >
      <section
        className={[
          "figma-contact-card",
          isClosing ? "figma-contact-card-closing" : undefined,
        ]
          .filter(Boolean)
          .join(" ")}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2>联系我</h2>
        <p>电话: 13716937708</p>
        <p>邮箱: lewuyiao@gmail.com</p>
        <img
          alt="联系二维码"
          className="figma-contact-qr"
          height={60}
          src={figmaAssets.contactQr}
          width={60}
        />
        <img
          alt=""
          className="figma-contact-avatar"
          height={192}
          src={figmaAssets.contactAvatar}
          width={192}
        />
      </section>
    </div>
  );
}
