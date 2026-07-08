"use client";

import { useState } from "react";

type Props = {
  value: string;
};

export default function CopyableId({ value }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group flex w-full items-center justify-between border border-ink/25 bg-paper px-5 py-4 text-left transition-colors hover:border-ink hover:bg-ink/[0.03]"
      aria-label={`Copy business manager ID ${value}`}
    >
      <span className="font-mono text-lg tracking-wider text-ink">{value}</span>
      <span className="eyebrow">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
