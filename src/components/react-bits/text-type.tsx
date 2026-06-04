"use client";

import { useEffect, useState } from "react";

type TextTypeProps = {
  className?: string;
  deleteSpeed?: number;
  holdDelay?: number;
  texts: string[];
  typeSpeed?: number;
};

export function TextType({
  className,
  deleteSpeed = 28,
  holdDelay = 1500,
  texts,
  typeSpeed = 64,
}: TextTypeProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [phase, setPhase] = useState<"deleting" | "holding" | "typing">(
    "typing",
  );

  useEffect(() => {
    const currentText = texts[activeIndex] ?? "";
    let timer: number;

    if (phase === "typing") {
      if (characterCount < currentText.length) {
        timer = window.setTimeout(() => {
          setCharacterCount((count) => count + 1);
        }, typeSpeed);
      } else {
        timer = window.setTimeout(() => setPhase("holding"), holdDelay);
      }
    } else if (phase === "holding") {
      timer = window.setTimeout(() => setPhase("deleting"), holdDelay);
    } else if (characterCount > 0) {
      timer = window.setTimeout(() => {
        setCharacterCount((count) => count - 1);
      }, deleteSpeed);
    } else {
      timer = window.setTimeout(() => {
        setActiveIndex((index) => (index + 1) % texts.length);
        setPhase("typing");
      }, typeSpeed);
    }

    return () => window.clearTimeout(timer);
  }, [activeIndex, characterCount, deleteSpeed, holdDelay, phase, texts, typeSpeed]);

  return (
    <span className={className}>
      {(texts[activeIndex] ?? "").slice(0, characterCount)}
      <span aria-hidden="true" className="text-type-cursor" />
    </span>
  );
}
