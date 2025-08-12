"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./components";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const hideSidebar = pathname === "/login";

  return (
    <SidebarProvider>
      {!hideSidebar && <Sidebar />}
      {children}
    </SidebarProvider>
  );
}
