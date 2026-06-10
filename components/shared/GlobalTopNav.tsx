"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LayoutDashboard, LogIn, Download, GraduationCap, Car } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/hooks/useTranslation";
import { useSettingsStore } from "@/store/settingsStore";
import { useState, useEffect } from "react";
import NextImage from "next/image";

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
    <div className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-3 sm:px-8 py-3 transition-all duration-500 ${
      scrolled
        ? 'bg-void/90 backdrop-blur-2xl border-b border-white/8 shadow-[0_1px_30px_rgba(0,0,0,0.3)]'
        : 'bg-transparent'
    }`}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-md shadow-black/10 group-hover:scale-105 transition-transform duration-300 overflow-hidden bg-white border border-slate-200 shrink-0">
          {logoUrl ? (
            <NextImage 
              src={logoUrl} 
              alt="Academy Logo" 
              width={44} 
              height={44} 
              priority={true} 
              className="w-[92%] h-[92%] object-contain" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        <span className="font-display font-bold text-[15px] min-[390px]:text-[17px] md:text-xl leading-tight text-text-1 group-hover:text-violet-400 transition-colors duration-300 truncate max-w-[160px] min-[390px]:max-w-[220px] md:max-w-none">
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
      <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
        <LanguageToggle />
        <ThemeToggle />
        {isLoggedIn ? (
          <Link
            href={dashboardRoute}
            className="p-2 md:px-5 md:py-2.5 bg-primary text-white font-bold text-sm rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 shrink-0"
            title={t('nav.dashboard')}
          >
            <span className="hidden md:inline">{t('nav.dashboard')}</span>
            <LayoutDashboard className="w-4.5 h-4.5 sm:w-4 sm:h-4" />
          </Link>
        ) : !isLoginPage ? (
          <Link
            href="/login"
            className="p-2 md:px-5 md:py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold text-sm rounded-full backdrop-blur-xl transition-all duration-300 flex items-center justify-center gap-1.5 shrink-0"
            title={t('nav.portal')}
          >
            <span className="hidden md:inline">{t('nav.portal')}</span>
            <User className="w-4.5 h-4.5 sm:w-4 sm:h-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
