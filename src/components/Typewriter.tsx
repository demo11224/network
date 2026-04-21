import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onDone?: () => void;
  enabled?: boolean;
}

export function Typewriter({
  text,
  speed = 22,
  className,
  onDone,
  enabled = true,
}: TypewriterProps) {
  const [i, setI] = useState(enabled ? 0 : text.length);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setI(text.length);
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
      return;
    }
    doneRef.current = false;
    setI(0);
    let cancelled = false;
    let idx = 0;
    const tick = () => {
      if (cancelled) return;
      idx += 1;
      setI(idx);
      if (idx >= text.length) {
        doneRef.current = true;
        onDone?.();
        return;
      }
      const char = text[idx - 1];
      const extra = /[，。,.!?！？\n;；:：]/.test(char ?? "") ? 140 : 0;
      window.setTimeout(tick, speed + extra + Math.random() * 14);
    };
    window.setTimeout(tick, speed);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, enabled]);

  const done = i >= text.length;

  return (
    <span className={cn("whitespace-pre-wrap break-words", className)}>
      {text.slice(0, i)}
      {!done && (
        <span className="ml-[1px] inline-block h-[1em] w-[2px] translate-y-[2px] animate-blink bg-brand-500 align-middle" />
      )}
    </span>
  );
}
