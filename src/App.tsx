import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar, type TabKey } from "./app/Sidebar";
import { Workbench } from "./workbench/Workbench";
import { Plaza } from "./plaza/Plaza";

export default function App() {
  const [tab, setTab] = useState<TabKey>("workbench");

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar tab={tab} onTabChange={setTab} />
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex min-h-0 flex-1"
          >
            {tab === "workbench" ? <Workbench /> : <Plaza />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
