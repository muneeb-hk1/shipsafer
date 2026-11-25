"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShieldCheck, X } from "lucide-react";
import styles from "./HomeNavbar.module.css";

export default function HomeNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="ShipSafer home" onClick={() => setMenuOpen(false)}><ShieldCheck size={28} strokeWidth={1.7} aria-hidden="true" />ShipSafer</Link>
        <nav className={styles.desktopNav} aria-label="Main navigation"><a href="#workflow">Workflow</a><a href="#features">Features</a></nav>
        <Link className={styles.getStarted} href="/login">Get started</Link>
        <button className={styles.menuButton} type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="home-mobile-menu" onClick={() => setMenuOpen(!menuOpen)} onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false); }}>
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
      <nav id="home-mobile-menu" aria-label="Mobile navigation" className={styles.mobileNav} hidden={!menuOpen} onKeyDown={(event) => { if (event.key === "Escape") { setMenuOpen(false); document.querySelector<HTMLButtonElement>(`.${styles.menuButton}`)?.focus(); } }}>
        <a href="#workflow" onClick={() => setMenuOpen(false)}>Workflow</a><a href="#features" onClick={() => setMenuOpen(false)}>Features</a><Link href="/login" onClick={() => setMenuOpen(false)}>Get started</Link>
      </nav>
    </header>
  );
}
