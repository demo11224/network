import { motion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FileSignature,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/Card";
import { InlineEdit } from "@/components/ui/InlineEdit";
import { cn } from "@/lib/cn";
import type { ReimburseCardMessage } from "../types";

export function ReimburseCard({
  m,
  onChange,
  onSubmit,
}: {
  m: ReimburseCardMessage;
  onChange: (patch: Partial<ReimburseCardMessage>) => void;
  onSubmit: () => void;
}) {
  const isSubmitting = m.status !== "draft";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="w-full max-w-[460px]"
    >
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-medium uppercase tracking-wider text-brand-600">
              FINANCE · 报销单据
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {m.title}
            </div>
          </div>
          <StatusBadge status={m.status} />
        </CardHeader>
        <CardBody className="relative space-y-3">
          <StampWatermark status={m.status} />

          <Row
            icon={<CircleDollarSign className="h-3.5 w-3.5 text-emerald-500" />}
            label="金额"
          >
            <div className="flex items-center justify-end gap-1">
              <span className="text-xs text-slate-400">{m.currency}</span>
              <InlineEdit
                disabled={isSubmitting}
                value={m.amount.toFixed(2)}
                onChange={(v) =>
                  onChange({ amount: parseFloat(v) || 0 })
                }
                inputClassName="text-right"
              />
            </div>
          </Row>
          <Row
            icon={<CalendarDays className="h-3.5 w-3.5 text-slate-400" />}
            label="发生日期"
          >
            <InlineEdit
              disabled={isSubmitting}
              value={m.occurredOn}
              onChange={(v) => onChange({ occurredOn: v })}
            />
          </Row>
          <Row
            icon={<Building2 className="h-3.5 w-3.5 text-slate-400" />}
            label="商户"
          >
            <InlineEdit
              disabled={isSubmitting}
              value={m.merchant}
              onChange={(v) => onChange({ merchant: v })}
            />
          </Row>
          <Row label="费用类别">
            <InlineEdit
              disabled={isSubmitting}
              value={m.category}
              onChange={(v) => onChange({ category: v })}
            />
          </Row>
          <Row label="事由说明">
            <InlineEdit
              disabled={isSubmitting}
              value={m.description}
              onChange={(v) => onChange({ description: v })}
            />
          </Row>
        </CardBody>
        <CardFooter>
          {m.status === "draft" ? (
            <>
              <Button variant="ghost" size="sm">
                保存草稿
              </Button>
              <Button size="sm" onClick={onSubmit}>
                <FileSignature className="h-4 w-4" />
                提交审批
              </Button>
            </>
          ) : (
            <Button size="sm" variant="subtle" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
              审批流转中
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
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-[72px] items-center gap-1.5 pt-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </div>
      <div className="flex-1 text-right">{children}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: ReimburseCardMessage["status"] }) {
  if (status === "draft") return <Badge tone="sky">草稿</Badge>;
  if (status === "submitting")
    return (
      <Badge tone="amber">
        <Loader2 className="h-3 w-3 animate-spin" /> 提交中
      </Badge>
    );
  if (status === "approving")
    return (
      <Badge tone="brand">
        <Loader2 className="h-3 w-3 animate-spin" /> 审批中
      </Badge>
    );
  return (
    <Badge tone="green">
      <CheckCircle2 className="h-3 w-3" /> 已完成
    </Badge>
  );
}

function StampWatermark({
  status,
}: {
  status: ReimburseCardMessage["status"];
}) {
  const show = status === "submitting" || status === "approving";
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -30, scale: 1.6 }}
      animate={{ opacity: 1, rotate: -16, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
      className={cn(
        "pointer-events-none absolute right-4 top-0 select-none",
        "rounded-md border-[3px] border-brand-500/60 px-3 py-1 text-sm font-bold tracking-widest text-brand-600/70"
      )}
    >
      流转中
    </motion.div>
  );
}
