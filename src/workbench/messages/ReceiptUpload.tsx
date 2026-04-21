import { motion } from "framer-motion";
import { CheckCircle2, FileText, Loader2, ScanLine } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type { ReceiptUploadMessage } from "../types";

export function ReceiptUpload({ m }: { m: ReceiptUploadMessage }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[360px] self-end"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="relative h-24 bg-gradient-to-br from-slate-100 to-slate-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="h-10 w-10 text-slate-300" />
          </div>
          {m.state !== "done" && (
            <div
              className={cn(
                "absolute left-0 right-0 top-0 h-[3px] w-full shimmer-bg animate-shimmer"
              )}
            />
          )}
          <div className="absolute bottom-2 right-2">
            <StateBadge state={m.state} />
          </div>
        </div>
        <div className="px-4 py-3 text-xs">
          <div className="font-medium text-slate-800">{m.fileName}</div>
          {m.state === "done" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 space-y-1 rounded-lg bg-emerald-50/80 p-2 text-emerald-800"
            >
              <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <ScanLine className="h-3 w-3" />
                OCR 解析完成
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">商户</span>
                <span>{m.parsedMerchant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">日期</span>
                <span>{m.parsedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">金额</span>
                <span className="font-semibold">¥ {m.parsedAmount}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StateBadge({ state }: { state: ReceiptUploadMessage["state"] }) {
  if (state === "uploading")
    return (
      <Badge tone="sky">
        <Loader2 className="h-3 w-3 animate-spin" /> 上传中
      </Badge>
    );
  if (state === "parsing")
    return (
      <Badge tone="brand">
        <ScanLine className="h-3 w-3" /> 解析中
      </Badge>
    );
  return (
    <Badge tone="green">
      <CheckCircle2 className="h-3 w-3" /> 已完成
    </Badge>
  );
}
