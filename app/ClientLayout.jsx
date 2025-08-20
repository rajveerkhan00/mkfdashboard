"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./components";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const hideSidebar = pathname === "/login";

  return (
    <SessionProvider>
      <SidebarProvider>
        {!hideSidebar && <Sidebar />}
        {children}
      </SidebarProvider>
    </SessionProvider>
  );
}
