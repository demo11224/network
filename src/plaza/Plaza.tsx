import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Boxes,
  Building,
  Car,
  CircleDollarSign,
  Filter,
  FlaskConical,
  Flame,
  Headphones,
  Hammer,
  LifeBuoy,
  Network,
  Play,
  ReceiptText,
  Search,
  Shield,
  Sparkles,
  Star,
  Ticket,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";

type Persona = "all" | "dev" | "finance" | "ops" | "hr";
type Dept = "all" | "it" | "finance" | "ops" | "hr";
type Scene = "all" | "office" | "ops" | "travel" | "it";

interface Agent {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
  heat: number;
  tags: string[];
  dept: Exclude<Dept, "all">;
  scene: Exclude<Scene, "all">;
  personas: Exclude<Persona, "all">[];
  accent: "brand" | "emerald" | "amber" | "sky" | "rose" | "violet";
}

const AGENTS: Agent[] = [
  {
    id: "net-fault",
    name: "网络故障闭环处理",
    desc: "端到端定位 IP/光路/设备故障，自动派单并跟踪 SLA。",
    icon: <Network className="h-5 w-5" />,
    heat: 4821,
    tags: ["L3 告警", "SLA 自追"],
    dept: "ops",
    scene: "ops",
    personas: ["dev", "ops"],
    accent: "brand",
  },
  {
    id: "eoms",
    name: "EOMS 工单助手",
    desc: "自动识别工单类型、自动派发给最合适的专家组。",
    icon: <Ticket className="h-5 w-5" />,
    heat: 3920,
    tags: ["AI 派单", "知识检索"],
    dept: "ops",
    scene: "ops",
    personas: ["dev", "ops"],
    accent: "sky",
  },
  {
    id: "finance-reimburse",
    name: "财务报销",
    desc: "OCR 识别发票，一键生成差旅/业务报销单，直连 OA。",
    icon: <CircleDollarSign className="h-5 w-5" />,
    heat: 6412,
    tags: ["OCR", "OA 直连"],
    dept: "finance",
    scene: "office",
    personas: ["finance", "dev", "ops", "hr"],
    accent: "emerald",
  },
  {
    id: "it-invoice",
    name: "IT 发票通",
    desc: "为 IT 采购/云服务账单自动开具增值税专票，核销入账。",
    icon: <ReceiptText className="h-5 w-5" />,
    heat: 2184,
    tags: ["电子专票", "台账"],
    dept: "finance",
    scene: "office",
    personas: ["finance"],
    accent: "amber",
  },
  {
    id: "taxi",
    name: "企业用车",
    desc: "一句话叫车/包车，行程与报销自动打通。",
    icon: <Car className="h-5 w-5" />,
    heat: 9120,
    tags: ["多平台比价", "自动报销"],
    dept: "hr",
    scene: "travel",
    personas: ["dev", "finance", "ops", "hr"],
    accent: "violet",
  },
  {
    id: "it-helpdesk",
    name: "IT 服务台",
    desc: "电脑/权限/账号/打印机…常见 IT 问题 1 分钟自助闭环。",
    icon: <Headphones className="h-5 w-5" />,
    heat: 5610,
    tags: ["AI 自助", "知识图谱"],
    dept: "it",
    scene: "it",
    personas: ["dev", "ops", "hr"],
    accent: "sky",
  },
  {
    id: "hr-onboarding",
    name: "员工生命周期",
    desc: "入转调离全流程表单自动生成与审批。",
    icon: <UserCog className="h-5 w-5" />,
    heat: 1834,
    tags: ["流程机器人"],
    dept: "hr",
    scene: "office",
    personas: ["hr"],
    accent: "rose",
  },
  {
    id: "meeting",
    name: "会议助理",
    desc: "自动预订会议室、纪要转写、行动项分派。",
    icon: <Building className="h-5 w-5" />,
    heat: 3322,
    tags: ["多端接入", "纪要转写"],
    dept: "hr",
    scene: "office",
    personas: ["dev", "finance", "ops", "hr"],
    accent: "brand",
  },
];

const PERSONA_OPTIONS = [
  { value: "all" as const, label: "全部身份", icon: <Users className="h-4 w-4 text-slate-400" /> },
  { value: "dev" as const, label: "研发工程师", icon: <Hammer className="h-4 w-4 text-brand-500" /> },
  { value: "finance" as const, label: "财务专员", icon: <CircleDollarSign className="h-4 w-4 text-emerald-500" /> },
  { value: "ops" as const, label: "运维专家", icon: <Wrench className="h-4 w-4 text-sky-500" /> },
  { value: "hr" as const, label: "HR / 行政", icon: <UserCog className="h-4 w-4 text-rose-500" /> },
];

const DEPT_OPTIONS = [
  { value: "all" as const, label: "全部部门" },
  { value: "it" as const, label: "IT" },
  { value: "finance" as const, label: "财务" },
  { value: "ops" as const, label: "运维" },
  { value: "hr" as const, label: "HR / 行政" },
];

const SCENE_OPTIONS = [
  { value: "all" as const, label: "全部场景" },
  { value: "office" as const, label: "日常办公" },
  { value: "ops" as const, label: "运维保障" },
  { value: "travel" as const, label: "出行差旅" },
  { value: "it" as const, label: "IT 自助" },
];

const accentBg: Record<Agent["accent"], string> = {
  brand: "from-brand-500 to-brand-700",
  emerald: "from-emerald-500 to-emerald-700",
  amber: "from-amber-500 to-orange-600",
  sky: "from-sky-500 to-sky-700",
  rose: "from-rose-500 to-rose-700",
  violet: "from-violet-500 to-violet-700",
};

