import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BadgeCheck,
  Car,
  CircleDollarSign,
  Clock3,
  GitBranch,
  Layers,
  Shield,
  Sparkles,
  UserCircle2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type {
  InspectorView,
  Message,
  ReimburseCardMessage,
  TaxiCardMessage,
} from "./types";

export function Inspector({
  view,
  messages,
}: {
  view: InspectorView;
  messages: Message[];
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              动态能力看板
            </div>
            <div className="text-[11px] text-slate-400">
              Dynamic Inspector · 随对话上下文动态切换
            </div>
          </div>
        </div>
        <Badge tone="brand">
          <Activity className="h-3 w-3" />
          实时
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <AnimatePresence mode="wait">
          {view.kind === "empty" && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <EmptyBoard />
            </motion.div>
          )}

          {view.kind === "skill" && (
            <motion.div
              key={`skill-${view.skill}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {view.skill === "taxi" ? <SkillTaxi /> : <SkillReimburse />}
            </motion.div>
          )}

          {view.kind === "taxi-timeline" && (
            <motion.div
              key="taxi-timeline"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <TaxiTimeline
                card={
                  messages.find(
                    (m) => m.id === view.taxiId && m.type === "taxi-card"
                  ) as TaxiCardMessage | undefined
                }
              />
            </motion.div>
          )}

          {view.kind === "oa-tree" && (
            <motion.div
              key="oa-tree"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <OATree
                card={
                  messages.find(
                    (m) =>
                      m.id === view.reimburseId && m.type === "reimburse-card"
                  ) as ReimburseCardMessage | undefined
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EmptyBoard() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-5 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-500 shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="mt-3 text-sm font-medium text-slate-700">
          等待对话触发技能
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          一旦识别到意图（如打车 / 报销），此处将联动展示
          <br />
          技能详情、地图预览或审批时间轴
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MiniStat icon={<Users className="h-4 w-4" />} label="今日活跃" value="1,284" />
        <MiniStat
          icon={<BadgeCheck className="h-4 w-4" />}
          label="一次完成率"
          value="92.4%"
          tone="green"
        />
        <MiniStat
          icon={<Clock3 className="h-4 w-4" />}
          label="平均响应"
          value="1.2s"
          tone="brand"
        />
        <MiniStat
          icon={<Shield className="h-4 w-4" />}
          label="隔离域"
          value="M-Zone · 1"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-2 text-xs font-medium text-slate-500">
          已接入能力 · 12
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "企业用车",
            "财务报销",
            "IT 发票通",
            "EOMS 工单",
            "网络故障闭环",
            "差旅审批",
            "会议预订",
            "访客管理",
          ].map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
  tone = "slate",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "slate" | "brand" | "green";
}) {
  const toneMap = {
    slate: "text-slate-700",
    brand: "text-brand-600",
    green: "text-emerald-600",
  } as const;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
        {icon}
        {label}
      </div>
      <div
        className={cn("mt-1 text-lg font-semibold tabular-nums", toneMap[tone])}
      >
        {value}
      </div>
    </div>
  );
}

function SkillTaxi() {
  return (
    <div className="space-y-3">
      <SkillHeader
        icon={<Car className="h-4 w-4" />}
        title="企业用车服务"
        subtitle="Enterprise Mobility · v2.8"
      />
      <div className="grid grid-cols-2 gap-3">
        <InfoBlock label="SLA" value="30 秒内派单" tone="brand" />
        <InfoBlock label="覆盖城市" value="342 座" />
        <InfoBlock label="当月使用" value="3,281 次" tone="green" />
        <InfoBlock label="节约工时" value="≈ 420 H" />
      </div>
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-brand-50 via-white to-sky-50 p-4 text-xs">
        <div className="mb-2 flex items-center gap-1.5 text-slate-500">
          <UserCircle2 className="h-3.5 w-3.5" />
          能力来源
        </div>
        <div className="text-sm font-medium text-slate-800">
          M 域企业出行中台 · 集成 3 家出行服务商
        </div>
      </div>
    </div>
  );
}

function SkillReimburse() {
  return (
    <div className="space-y-3">
      <SkillHeader
        icon={<CircleDollarSign className="h-4 w-4" />}
        title="财务报销智能体"
        subtitle="Finance Bot · v3.1"
      />
      <div className="grid grid-cols-2 gap-3">
        <InfoBlock label="OCR 准确率" value="99.2%" tone="green" />
        <InfoBlock label="审批节点" value="4 级" />
        <InfoBlock label="平均耗时" value="2.1 天" tone="brand" />
        <InfoBlock label="本月单量" value="1,902" />
      </div>
    </div>
  );
}

function SkillHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/50 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="text-[11px] text-slate-500">{subtitle}</div>
      </div>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: string;
  tone?: "slate" | "brand" | "green";
}) {
  const toneMap = {
    slate: "text-slate-800",
    brand: "text-brand-600",
    green: "text-emerald-600",
  } as const;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className={cn("mt-1 text-sm font-semibold", toneMap[tone])}>
        {value}
      </div>
    </div>
  );
}

function TaxiTimeline({ card }: { card?: TaxiCardMessage }) {
  const steps = [
    {
      key: "dispatch",
      title: "正在派单",
      desc: "匹配 2.3 公里内空闲车辆",
      icon: <GitBranch className="h-3.5 w-3.5" />,
    },
    {
      key: "matched",
      title: "司机已接单",
      desc: card?.driver
        ? `${card.driver.name} · ${card.driver.plate}`
        : "等待司机接单...",
    },
    { key: "pickup", title: "司机前来接驾", desc: "预计 4 分钟抵达出发地" },
    { key: "onboard", title: "行程进行中", desc: "实时更新位置、费用" },
    { key: "done", title: "行程完成", desc: "自动生成电子发票并归档" },
  ];
  const status = card?.status ?? "dispatching";
  const activeIndex =
    status === "matched" ? 1 : status === "done" ? 4 : 0;

  return (
    <div className="space-y-3">
      <SkillHeader
        icon={<Car className="h-4 w-4" />}
        title="行程进度 · 实时时间轴"
        subtitle={
          card
            ? `${card.origin}  →  ${card.destination}`
            : "等待车辆..."
        }
      />
      <ol className="relative ml-3 border-l border-dashed border-slate-200 pl-5">
        {steps.map((s, i) => {
          const done = i < activeIndex;
          const current = i === activeIndex;
          return (
            <li key={s.key} className="relative pb-5 last:pb-0">
              <span
                className={cn(
                  "absolute -left-[29px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2",
                  done
                    ? "border-emerald-400 bg-emerald-400 text-white"
                    : current
                      ? "border-brand-500 bg-white text-brand-600"
                      : "border-slate-200 bg-white text-slate-300"
                )}
              >
                {done ? (
                  <BadgeCheck className="h-3 w-3" />
                ) : current ? (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                )}
              </span>
              <div
                className={cn(
                  "text-sm font-medium",
                  done
                    ? "text-slate-600"
                    : current
                      ? "text-slate-900"
                      : "text-slate-400"
                )}
              >
                {s.title}
              </div>
              <div className="text-[11px] text-slate-400">{s.desc}</div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function OATree({ card }: { card?: ReimburseCardMessage }) {
  const activeStage =
    card?.status === "approving" ? 2 : card?.status === "submitting" ? 1 : 0;
  const nodes = [
    {
      key: "submit",
      title: "员工提交",
      role: "张工 · 研发中心",
      icon: <UserCircle2 className="h-3.5 w-3.5" />,
    },
    {
      key: "lead",
      title: "部门主管审批",
      role: "李总 · 研发中心",
    },
    {
      key: "finance",
      title: "财务复核",
      role: "赵会计 · 财务部",
    },
    {
      key: "cto",
      title: "CTO / 授权人",
      role: "> 5,000 元时触发",
      optional: true,
    },
    {
      key: "pay",
      title: "打款完成",
      role: "T+1 工作日到账",
    },
  ];

  return (
    <div className="space-y-3">
      <SkillHeader
        icon={<GitBranch className="h-4 w-4" />}
        title="OA 审批链路"
        subtitle={card ? `单号 ${card.id.slice(0, 8).toUpperCase()}` : ""}
      />
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <ul className="relative space-y-3">
          {nodes.map((n, i) => {
            const done = i < activeStage;
            const current = i === activeStage;
            return (
              <li
                key={n.key}
                className={cn(
                  "relative flex items-start gap-3 rounded-lg border px-3 py-2 transition",
                  done &&
                    "border-emerald-200 bg-emerald-50/60",
                  current && "border-brand-300 bg-brand-50/60",
                  !done && !current && "border-slate-200 bg-white"
                )}
              >
                {i < nodes.length - 1 && (
                  <span className="absolute left-[18px] top-[38px] h-[calc(100%-8px)] w-px bg-slate-200" />
                )}
                <div
                  className={cn(
                    "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    done && "bg-emerald-500 text-white",
                    current && "bg-brand-600 text-white",
                    !done && !current && "bg-slate-100 text-slate-400"
                  )}
                >
                  {done ? <BadgeCheck className="h-4 w-4" /> : i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        current ? "text-brand-800" : "text-slate-800"
                      )}
                    >
                      {n.title}
                      {n.optional && (
                        <span className="ml-1 text-[10px] font-normal text-slate-400">
                          可选
                        </span>
                      )}
                    </div>
                    {current && (
                      <Badge tone="brand">
                        <Clock3 className="h-3 w-3" />
                        进行中
                      </Badge>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">{n.role}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
