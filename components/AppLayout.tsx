"use client";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SidebarComponent from "@/components/SideBar";
import { useAuth } from "@/components/AuthProvider";
import Tipography from "./Tipography";
import { usePathname } from "next/navigation";

export function AppLayout({ children }: { children: React.ReactNode; }) {
  const { user } = useAuth();
  const pathName = usePathname();

  return (
    <SidebarProvider>
      {/* Sidebar só aparece se autenticado */}
      {user && <SidebarComponent />}

      <SidebarInset className="min-h-screen flex flex-col">
        {/* Header mobile só se autenticado */}
        {user && (
          <header className="flex items-center gap-2 border-b px-4 py-2">
            <SidebarTrigger />
            <Tipography variant="p" className="font-semibold">{pathName}</Tipography>
          </header>
        )}

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
