import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "@uploadthing/react/styles.css";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

import { GlobalTopNav } from "@/components/shared/GlobalTopNav";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AIChatbot } from "@/components/shared/AIChatbot";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { NavProgressBar } from "@/components/shared/NavProgressBar";
import { Suspense } from "react";
import { StudentLayoutWrapper } from "@/components/shared/StudentLayoutWrapper";

// Load custom fonts from next/font/google matching premium styling specs
const displayFont = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Sri Guru RTO Exam & Driving License Practice Portal",
    template: "%s | Sri Guru RTO Study"
  },
  description: "Pass your RTO Learning License Test on the first try! Practice real RTO mock exams, traffic sign questions, and interactive driving rules simulations designed for Andhra Pradesh (Nandyal) & India.",
  keywords: [
    "RTO exam prep",
    "RTO mock test",
    "Learning license test practice",
    "Andhra Pradesh RTO test",
    "Nandyal driving school RTO",
    "RTO sign questions",
    "driving test online practice",
    "Sri Guru RTO study portal"
  ],
  authors: [{ name: "Sri Guru Driving Academy" }],
  creator: "Sri Guru Driving Academy",
  publisher: "Sri Guru Driving Academy",
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://srigururto.vercel.app",
    title: "Sri Guru RTO Exam & Driving Practice Portal",
    description: "Free online RTO learning license mock tests, traffic signs practice, and driving rules simulators. Boost your confidence and pass first attempt!",
    siteName: "Sri Guru RTO Study",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Guru RTO Exam & Driving Practice Portal",
    description: "Free RTO learning license mock tests and traffic sign training.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${jetbrainsMono.variable} antialiased bg-void text-text-1 h-screen w-full selection:bg-primary/30 selection:text-primary relative overflow-hidden`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <MotionProvider>
          <AuthProvider>
            {/* Top nav progress bar — fires on every route change */}
            <Suspense fallback={null}>
              <NavProgressBar />
            </Suspense>
            <GlobalTopNav />
            <AIChatbot />

            <div className="relative z-10 flex flex-col h-screen pointer-events-none">
              <main className="pointer-events-auto flex-1 flex flex-col w-full bg-void overflow-x-hidden overflow-y-auto relative transition-colors duration-500">
                <StudentLayoutWrapper>
                  {children}
                </StudentLayoutWrapper>
              </main>
            </div>
          </AuthProvider>
        </MotionProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress harmless @react-three/fiber deprecation warning for THREE.Clock
              const originalWarn = console.warn;
              console.warn = function(...args) {
                if (args[0] && typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated')) return;
                originalWarn.apply(console, args);
              };
            `,
          }}
        />
        {process.env.NODE_ENV === "development" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for(let registration of registrations) {
                      registration.unregister();
                    }
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
