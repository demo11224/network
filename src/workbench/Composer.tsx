import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, AtSign, Mic, Paperclip, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

interface ComposerProps {
  onSubmit: (text: string) => void;
  onAttachReceipt: () => void;
  disabled?: boolean;
  suggestions?: string[];
  onPickSuggestion?: (text: string) => void;
}

export function Composer({
  onSubmit,
  onAttachReceipt,
  disabled,
  suggestions = [],
  onPickSuggestion,
}: ComposerProps) {
  const [value, setValue] = useState("");
  const submit = () => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
  };

  return (
    <div className="space-y-3">
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <motion.button
              key={s}
              whileHover={{ y: -1 }}
              onClick={() => onPickSuggestion?.(s)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-600 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
            >
              <Sparkles className="h-3 w-3 text-brand-500" />
              {s}
            </motion.button>
          ))}
        </div>
      )}
      <motion.div
        layout
        className={cn(
          "relative flex flex-col rounded-2xl border border-slate-200 bg-white p-2 shadow-soft transition",
          "focus-within:border-brand-400 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.08)]"
        )}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={2}
          placeholder="告诉我您的诉求，例如「我要去沈阳新城打车」或「帮我报销这周的差旅费」..."
          className="max-h-40 min-h-[56px] w-full resize-none bg-transparent px-3 py-2 text-sm leading-relaxed outline-none placeholder:text-slate-400"
        />
        <div className="flex items-center justify-between px-2 pb-1 pt-1">
          <div className="flex items-center gap-1">
            <IconBtn onClick={onAttachReceipt} title="上传附件 / 发票">
              <Paperclip className="h-4 w-4" />
            </IconBtn>
            <IconBtn title="@ 选择技能">
              <AtSign className="h-4 w-4" />
            </IconBtn>
            <IconBtn title="语音输入">
              <Mic className="h-4 w-4" />
            </IconBtn>
            <span className="ml-2 hidden text-[11px] text-slate-400 sm:inline">
              Enter 发送 · Shift + Enter 换行
            </span>
          </div>
          <button
            onClick={submit}
            disabled={disabled || !value.trim()}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-lg bg-brand-600 px-3 text-[13px] font-medium text-white shadow-sm transition",
              "hover:bg-brand-700 active:translate-y-[1px] disabled:cursor-not-allowed disabled:bg-slate-300"
            )}
          >
            发送
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function IconBtn({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-brand-600"
    >
      {children}
    </button>
  );
}
