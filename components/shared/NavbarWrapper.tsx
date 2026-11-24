"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import HomeNavbar from "./HomeNavbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  if (pathname === "/") return <HomeNavbar />;

  if (pathname === "/login" || pathname === "/signup" || pathname === "/dashboard") {
    return null;
  }

  return <Navbar />;
}
