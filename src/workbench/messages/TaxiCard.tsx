import { motion } from "framer-motion";
import {
  Car,
  CheckCircle2,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { InlineEdit } from "@/components/ui/InlineEdit";
import { cn } from "@/lib/cn";
import type { CarType, TaxiCardMessage } from "../types";

const carOptions: { value: CarType; label: string; hint: string }[] = [
  { value: "economy", label: "经济型", hint: "≈ 18 元" },
  { value: "comfort", label: "舒适型", hint: "≈ 28 元" },
  { value: "business", label: "商务型", hint: "≈ 58 元" },
];

export function TaxiCard({
  m,
  onChange,
  onConfirm,
  onCancel,
}: {
  m: TaxiCardMessage;
  onChange: (patch: Partial<TaxiCardMessage>) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const isDispatching = m.status === "dispatching";
  const isMatched = m.status === "matched";
  const disabled = m.status !== "draft";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="w-full max-w-[460px]"
    >
      <Card className="overflow-hidden">
        {/* Map preview */}
        <div className="relative h-28 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-brand-50 via-white to-sky-50 grid-bg">
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-3">
            <Badge tone="brand">
              <Car className="h-3 w-3" /> 企业用车
            </Badge>
            <StatusBadge status={m.status} />
          </div>
          <RouteLine />
        </div>

        <CardHeader className="pb-1">
          <div className="flex flex-col gap-1">
            <div className="text-sm font-semibold text-slate-900">
              打车服务 · 即时叫车
            </div>
            <div className="text-[11px] text-slate-400">
              已根据您的对话自动预填以下信息，点击字段可直接编辑
            </div>
          </div>
        </CardHeader>

        <CardBody className="space-y-3">
          <Row
            icon={<MapPin className="h-3.5 w-3.5 text-emerald-500" />}
            label="出发地"
          >
            <InlineEdit
              value={m.origin}
              onChange={(v) => onChange({ origin: v })}
              disabled={disabled}
            />
          </Row>
          <Row
            icon={<Navigation className="h-3.5 w-3.5 text-brand-600" />}
            label="目的地"
          >
            <InlineEdit
              value={m.destination}
              onChange={(v) => onChange({ destination: v })}
              disabled={disabled}
            />
          </Row>

          <div className="grid grid-cols-2 gap-3">
            <Row
              icon={<Users className="h-3.5 w-3.5 text-slate-400" />}
              label="乘车人数"
            >
              <InlineEdit
                value={String(m.peopleCount)}
                onChange={(v) =>
                  onChange({
                    peopleCount: Math.max(
                      1,
                      Math.min(9, parseInt(v, 10) || 1)
                    ),
                  })
                }
                disabled={disabled}
              />
            </Row>
            <Row
              icon={<Car className="h-3.5 w-3.5 text-slate-400" />}
              label="车型"
            >
              <div
                className={cn(
                  "flex gap-1",
                  disabled && "pointer-events-none opacity-70"
                )}
              >
                {carOptions.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => onChange({ carType: c.value })}
                    className={cn(
                      "rounded-md border px-1.5 py-0.5 text-[11px] transition",
                      m.carType === c.value
                        ? "border-brand-400 bg-brand-50 text-brand-700"
                        : "border-slate-200 text-slate-500 hover:border-brand-300 hover:text-brand-600"
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </Row>
          </div>

          <Row label="用车事由">
            <InlineEdit
              value={m.reason}
              onChange={(v) => onChange({ reason: v })}
              disabled={disabled}
            />
          </Row>

          {isMatched && m.driver && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white">
                  <Car className="h-4 w-4" />
                </div>
                <div className="text-xs">
                  <div className="font-medium text-emerald-800">
                    {m.driver.name} · {m.driver.plate}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700/80">
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {m.driver.rating}
                    </span>
                    <span>预计 {m.driver.etaMin} 分钟到达</span>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Phone className="h-3.5 w-3.5" />
                联系
              </Button>
            </motion.div>
          )}
        </CardBody>

        <CardFooter>
          {m.status === "draft" && (
            <>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                取消
              </Button>
              <Button size="sm" onClick={onConfirm}>
                <CheckCircle2 className="h-4 w-4" />
                确认叫车
              </Button>
            </>
          )}
          {isDispatching && (
            <Button size="sm" disabled variant="subtle">
              <Loader2 className="h-4 w-4 animate-spin" />
              派单中，预计 8 秒内匹配司机
            </Button>
          )}
          {isMatched && (
            <Button size="sm" variant="outline">
              查看实时位置
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group flex items-start justify-between gap-3">
      <div className="flex min-w-[72px] items-center gap-1.5 pt-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </div>
      <div className="flex-1 text-right">{children}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: TaxiCardMessage["status"] }) {
  switch (status) {
    case "dispatching":
      return (
        <Badge tone="amber">
          <Loader2 className="h-3 w-3 animate-spin" /> 派单中
        </Badge>
      );
    case "matched":
      return (
        <Badge tone="green">
          <CheckCircle2 className="h-3 w-3" /> 司机已接单
        </Badge>
      );
    case "done":
      return <Badge tone="slate">已完成</Badge>;
    case "cancelled":
      return <Badge tone="red">已取消</Badge>;
    default:
      return <Badge tone="sky">待确认</Badge>;
  }
}

function RouteLine() {
  return (
    <svg
      viewBox="0 0 400 120"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="route" x1="0" x2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <path
        d="M 30 90 C 120 90, 120 40, 200 40 S 320 90, 380 30"
        stroke="url(#route)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="30" cy="90" r="5" fill="#10b981" />
      <circle cx="30" cy="90" r="10" fill="#10b981" opacity="0.2" />
      <circle cx="380" cy="30" r="5" fill="#4f46e5" />
      <circle cx="380" cy="30" r="10" fill="#4f46e5" opacity="0.2" />
    </svg>
  );
}
