"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LayoutDashboard, LogIn, Download, GraduationCap, Car, Image } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/hooks/useTranslation";
import { useSettingsStore } from "@/store/settingsStore";
import { useState, useEffect } from "react";

const HIDE_TOP_NAV_PREFIXES = [
  "/instructor",
  "/admin",
  "/student",
  "/dashboard"
];

const PUBLIC_NAV_LINKS = [
  { label: "Curriculum", href: "/#courses" },
  { label: "Instructors", href: "/#instructors" },
  { label: "Gallery", href: "/#gallery" },
];

export function GlobalTopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useTranslation();
  const { academyName, logoUrl } = useSettingsStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const shouldHide = HIDE_TOP_NAV_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (shouldHide) return null;

  const isLoginPage = pathname === '/login';
  const isLandingPage = pathname === '/';
  const isLoggedIn = !!session?.user;

  let dashboardRoute = "/student/dashboard";
  if (session?.user?.role === "ADMIN") dashboardRoute = "/admin/students";
  else if (session?.user?.role === "INSTRUCTOR") dashboardRoute = "/instructor/schedule";

  return (
    <div className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-4 sm:px-8 py-3.5 transition-all duration-500 ${
      scrolled
        ? 'bg-void/90 backdrop-blur-2xl border-b border-white/8 shadow-[0_1px_30px_rgba(0,0,0,0.3)]'
        : 'bg-transparent'
    }`}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group shrink-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
          {logoUrl ? (
            <img src={logoUrl} alt="Academy Logo" className="w-full h-full object-cover bg-white" />
          ) : (
            <Car className="w-4 h-4 text-white" />
          )}
        </div>
        <span className="font-display font-bold text-[14px] sm:text-[15px] leading-tight text-text-1 group-hover:text-violet-400 transition-colors duration-300 hidden sm:block">
          {academyName}
        </span>
      </Link>

      {/* Public anchor nav — only on landing/public pages */}
      {isLandingPage && (
        <nav className="hidden md:flex items-center gap-1">
          {PUBLIC_NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageToggle />
        <ThemeToggle />
        {isLoggedIn ? (
          <Link
            href={dashboardRoute}
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-primary text-white font-bold text-sm rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex items-center gap-1.5 sm:gap-2"
          >
            <span className="hidden sm:inline">{t('nav.dashboard')}</span>
            <LayoutDashboard className="w-4 h-4" />
          </Link>
        ) : !isLoginPage ? (
          <Link
            href="/login"
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold text-sm rounded-full backdrop-blur-xl transition-all duration-300 flex items-center gap-1.5"
          >
            <span>{t('nav.portal')}</span>
            <User className="w-4 h-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
