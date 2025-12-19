import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Task Mind | Dashboard",
};

export default function DashboardLayout({ children }: { children: ReactNode; }) {
  return (
    <main>
      {children}
    </main>
  );
}