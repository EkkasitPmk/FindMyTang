"use client";
import { SidebarProvider } from "@/shared/components/animate-ui/components/radix/sidebar";

export default function MainLayoutClientIsland({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider defaultOpen className="h-dvh min-h-0 overflow-hidden">
      {children}
    </SidebarProvider>
  );
}
