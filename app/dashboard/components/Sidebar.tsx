"use client"
import Link from "next/link";
import { X } from "lucide-react";

type DashboardView = "dashboard" | "recent-activity";

type SidebarProps = {
    open: boolean;
    onClose: () => void;
    activeView: DashboardView;
    onViewChange: (view: DashboardView) => void;
};

export default function Sidebar({
    open,
    onClose,
    activeView,
    onViewChange,
}: SidebarProps) {
    return (
        <>
            <aside
                id="dashboard-sidebar"
                onKeyDown={(event) => {
                    if (event.key === "Escape") onClose();
                }}
                className={`fixed inset-y-0 left-0 z-50 w-45 max-w-[85vw] shrink-0 overflow-y-auto border-r border-black/10 bg-gray-100 p-2 md:p-3 shadow-xl transition-[translate,visibility] duration-300 motion-reduce:transition-none md:visible md:static md:z-auto md:w-50 md:translate-x-0 md:shadow-none ${open ? "visible translate-x-0" : "invisible -translate-x-full"}`}
            >

                <nav aria-label="Dashboard navigation" className="space-y-4">
                    <div className="flex items-center">
                        <Link href="/" className="flex shrink-0 items-center gap-2">
                            <span className="text-[18px] font-semibold leading-none text-black border-3 border-black p-2">
                                ShipSafer
                            </span>
                        </Link>
                        <button
                            type="button"
                            aria-label="Close sidebar"
                            onClick={onClose}
                            className="ml-auto flex justify-center items-center w-8 h-8 cursor-pointer items-center gap-2 rounded-full hover:bg-black/5 md:hidden"
                        >
                            <X size={14} aria-hidden="true" />
                        </button>
                    </div>
                    <ul className="flex flex-col gap-4">
                        <li>
                            <button
                                onClick={() => {
                                    onViewChange("dashboard");
                                    onClose();
                                }}
                            >
                                Dashboard
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => {
                                    onViewChange("recent-activity");
                                    onClose();
                                }}
                            >
                                Recent Activity
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
}
