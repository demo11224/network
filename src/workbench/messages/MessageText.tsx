import { AnimatePresence, motion } from "framer-motion";
import { Bot, CheckCircle2, Loader2, Sparkles, User } from "lucide-react";
import { Typewriter } from "@/components/Typewriter";
import { cn } from "@/lib/cn";
import type { TextMessage } from "../types";

export function MessageText({ m }: { m: TextMessage }) {
  const isUser = m.role === "user";
  return (
    <div
      className={cn(
        "flex w-full gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar isUser={isUser} />
      <div
        className={cn(
          "flex max-w-[86%] flex-col gap-1.5",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* intent label above bubble */}
        {!isUser && m.intent && (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={m.intent.state}
              layout
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                m.intent.state === "thinking"
                  ? "border-slate-200 bg-white text-slate-500"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              )}
            >
              {m.intent.state === "thinking" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3 w-3" />
              )}
              {m.intent.label}
            </motion.div>
          </AnimatePresence>
        )}

        {/* thought line (very small) */}
        {!isUser && m.thought && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-[11px] text-slate-400"
          >
            <Sparkles className="h-3 w-3" />
            {m.thought}
          </motion.div>
        )}

        {/* bubble */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
            isUser
              ? "rounded-br-sm bg-brand-600 text-white"
              : "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
          )}
        >
          {isUser || !m.stream ? (
            <span className="whitespace-pre-wrap break-words">{m.content}</span>
          ) : (
            <Typewriter text={m.content} />
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Avatar({ isUser }: { isUser: boolean }) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm",
        isUser
          ? "bg-slate-900 text-white"
          : "bg-gradient-to-br from-brand-500 to-brand-700 text-white"
      )}
    >
      {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
    </div>
  );
}
