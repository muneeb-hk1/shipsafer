"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Hero from "./Hero";
import RecentActivity from "../layout/components/RecentActivity";

type DashboardView = "dashboard" | "recent-activity";

export default function MainLayout() {
    const [sidebarOpen, setOpenSidebar] = useState(false);

    const [activeView, setActiveView] =
        useState<DashboardView>("dashboard");

    return (
        <div className="flex min-h-dvh flex-col bg-gray-100 md:flex-row">
            <Sidebar
                open={sidebarOpen}
                onClose={() => setOpenSidebar(false)}
                activeView={activeView}
                onViewChange={setActiveView}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <Navbar
                    sidebarOpen={sidebarOpen}
                    onMenuClick={() => setOpenSidebar(true)}
                />

                <main className="flex min-w-0 flex-1 flex-col">
                    {activeView === "dashboard" && <Hero />}

                    {activeView === "recent-activity" && (
                        <RecentActivity />
                    )}
                </main>
            </div>
        </div>
    );
}