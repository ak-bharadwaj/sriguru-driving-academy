import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";

import { GlobalTopNav } from "@/components/shared/GlobalTopNav";
import { AuthProvider } from "@/components/providers/AuthProvider";

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
  title: "Sri Guru Driving Academy",
  description: "Learn to drive with high-fidelity gamified instruction, analytics, and elite rewards.",
  manifest: "/manifest.json",
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
        <AuthProvider>
          <GlobalTopNav />

          <div className="relative z-10 flex flex-col h-screen pointer-events-none">
            <main className="pointer-events-auto flex-1 flex flex-col w-full bg-void overflow-x-hidden overflow-y-auto relative transition-colors duration-500">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
