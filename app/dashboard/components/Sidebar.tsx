"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Activity, ChevronRight, LayoutGrid, LogOut, ShieldCheck, X } from "lucide-react";

type DashboardView = "dashboard" | "recent-activity";
type SidebarProps = {
  open: boolean;
  onClose: () => void;
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
};

export default function Sidebar({ open, onClose, activeView, onViewChange }: SidebarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const sidebarRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  const name = session?.user?.name || "Your account";
  return (
    <>
      {open && <button type="button" className="fixed inset-0 z-40 hidden border-0 bg-[#21162c55] backdrop-blur-[3px] max-[768px]:block" aria-label="Close sidebar" onClick={onClose} />}
      <aside
        ref={sidebarRef}
        id="dashboard-sidebar"
        aria-label="Workspace sidebar"
        className={`fixed top-0 z-30 flex h-dvh w-52 flex-col overflow-y-auto border-r border-[#efedf4] bg-[#fdfcfe] px-4 pt-[23px] pb-[18px] max-[1151px]:w-[190px] max-[1151px]:px-3 max-[768px]:left-0 max-[768px]:z-50 max-[768px]:w-[248px] max-[768px]:max-w-[85vw] max-[768px]:px-4 max-[768px]:py-[22px] max-[768px]:shadow-[10px_0_40px_#1b102b18] max-[768px]:transition-[transform,visibility] max-[768px]:duration-200 min-[768px]:visible min-[768px]:translate-x-0 motion-reduce:transition-none ${open ? "visible translate-x-0" : "invisible -translate-x-full"}`}
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
          if (event.key !== "Tab" || !open) return;
          const elements = sidebarRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
          if (!elements?.length) return;
          const first = elements[0];
          const last = elements[elements.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-[9px] text-[17px] font-semibold tracking-[-0.6px] text-[#18171e] no-underline">
            <span className="grid size-[30px] place-items-center rounded-lg border border-[#ffffff70] bg-[linear-gradient(140deg,#8061fb,#5936e8)] text-white shadow-[0_2px_5px_#6540e825]"><ShieldCheck size={21} strokeWidth={1.6} /></span>
            ShipSafer
          </Link>
          <button ref={closeRef} type="button" aria-label="Close sidebar" onClick={onClose} className="hidden size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#e9e4f0] bg-[#fdfcfe] text-[#6d617c] max-[768px]:inline-flex"><X size={18} /></button>
        </div>
        <nav aria-label="Dashboard navigation" className="mt-[34px] flex flex-col gap-[7px]">
          {([
            { view: "dashboard", label: "Dashboard", icon: LayoutGrid },
            { view: "recent-activity", label: "Recent Activity", icon: Activity },
          ] as const).map(({ view, label, icon: Icon }) => (
            <button key={view} type="button" aria-current={activeView === view ? "page" : undefined} className={`flex min-h-[39px] w-full cursor-pointer items-center gap-2.5 rounded-[7px] border px-3 py-2.5 text-left transition-colors duration-150 hover:bg-[#f5f3fa] hover:text-[#4e35b1] motion-reduce:transition-none ${activeView === view ? "border-[#eeebf4] bg-[#f3f1f8] font-medium text-[#211b35] [&>svg:first-child]:text-[#7252e8]" : "border-transparent bg-transparent text-[#6d6a76]"}`} onClick={() => { onViewChange(view); onClose(); }}>
              <Icon size={17} strokeWidth={1.6} />{label}
              {activeView === view && <ChevronRight size={14} className="ml-auto text-[#8b7cae]" />}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-[100px]">
          <button type="button" className="mb-[18px] flex w-full cursor-pointer items-center gap-2.5 rounded-[7px] border-0 bg-transparent px-3 py-2.5 text-left text-[#716c7c] hover:bg-[#f6f0f2] hover:text-[#b34760]" onClick={() => router.push("/login")}><LogOut size={16} /> Logout</button>
          <div className="flex items-center gap-[9px] border-t border-[#e6e2eb] pt-[18px]">
            <span className="grid size-[34px] shrink-0 place-items-center rounded-full border-[3px] border-[#ede8fc] bg-[#ddd3f9] text-sm font-semibold text-[#6043b5]">{name.charAt(0).toUpperCase()}</span>
            <div className="flex min-w-0 flex-col gap-[3px] [&>span]:truncate [&>span]:text-xs [&>span]:font-medium [&_small]:text-[10px] [&_small]:text-[#88828f]"><span>{name}</span><small>Personal workspace</small></div>
          </div>
        </div>
      </aside>
    </>
  );
}
