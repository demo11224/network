import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Zap } from "lucide-react";
import { ChatStream } from "./ChatStream";
import { Composer } from "./Composer";
import { Inspector } from "./Inspector";
import { useWorkbench } from "./useWorkbench";

export function Workbench() {
  const wb = useWorkbench();

  return (
    <div className="flex h-full min-h-0 w-full gap-5 p-5">
      {/* Left column: chat stream */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/60 shadow-soft glass">
        <div className="flex items-center justify-between border-b border-slate-100 bg-white/60 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft"
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                M 域入口智能体 · 工作台
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  沙箱已隔离
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-500" />
                  低时延链路
                </span>
              </div>
            </div>
          </div>
          <div className="hidden text-[11px] text-slate-400 md:block">
            今日对话 <span className="font-semibold text-slate-700">{wb.stats.total}</span>{" "}
            条 · 你发起 {wb.stats.userCount}
          </div>
        </div>

        <ChatStream
          messages={wb.messages}
          onUpdateMessage={(id, p) => wb.updateMessage(id, p)}
          onConfirmTaxi={wb.confirmTaxi}
          onCancelTaxi={(id) =>
            wb.updateMessage(id, { status: "cancelled" } as any)
          }
          onSubmitReimburse={wb.submitReimburse}
        />

        <div className="border-t border-slate-100 bg-white/70 p-4 backdrop-blur">
          <Composer
            disabled={wb.isBusy}
            onSubmit={(t) => wb.sendTextAsUser(t)}
            onAttachReceipt={wb.uploadReceiptMock}
            suggestions={
              wb.messages.length <= 2
                ? ["我要去沈阳新城打车", "帮我报销这周的差旅费", "我网络故障了"]
                : []
            }
            onPickSuggestion={(t) => wb.sendTextAsUser(t)}
          />
        </div>
      </div>

      {/* Right column: dynamic inspector */}
      <div className="hidden w-[38%] max-w-[520px] min-w-[360px] shrink-0 md:block">
        <Inspector view={wb.inspector} messages={wb.messages} />
      </div>
    </div>
  );
}
