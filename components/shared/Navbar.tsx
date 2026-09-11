"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
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
    <header className="fixed w-screen bg-none top-0 left-0 z-50 px-10">
      <div className="mx-auto flex h-[65px] max-w-[1720px] items-center justify-between ">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-[18px] font-semibold leading-none text-black border-3 border-black p-2">
            ShipSafer
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-12 md:flex">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              {/* Main link / trigger */}
              <Link
                href={item.href || "#"}
                className="flex items-center gap-1.5 text-[15px] font-medium"
              >
                {item.label}
                {item.dropdown && (
                  <ChevronDown
                    size={16}
                    strokeWidth={1.8}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                )}
              </Link>

              {/* Dropdown menu */}
              {item.dropdown && item.items && (
                <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="min-w-[200px] rounded-xl border bg-white py-2 shadow-lg">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-6 lg:flex">
          <Link
            href="/login"
            className="flex items-center rounded-full bg-black px-8 py-3 text-[15px] text-white"
          >
            Get started
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-7 lg:hidden">
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center justify-center cursor-pointer"
          >
            {menuOpen ? (
              <X size={31} strokeWidth={2.3} />
            ) : (
              <Menu size={32} strokeWidth={2.3} />
            )}
          </button>
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