export function Plaza() {
  const [persona, setPersona] = useState<Persona>("all");
  const [dept, setDept] = useState<Dept>("all");
  const [scene, setScene] = useState<Scene>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const base = AGENTS.filter((a) => {
      if (dept !== "all" && a.dept !== dept) return false;
      if (scene !== "all" && a.scene !== scene) return false;
      if (q && !a.name.includes(q) && !a.desc.includes(q)) return false;
      return true;
    });
    const withRank = base.map((a) => ({
      ...a,
      highlight: persona !== "all" && a.personas.includes(persona as any),
      rank:
        persona !== "all" && a.personas.includes(persona as any)
          ? a.heat * 2
          : a.heat,
    }));
    return withRank.sort((a, b) => b.rank - a.rank);
  }, [persona, dept, scene, q]);

  const activePersona = PERSONA_OPTIONS.find((p) => p.value === persona);

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-6 lg:px-8">
        {/* Hero - compact */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-brand-600">
              <Sparkles className="h-3.5 w-3.5" />
              AGENT MARKETPLACE
            </div>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 lg:text-2xl">
              智能体广场
              <span className="ml-2 align-middle text-xs font-normal text-slate-400">
                共 {AGENTS.length} 个原子能力
              </span>
            </h1>
            <p className="mt-1 hidden max-w-2xl text-[13px] text-slate-500 md:block">
              按部门 / 场景筛选，切换身份沙箱后系统将按权限与使用偏好智能排序与高亮。
            </p>
          </div>
          <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-soft lg:flex">
            <Users className="h-4 w-4 text-slate-400" />
            <div className="text-[11px] leading-tight">
              <div className="font-medium text-slate-700">当前身份</div>
              <div className="text-slate-400">{activePersona?.label}</div>
            </div>
          </div>
        </motion.div>

        {/* Filters + Persona sandbox (核心交互提到这里) */}
        <div className="mt-5 space-y-3">
          {/* Persona Sandbox - 独立一行，最显眼 */}
          <motion.div
            layout
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 via-white to-sky-50 px-4 py-3 shadow-soft"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
                <FlaskConical className="h-3.5 w-3.5" />
              </div>
              <div className="text-[12px] leading-tight">
                <div className="font-semibold text-brand-700">
                  身份沙箱模拟
                </div>
                <div className="text-[11px] text-slate-500">
                  切换身份，广场自动重排序并高亮推荐
                </div>
              </div>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-1.5">
              {PERSONA_OPTIONS.map((p) => {
                const active = persona === p.value;
                return (
                  <button
                    key={p.value}
                    onClick={() => setPersona(p.value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition",
                      active
                        ? "border-brand-500 bg-brand-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
                    )}
                  >
                    {p.icon}
                    {p.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Dept / Scene / Search */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Filter className="h-3.5 w-3.5" />
              部门
            </div>
            <Select
              className="w-[140px]"
              size="sm"
              value={dept}
              onChange={(v) => setDept(v as Dept)}
              options={DEPT_OPTIONS}
            />
            <div className="ml-1 flex items-center gap-2 text-xs text-slate-500">
              场景
            </div>
            <Select
              className="w-[150px]"
              size="sm"
              value={scene}
              onChange={(v) => setScene(v as Scene)}
              options={SCENE_OPTIONS}
            />
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="搜索智能体..."
                  className="h-8 w-[200px] rounded-lg border border-slate-200 bg-white pl-7 pr-2 text-[13px] outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <Badge tone="brand">
                <Boxes className="h-3 w-3" />
                命中 {filtered.length}
              </Badge>
            </div>
          </div>
        </div>

        {/* Grid with layout animation */}
        <motion.div
          layout
          className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence>
            {filtered.map((a) => (
              <AgentCard key={a.id} agent={a} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <Shield className="h-3 w-3" />
          所有智能体均运行在 M 域独立沙箱，数据不出域 · Cursor Demo
        </div>
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent & { highlight?: boolean } }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white p-4 shadow-soft transition",
        "hover:shadow-elev",
        agent.highlight
          ? "border-brand-300 ring-2 ring-brand-200/60"
          : "border-slate-200"
      )}
    >
      {agent.highlight && (
        <motion.div
          layoutId={`${agent.id}-glow`}
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50/80 via-transparent to-transparent"
        />
      )}
      <div className="relative flex items-start justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
            accentBg[agent.accent]
          )}
        >
          {agent.icon}
        </div>
        <div className="flex items-center gap-1 text-[11px] font-medium text-amber-600">
          <Flame className="h-3.5 w-3.5" />
          {agent.heat.toLocaleString()}
        </div>
      </div>

      <div className="relative mt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <h3 className="text-sm font-semibold text-slate-900">{agent.name}</h3>
          {agent.highlight && (
            <Badge tone="brand">
              <BadgeCheck className="h-3 w-3" />
              推荐
            </Badge>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-slate-500">
          {agent.desc}
        </p>
      </div>

      <div className="relative mt-3 flex flex-wrap gap-1.5">
        {agent.tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500"
          >
            <Star className="h-2.5 w-2.5 text-brand-400" />
            {t}
          </span>
        ))}
      </div>

      <div className="relative mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <LifeBuoy className="h-3 w-3" />
          平均 {Math.round(agent.heat / 12)} 次/月
        </div>
        <Button size="sm" variant={agent.highlight ? "primary" : "outline"}>
          <Play className="h-3.5 w-3.5" />
          启动
        </Button>
      </div>
    </motion.div>
  );
}
