"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'
import { 
  Activity, 
  Users, 
  Calendar, 
  Database,
  Layers,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Tag,
  Settings,
  FileDown
} from 'lucide-react'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { useLanguageStore } from '@/store/languageStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useNotifications } from '@/hooks/useNotifications'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

interface NavItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  category: string
}

/** Shared nav list rendered in both desktop sidebar and mobile drawer */
function NavItemList({
  items,
  pathname,
  collapsed = false,
  onNavigate,
}: {
  items: NavItem[]
  pathname: string
  collapsed?: boolean
  onNavigate?: () => void
}) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Admin navigation">
      {items.map((item) => {
        const isActive = pathname === item.path || (item.path !== '/admin/dashboard' && pathname.startsWith(item.path))
        const Icon = item.icon
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={onNavigate}
            title={collapsed ? item.name : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-[rgb(var(--color-text-2))] hover:text-[rgb(var(--color-text-1))] hover:bg-[rgb(var(--color-border))]/50'
            }`}
          >
            <Icon className={`w-5 h-5 shrink-0 ${
              isActive ? 'text-blue-600 dark:text-blue-400' : 'text-[rgb(var(--color-text-3))]'
            }`} />
            {!collapsed && (
              <div className="flex flex-col text-left min-w-0">
                <span className="text-sm leading-tight truncate">{item.name}</span>
                <span className="text-[10px] text-[rgb(var(--color-text-3))] mt-0.5 uppercase tracking-wider">{item.category}</span>
              </div>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

const ADMIN_NAV_T = {
  EN: [
    { name: 'Student Bookings', path: '/admin/bookings', icon: Users, category: 'Bookings' },
    { name: 'Content Editor', path: '/admin/content', icon: Layers, category: 'Content' }
  ],
  HI: [
    { name: 'छात्र बुकिंग', path: '/admin/bookings', icon: Users, category: 'बुकिंग' },
    { name: 'सामग्री संपादक', path: '/admin/content', icon: Layers, category: 'सामग्री' }
  ],
  TE: [
    { name: 'విద్యార్థి బుకింగ్స్', path: '/admin/bookings', icon: Users, category: 'బుకింగ్స్' },
    { name: 'కంటెంట్ ఎడిటర్', path: '/admin/content', icon: Layers, category: 'కంటెంట్' }
  ]
}

export default function AdminConsoleLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false)
  
  const { notifications, unreadCount, markAllAsRead } = useNotifications()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  const handleNotifClick = () => {
    setNotifDropdownOpen(!notifDropdownOpen)
    if (!notifDropdownOpen) {
      markAllAsRead()
    }
  }

  const { language } = useLanguageStore()
  const { academyName, logoUrl } = useSettingsStore()
  const navItems = ADMIN_NAV_T[language] || ADMIN_NAV_T.EN

  const ADMIN_LAYOUT_DICT = {
    EN: {
      notifications: 'Notifications',
      noNotifs: 'No new notifications',
      navigation: 'Navigation',
      opsMaster: 'Ops Master',
      adminDeck: 'Admin Deck'
    },
    HI: {
      notifications: "सूचनाएं",
      noNotifs: "कोई नई सूचना नहीं",
      navigation: "नेविगेशन",
      opsMaster: "ऑप्स मास्टर",
      adminDeck: "एडमिन डेक"
    },
    TE: {
      notifications: "నోటిఫికేషన్‌లు",
      noNotifs: "కొత్త నోటిఫికేషన్‌లు లేవు",
      navigation: "నావిగేషన్",
      opsMaster: "ఆప్స్ మాస్టర్",
      adminDeck: "అడ్మిన్ డెక్"
    }
  }

  const activeLang = language.toUpperCase() as keyof typeof ADMIN_LAYOUT_DICT
  const t = ADMIN_LAYOUT_DICT[activeLang] || ADMIN_LAYOUT_DICT.EN

  return (
    <div className="h-full flex flex-col bg-[rgb(var(--color-void))] text-[rgb(var(--color-text-1))] font-sans overflow-hidden transition-colors duration-300">

      {/* TOP HEADER CONSOLE BAR */}
      <header className="sticky top-0 inset-x-0 bg-[rgb(var(--color-surface))]/80 border-b border-[rgb(var(--color-border))] backdrop-blur-xl z-40 flex shrink-0 items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 gap-2 sm:gap-3 transition-colors duration-300">
        <div className="flex items-center gap-3 min-w-0">
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="flex p-2 bg-[rgb(var(--color-surface))] hover:bg-[rgb(var(--color-border))] border border-[rgb(var(--color-border))] rounded-xl text-[rgb(var(--color-text-1))] shadow-sm transition-all z-[100] relative"
            aria-label="Open Mobile Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse hidden sm:block" />
          <Link href="/admin/dashboard" className="font-bold text-[rgb(var(--color-text-1))] tracking-tight text-sm sm:text-base uppercase flex items-center gap-2 hover:opacity-80 transition-opacity truncate">
            {logoUrl && <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain bg-white rounded-full p-0.5 border border-slate-200" />}
            <span className="truncate">{academyName}</span>
            <span className="hidden sm:inline text-blue-600 dark:text-blue-400 font-medium text-xs bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 px-2 py-0.5 rounded">OPS CONSOLE v4.5</span>
          </Link>
        </div>

        {/* Actions & Toggles */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-[rgb(var(--color-text-3))] border-r border-[rgb(var(--color-border))] pr-4">
            <span className="flex items-center gap-1.5"><Database className="w-4 h-4 text-emerald-500" /> PG: ONLINE</span>
            <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-blue-500" /> 11ms</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 relative">
            <LanguageToggle dropdownDirection="down" />
            <ThemeToggle />
            
            <button 
              onClick={handleNotifClick}
              className="relative p-2 bg-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-border))] border border-[rgb(var(--color-border))] rounded-lg text-[rgb(var(--color-text-2))] transition-all duration-200"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {notifDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 right-0 w-72 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-[rgb(var(--color-border))] font-semibold text-sm">{t.notifications}</div>
                  <div className="flex flex-col max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-[rgb(var(--color-text-3))] text-sm">{t.noNotifs}</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-3 border-b border-slate-50 dark:border-slate-800 hover:bg-[rgb(var(--color-surface))]/50 flex flex-col gap-1 transition-colors">
                          <p className="text-xs font-bold text-[rgb(var(--color-text-1))]">{n.title}</p>
                          <p className="text-xs text-[rgb(var(--color-text-2))]">{n.message}</p>
                          <span className="text-[10px] text-slate-400">{new Date(n.time).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Logout button */}
            <button 
              onClick={handleLogout}
              className="hidden sm:inline-flex p-2 bg-[rgb(var(--color-border))] hover:bg-red-50 dark:hover:bg-red-900/20 border border-[rgb(var(--color-border))] hover:border-red-200 dark:hover:border-red-800/50 rounded-lg text-[rgb(var(--color-text-2))] hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* CORE FRAME LAYOUT SECTION */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* DESKTOP SIDEBAR */}
        <aside 
          className={`hidden xl:flex flex-col border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] h-full z-30 transition-all duration-300 overflow-y-auto scrollbar-thin p-4 ${
            collapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
              {!collapsed && (
                <span className="text-xs uppercase tracking-wider text-[rgb(var(--color-text-3))] font-bold px-2">{t.navigation}</span>
              )}
              <button 
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 bg-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-border))] border border-[rgb(var(--color-border))] rounded-lg text-[rgb(var(--color-text-2))] transition-all ml-auto"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>

            <div className="h-px bg-[rgb(var(--color-border))]" />

            <nav className="flex flex-col gap-3">
              <NavItemList
                items={navItems}
                pathname={pathname}
                collapsed={collapsed}
              />
            </nav>

            <div className="mt-auto border-t border-[rgb(var(--color-border))] pt-4 flex flex-col gap-2">
              {!collapsed ? (
                <div className="flex flex-col gap-2">
                  <div className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                      OP
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-[rgb(var(--color-text-1))]">{t.opsMaster}</span>
                      <span className="text-xs text-[rgb(var(--color-text-3))]">{t.adminDeck}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 rounded-xl text-red-500 hover:text-red-400 flex items-center justify-center gap-2 text-xs font-bold transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-500 flex items-center justify-center mx-auto transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[90] xl:hidden"
              />
              
              <motion.aside 
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-80 bg-[rgb(var(--color-surface))] border-r border-[rgb(var(--color-border))] z-[100] p-6 xl:hidden flex flex-col gap-6 overflow-y-auto shadow-2xl safe-area-inset-top safe-area-inset-bottom"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-wider text-[rgb(var(--color-text-3))] font-bold">{t.navigation}</span>
                  <button onClick={() => setMobileOpen(false)} className="p-2 bg-[rgb(var(--color-border))] rounded-lg text-[rgb(var(--color-text-3))] hover:text-[rgb(var(--color-text-1))] dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="h-px bg-[rgb(var(--color-border))]" />

                <NavItemList
                  items={navItems}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />

                <div className="mt-auto flex flex-col gap-3">
                  <div className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-sm">
                      OP
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-[rgb(var(--color-text-1))]">{t.opsMaster}</span>
                      <span className="text-xs text-[rgb(var(--color-text-3))]">{t.adminDeck}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 rounded-xl text-red-500 hover:text-red-400 flex items-center justify-center gap-2 text-sm font-bold transition-all"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* MAIN WORKSPACE WRAPPER */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 relative z-10 w-full min-h-0">
          <div className="w-full px-4 sm:px-6 pt-4 sm:pt-6 pb-10" style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom, 0px))' }}>
            <Breadcrumbs />
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
