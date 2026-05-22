"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import Image from "next/image";
import { figmaAssets } from "@/features/portfolio/data";

type QuestionComposerProps = {
  disabled?: boolean;
  onSubmit: (question: string) => void;
  placeholder?: string;
};

export function QuestionComposer({
  disabled = false,
  onSubmit,
  placeholder = "我回答的可不一定对 ^_^",
}: QuestionComposerProps) {
  const [value, setValue] = useState("");

  function submitQuestion() {
    const question = value.trim();

    if (!question || disabled) {
      return;
    }

    onSubmit(question);
    setValue("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitQuestion();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitQuestion();
    }
  }

  return (
    <form className="figma-input-wrap" onSubmit={handleSubmit}>
      <textarea
        aria-label="输入问题"
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        value={value}
      />
      <button aria-label="发送问题" disabled={!value.trim() || disabled} type="submit">
        <Image alt="" height={18} src={figmaAssets.send} width={18} />
      </button>
    </form>
  );
}
