import type { CSSProperties, ElementType } from "react";

type BlurTextProps = {
  as?: ElementType;
  by?: "character" | "word";
  className?: string;
  delay?: number;
  step?: number;
  text: string;
};

export function BlurText({
  as: Component = "span",
  by = "character",
  className,
  delay = 0,
  step = 36,
  text,
}: BlurTextProps) {
  const parts = by === "word" ? text.trim().split(/\s+/) : Array.from(text);

  return (
    <Component
      aria-label={text}
      className={["blur-text", className].filter(Boolean).join(" ")}
    >
      {parts.map((part, index) => (
        <span
          aria-hidden="true"
          className={[
            "blur-text-item",
            by === "word" ? "blur-text-word" : undefined,
          ]
            .filter(Boolean)
            .join(" ")}
          key={`${part}-${index}`}
          style={
            {
              "--blur-text-delay": `${delay + index * step}ms`,
            } as CSSProperties
          }
        >
          {part}
        </span>
      ))}
    </Component>
  );
}
