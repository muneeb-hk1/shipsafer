"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, PanelLeft } from "lucide-react";
import Image from "next/image";

type NavbarProps = {
    sidebarOpen: boolean;
    onMenuClick: () => void;
}

export default function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
        {
            label: "Products",
            dropdown: true,
            items: [
                { label: "Product A", href: "/products/a" },
                { label: "Product B", href: "/products/b" },
                { label: "Product C", href: "/products/c" },
            ],
        },
        {
            label: "Solutions",
            dropdown: true,
            items: [
                { label: "For Startups", href: "/solutions/startups" },
                { label: "For Enterprise", href: "/solutions/enterprise" },
            ],
        },
        {
            label: "Learning & support",
            dropdown: true,
            items: [
                { label: "Documentation", href: "/docs" },
                { label: "Guides", href: "/guides" },
                { label: "Support", href: "/support" },
            ],
        },
        {
            label: "Pricing",
            dropdown: false,
            href: "/pricing",
        },
    ];

    return (
        <header className="w-full shrink-0 bg-white border-b border-black/10">
            <div className="flex h-[55px] items-center justify-between px-4 sm:px-6 lg:px-2">
                {/* Logo */}
                <div className="flex items-center">
                    <button type="button" aria-label="Open sidebar" aria-controls="dashboard-sidebar" aria-expanded={sidebarOpen} onClick={onMenuClick} className="mr-2 flex h-8 w-8 items-center justify-center rounded-full cursor-pointer hover:bg-black/5 md:hidden"><PanelLeft className="w-4"/></button>
                    <Link href="/" className="hidden md:flex shrink-0 items-center gap-2">
                        <span className="text-[18px] font-semibold leading-none text-black">
                            Welcome
                        </span>
                    </Link>
                </div>


               

                {/* Desktop actions */}
                <div className="flex items-center gap-3">
                    <a><Image src="/muneeb.png" alt="Logo" width={50} height={50} className="rounded-full h-9 w-9 object-cover" /></a>
                    <Link
                        href="/login"
                        className="flex items-center rounded-full bg-black px-5 py-2 text-[15px] text-white"
                    >
                        Get started
                    </Link>
                </div>

               
            </div>

            {/* Mobile dropdown */}
            <div
                className={`overflow-hidden border-t border-black/10 bg-white transition-all duration-300 lg:hidden ${menuOpen ? "max-h-[600px]" : "max-h-0 border-t-0"
                    }`}
            >
                <nav className="flex flex-col px-6 py-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href="#"
                            className="flex items-center justify-between border-b border-black/10 py-5 text-[18px] font-medium"
                        >
                            {item.label}

                            {item.dropdown && <ChevronDown size={18} />}
                        </Link>
                    ))}


                </nav>
            </div>
        </header>
    );
}
