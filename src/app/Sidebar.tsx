import { motion } from "framer-motion";
import {
  BookOpen,
  History,
  LayoutGrid,
  MessageSquareText,
  Settings2,
  Shield,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

export type TabKey = "workbench" | "plaza";

interface SidebarProps {
  tab: TabKey;
  onTabChange: (t: TabKey) => void;
}

const primaryItems: { key: TabKey; label: string; icon: LucideIcon; hint?: string }[] = [
  { key: "workbench", label: "工作台", icon: MessageSquareText, hint: "Tab 1" },
  { key: "plaza", label: "智能体广场", icon: LayoutGrid, hint: "Tab 2" },
];

const secondaryItems: { label: string; icon: LucideIcon; badge?: string }[] = [
  { label: "历史会话", icon: History },
  { label: "知识库", icon: BookOpen, badge: "Beta" },
  { label: "沙箱配置", icon: Shield },
  { label: "系统设置", icon: Settings2 },
];

export function Sidebar({ tab, onTabChange }: SidebarProps) {
  return (
    <aside className="relative flex h-full w-[232px] shrink-0 flex-col border-r border-slate-200 bg-white/70 backdrop-blur">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-slate-900">
            M · 入口智能体
          </div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            ENTRY AGENT · v1.0
          </div>
        </div>
      </div>

      <div className="mx-3 mb-2 mt-1 h-px bg-slate-100" />

      <nav className="flex flex-col gap-1 px-3">
        {primaryItems.map((item) => {
          const active = tab === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={cn(
                "group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {active && (
                <motion.span
                  layoutId="side-active"
                  className="absolute inset-0 rounded-xl bg-brand-50 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.25)]"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative flex items-center gap-2.5">
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
              {item.hint && (
                <span
                  className={cn(
                    "relative rounded px-1.5 py-0.5 text-[10px] tracking-wider",
                    active
                      ? "bg-white text-brand-600"
                      : "bg-slate-100 text-slate-400"
                  )}
                >
                  {item.hint}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mx-3 my-4 h-px bg-slate-100" />

      <div className="px-5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        工作区
      </div>
      <nav className="mt-2 flex flex-col gap-0.5 px-3">
        {secondaryItems.map((it) => (
          <button
            key={it.label}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <span className="flex items-center gap-2.5">
              <it.icon className="h-4 w-4" />
              {it.label}
            </span>
            {it.badge && (
              <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] text-brand-600">
                {it.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-semibold text-white">
              ZS
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-slate-800">
                张工 · 研发中心
              </div>
              <div className="truncate text-[11px] text-slate-400">
                M 域 · Level 3 权限
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
