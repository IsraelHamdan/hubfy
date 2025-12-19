import SidebarComponent from "@/components/SideBar";
import { Metadata } from "next";
import { ReactNode } from "react";
import { getQueryClient } from "../lib/queryClient";
import useTasks, { findTasksByUser } from "@/hooks/useTasks";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "Task Mind | Dashboard",
};

export default async function DashboardLayout({ children }: { children: ReactNode; }) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tasks"],
    queryFn: findTasksByUser
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 overflow-y-auto p-2">
        <HydrationBoundary state={dehydratedState}>
          {children}
        </HydrationBoundary>
      </main>
    </div>

  );
}