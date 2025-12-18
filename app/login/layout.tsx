import { Metadata } from "next";
import { ReactNode } from "react";


export const metadata: Metadata = {
  title: "Minhas tarefas | login",
};


export default function LoginLayout({ children }: { children: ReactNode; }) {
  return (
    { children }
  );
}