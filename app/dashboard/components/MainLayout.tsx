"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Hero from "./Hero";
import RecentActivity from "../layout/components/RecentActivity";

type DashboardView = "dashboard" | "recent-activity";

export default function MainLayout() {
    const [sidebarOpen, setOpenSidebar] = useState(false);

    const [activeView, setActiveView] =
        useState<DashboardView>("dashboard");

    useEffect(() => {
        const desktop = window.matchMedia("(min-width: 768px)");
        const closeOnDesktop = () => {
            if (desktop.matches) setOpenSidebar(false);
        };
        desktop.addEventListener("change", closeOnDesktop);
        return () => desktop.removeEventListener("change", closeOnDesktop);
    }, []);

    return (
        <div className="min-h-dvh bg-[#e4e7ea] text-[13px] font-normal text-[#18171e] [font-family:var(--font-geist-sans),Arial,sans-serif] max-[1151px]:p-6 max-[768px]:p-0 [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-solid [&_button:focus-visible]:outline-[#8965ec] [&_button:focus-visible]:outline-offset-3 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-solid [&_a:focus-visible]:outline-[#8965ec] [&_a:focus-visible]:outline-offset-3">
          <div className="mx-auto flex min-h-dvh w-full max-w-[1840px] overflow-clip border border-[#ffffffa6] bg-[#f6f5fa] shadow-[0_8px_40px_#29223e04] max-[1151px]:min-h-dvh max-[768px]:min-h-dvh max-[768px]:rounded-none max-[768px]:border-0">
            <Sidebar
                open={sidebarOpen}
                onClose={() => setOpenSidebar(false)}
                activeView={activeView}
                onViewChange={setActiveView}
            />

            <div className="ml-52 flex min-w-0 flex-1 flex-col max-[1151px]:ml-[190px] max-[768px]:ml-0">
                <Navbar
                    sidebarOpen={sidebarOpen}
                    onMenuClick={() => setOpenSidebar(true)}
                    activeView={activeView}
                />

                <main className="min-w-0 flex-1">
                    {activeView === "dashboard" && <Hero />}

                    {activeView === "recent-activity" && (
                        <RecentActivity />
                    )}
                </main>
            </div>
          </div>
        </div>
    );
}
