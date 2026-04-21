import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Message } from "./types";
import { MessageText } from "./messages/MessageText";
import { TaxiCard } from "./messages/TaxiCard";
import { ReimburseCard } from "./messages/ReimburseCard";
import { ReceiptUpload } from "./messages/ReceiptUpload";

interface ChatStreamProps {
  messages: Message[];
  onUpdateMessage: (id: string, patch: any) => void;
  onConfirmTaxi: (id: string) => void;
  onCancelTaxi: (id: string) => void;
  onSubmitReimburse: (id: string) => void;
}

export function ChatStream({
  messages,
  onUpdateMessage,
  onConfirmTaxi,
  onCancelTaxi,
  onSubmitReimburse,
}: ChatStreamProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="relative flex-1 overflow-y-auto px-6 py-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex w-full"
            >
              {m.type === "text" && <MessageText m={m} />}
              {m.type === "taxi-card" && (
                <div className="flex w-full items-start gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700" />
                  <TaxiCard
                    m={m}
                    onChange={(p) => onUpdateMessage(m.id, p)}
                    onConfirm={() => onConfirmTaxi(m.id)}
                    onCancel={() => onCancelTaxi(m.id)}
                  />
                </div>
              )}
              {m.type === "reimburse-card" && (
                <div className="flex w-full items-start gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700" />
                  <ReimburseCard
                    m={m}
                    onChange={(p) => onUpdateMessage(m.id, p)}
                    onSubmit={() => onSubmitReimburse(m.id)}
                  />
                </div>
              )}
              {m.type === "receipt-upload" && (
                <div className="ml-auto">
                  <ReceiptUpload m={m} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>
    </div>
  );
}
