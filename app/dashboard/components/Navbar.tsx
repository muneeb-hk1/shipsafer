"use client";

import { useSession } from "next-auth/react";
import { PanelLeft, ShieldCheck } from "lucide-react";

type NavbarProps = {
  sidebarOpen: boolean;
  onMenuClick: () => void;
  activeView: "dashboard" | "recent-activity";
};

export default function Navbar({ onMenuClick, sidebarOpen, activeView }: NavbarProps) {
  const { data: session } = useSession();
  return (
    <header className="flex min-h-[73px] items-center justify-between gap-[18px] border-b border-[#edebf3] px-6 py-4 max-[768px]:min-h-[66px] max-[768px]:px-[18px] max-[768px]:py-3.5 max-[541px]:gap-2 max-[541px]:px-3.5">
      <div className="flex items-center gap-2.5 text-xs">
        <button type="button" aria-label="Open sidebar" aria-controls="dashboard-sidebar" aria-expanded={sidebarOpen} onClick={onMenuClick} className="hidden size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#e9e4f0] bg-[#fdfcfe] text-[#6d617c] max-[768px]:inline-flex">
          <PanelLeft size={19} />
        </button>
        <span>{activeView === "dashboard" ? "Dashboard" : "Recent Activity"}</span>
      </div>
      <div className="flex min-w-0 items-center gap-5 max-[768px]:gap-0">
        <span className="max-w-60 truncate text-[11px] text-[#77717f] max-[1151px]:hidden">Welcome{session?.user?.name ? `, ${session.user.name}` : ""}</span>
        <span className="inline-flex items-center gap-[7px] rounded-lg border border-[#e7e0fa] bg-[linear-gradient(120deg,#f0e9ff,#f6f3fd)] px-3 py-[9px] text-[11px] whitespace-nowrap text-[#6a4cb1] max-[541px]:gap-[5px] max-[541px]:p-2 max-[541px]:text-[10px]"><ShieldCheck size={15} /> Your workspace</span>
      </div>
    </header>
  );
}
