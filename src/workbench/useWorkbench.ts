import { useCallback, useMemo, useRef, useState } from "react";
import { uid, sleep } from "@/lib/cn";
import type {
  InspectorView,
  Message,
  ReceiptUploadMessage,
  ReimburseCardMessage,
  TaxiCardMessage,
  TextMessage,
} from "./types";

const SEED_WELCOME: TextMessage = {
  id: uid(),
  role: "assistant",
  type: "text",
  createdAt: Date.now(),
  stream: false,
  content:
    "您好，我是 M 域入口智能体。可以帮您一站式完成打车、报销、工单等事务。试试对我说：\n· 我要去沈阳新城打车\n· 帮我报销这周的差旅费",
};

export function useWorkbench() {
  const [messages, setMessages] = useState<Message[]>([SEED_WELCOME]);
  const [inspector, setInspector] = useState<InspectorView>({ kind: "empty" });
  const [isBusy, setIsBusy] = useState(false);
  const seqRef = useRef(0);

  const appendMessage = useCallback((m: Message) => {
    setMessages((arr) => [...arr, m]);
  }, []);

  const updateMessage = useCallback(
    <T extends Message>(id: string, patch: Partial<T>) => {
      setMessages((arr) =>
        arr.map((m) => (m.id === id ? ({ ...m, ...patch } as Message) : m))
      );
    },
    []
  );

  const detectIntent = (text: string) => {
    if (/打车|用车|叫车|出行|出租车/i.test(text)) return "taxi" as const;
    if (/报销|差旅|出差|发票|报账/i.test(text)) return "reimburse" as const;
    return null;
  };

  const extractDestination = (text: string) => {
    const m = text.match(/去([\u4e00-\u9fa5A-Za-z0-9·\- ]+?)(打车|用车|叫车|$)/);
    return m ? m[1].trim() : "沈阳新城";
  };

  const sendTextAsUser = useCallback(
    async (raw: string, opts?: { attachReceipt?: boolean }) => {
      const content = raw.trim();
      if (!content && !opts?.attachReceipt) return;
      const seq = ++seqRef.current;

      if (content) {
        appendMessage({
          id: uid(),
          role: "user",
          type: "text",
          content,
          createdAt: Date.now(),
          stream: false,
        });
      }

      setIsBusy(true);

      const intent = detectIntent(content);

      if (intent === "taxi") {
        const intentMsgId = uid();
        appendMessage({
          id: intentMsgId,
          role: "assistant",
          type: "text",
          createdAt: Date.now(),
          content: "已为您唤起「企业用车」智能体。",
          stream: true,
          intent: { id: uid(), state: "thinking", label: "正在进行意图路由" },
        });
        await sleep(1000);
        updateMessage<TextMessage>(intentMsgId, {
          intent: {
            id: uid(),
            state: "matched",
            label: "匹配成功：企业用车服务",
            skill: "taxi",
          },
          thought: `已自动提取目的地：${extractDestination(content)}`,
        });
        await sleep(420);
        setInspector({ kind: "skill", skill: "taxi" });

        const taxi: TaxiCardMessage = {
          id: uid(),
          role: "assistant",
          type: "taxi-card",
          createdAt: Date.now(),
          origin: "中国移动 · 研发楼 A 座",
          destination: extractDestination(content),
          carType: "economy",
          peopleCount: 1,
          reason: "客户拜访",
          status: "draft",
        };
        appendMessage(taxi);
      } else if (intent === "reimburse") {
        const askId = uid();
        appendMessage({
          id: askId,
          role: "assistant",
          type: "text",
          createdAt: Date.now(),
          content:
            "收到。请上传发票照片，或直接告诉我「金额+日期+事由」，我来帮您把报销单据拟好。",
          stream: true,
          intent: { id: uid(), state: "thinking", label: "正在进行意图路由" },
        });
        await sleep(900);
        updateMessage<TextMessage>(askId, {
          intent: {
            id: uid(),
            state: "matched",
            label: "匹配成功：财务报销",
            skill: "reimburse",
          },
          thought: "推断场景：差旅费报销 · 建议走「员工差旅」模板",
        });
        setInspector({ kind: "skill", skill: "reimburse" });
      } else {
        appendMessage({
          id: uid(),
          role: "assistant",
          type: "text",
          createdAt: Date.now(),
          content:
            seq === 1
              ? "好的，收到。正在为您匹配合适的技能。您可以试试「我要去沈阳新城打车」或「帮我报销这周的差旅费」。"
              : "已记录。我会继续帮您追踪相关任务进度。",
          stream: true,
        });
      }

      setIsBusy(false);
    },
    [appendMessage, updateMessage]
  );

  const uploadReceiptMock = useCallback(async () => {
    const upId = uid();
    const receipt: ReceiptUploadMessage = {
      id: upId,
      role: "user",
      type: "receipt-upload",
      createdAt: Date.now(),
      state: "uploading",
      fileName: "差旅发票_沈阳-北京_2026Q2.jpg",
    };
    appendMessage(receipt);
    await sleep(600);
    updateMessage<ReceiptUploadMessage>(upId, { state: "parsing" });
    await sleep(1100);
    updateMessage<ReceiptUploadMessage>(upId, {
      state: "done",
      parsedAmount: 1286.5,
      parsedDate: "2026-04-18",
      parsedMerchant: "中国国际航空 · CA1632",
    });

    setIsBusy(true);
    await sleep(500);
    const card: ReimburseCardMessage = {
      id: uid(),
      role: "assistant",
      type: "reimburse-card",
      createdAt: Date.now(),
      title: "差旅费报销 · 2026-04 第 3 周",
      amount: 1286.5,
      currency: "CNY",
      occurredOn: "2026-04-18",
      category: "差旅 / 机票",
      merchant: "中国国际航空 · CA1632",
      description: "客户现场支持：沈阳 → 北京 往返机票",
      status: "draft",
    };
    appendMessage(card);
    setInspector({ kind: "skill", skill: "reimburse" });
    setIsBusy(false);
  }, [appendMessage, updateMessage]);

  const confirmTaxi = useCallback(
    async (id: string) => {
      updateMessage<TaxiCardMessage>(id, { status: "dispatching" });
      setInspector({ kind: "taxi-timeline", taxiId: id });
      await sleep(1800);
      updateMessage<TaxiCardMessage>(id, {
        status: "matched",
        driver: {
          name: "王师傅",
          plate: "辽A · 8F27Z",
          etaMin: 4,
          rating: 4.9,
        },
      });
    },
    [updateMessage]
  );

  const submitReimburse = useCallback(
    async (id: string) => {
      updateMessage<ReimburseCardMessage>(id, { status: "submitting" });
      setInspector({ kind: "oa-tree", reimburseId: id });
      await sleep(900);
      updateMessage<ReimburseCardMessage>(id, { status: "approving" });
    },
    [updateMessage]
  );

  const stats = useMemo(
    () => ({
      total: messages.length,
      userCount: messages.filter((m) => m.role === "user").length,
    }),
    [messages]
  );

  return {
    messages,
    setMessages,
    inspector,
    setInspector,
    isBusy,
    appendMessage,
    updateMessage,
    sendTextAsUser,
    uploadReceiptMock,
    confirmTaxi,
    submitReimburse,
    stats,
  };
}
