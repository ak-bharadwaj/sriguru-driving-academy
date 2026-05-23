import { AmbientBackground } from "@/components/shared/AmbientBackground";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        <AmbientBackground />
      </div>
      <div className="w-full min-h-full bg-void/50 backdrop-blur-3xl">
        {children}
      </div>
    </>
  );
}
