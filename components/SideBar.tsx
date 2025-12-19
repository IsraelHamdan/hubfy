'use client';
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { SidebarButtonProps } from "@/types/sidebarButton";
import { Activity } from "react";
import { ListChecks, LogOut, PanelLeft, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";
import Tipography from "./Tipography";
import { cn } from "@/lib/utils";

function SidebarButton({ to, icon, label, active }: SidebarButtonProps) {
  const { state } = useSidebar();

  return (
    <Link
      href={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        active && "bg-slate-200",
        state === "collapsed" && "flex-col gap-1 text-xs"
      )}
    >
      {icon}
      <span
        className={cn(
          "transition-all",
          state === "collapsed" ? "text-center" : "text-sm"
        )}
      >
        {label}
      </span>
    </Link>
  );
}


export default function SidebarComponent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const quit = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <Sidebar collapsible="icon"
    >
      <SidebarHeader>
        <div className="px-2 py-1">
          <p className="text-sm font-semibold leading-tight">
            {user?.name}
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <ListChecks size={30} />
                <Tipography variant="p">Dashboard</Tipography>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuButton onClick={() => { quit(); }}>
          <LogOut />
          <Tipography variant="span">Sair</Tipography>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
