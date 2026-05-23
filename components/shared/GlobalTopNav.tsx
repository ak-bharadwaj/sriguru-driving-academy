"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LayoutDashboard, LogIn, Download } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/hooks/useTranslation";

const HIDE_TOP_NAV_PREFIXES = [
  "/instructor",
  "/admin",
  "/student",
  "/dashboard"
];

export function GlobalTopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useTranslation();
  const shouldHide = HIDE_TOP_NAV_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (shouldHide) return null;

  const isLoginPage = pathname === '/login';

  const isLoggedIn = !!session?.user;

  // Determine the correct route based on role
  let dashboardRoute = "/student/dashboard";
  if (session?.user?.role === "ADMIN") dashboardRoute = "/admin/students";
  else if (session?.user?.role === "INSTRUCTOR") dashboardRoute = "/instructor/schedule";

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-4 sm:px-6 py-4 bg-void/50 backdrop-blur-2xl border-b border-white/5 dark:border-white/5">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H7.3a2 2 0 0 0-1.6.8L3 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1-4 0m0 0H9m-6 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1-4 0" />
            <circle cx="6.5" cy="16.5" r="2.5" />
            <circle cx="16.5" cy="16.5" r="2.5" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold text-[14px] sm:text-[16px] leading-tight text-text-1 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-500 group-hover:to-indigo-500 transition-all">Sri Guru</span>
          <span className="font-body font-medium text-[10px] sm:text-[11px] leading-tight text-text-3 tracking-widest uppercase">Academy</span>
        </div>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <a 
          href="#download-app"
          className="hidden md:flex px-4 py-2 bg-white/5 hover:bg-white/10 dark:bg-white/10 dark:hover:bg-white/20 text-text-1 font-semibold text-sm rounded-full transition-colors duration-300 items-center gap-2 border border-black/5 dark:border-white/10"
        >
          <Download className="w-4 h-4" />
          <span>{t('nav.app')}</span>
        </a>
        <LanguageToggle />
        <ThemeToggle />
        {isLoggedIn ? (
          <Link
            href={dashboardRoute}
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-primary text-white font-bold text-sm rounded-full hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(var(--color-primary),0.25)] transition-all duration-300 flex items-center gap-1.5 sm:gap-2 group"
          >
            <span className="hidden sm:inline">{t('nav.dashboard')}</span>
            <LayoutDashboard className="w-4 h-4" />
          </Link>
        ) : !isLoginPage ? (
          <Link
            href="/login"
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-text-1 text-void font-bold text-sm rounded-full hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(var(--color-primary),0.2)] transition-all duration-300 flex items-center gap-1.5 sm:gap-2 group"
          >
            <span>{t('nav.portal')}</span>
            <User className="w-4 h-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
