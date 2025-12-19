import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";
import Tipography from "@/components/Tipography";
import { Metadata } from "next";
import { ReactNode } from "react";


export const metadata: Metadata = {
  title: "Task Mind | login",
};


export default function LoginLayout({ children }: { children: ReactNode; }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BubbleBackground className="w-full h-full" />
      </div>

      {/* MOBILE */}
      <div className="
        relative z-10
        min-h-screen
        flex flex-col
        items-center
        justify-center
        gap-4
        px-4
        lg:hidden
      ">
        <Tipography
          variant="h1"
          className="text-white text-4xl font-bold"
        >
          Task Mind
        </Tipography>

        {children}
      </div>

      {/* DESKTOP */}
      <div className="
        relative z-10
        hidden lg:grid
        min-h-screen
        grid-cols-[1fr_1fr]
      ">
        {/* BRAND */}
        <div className="
          flex
          items-start
          justify-start
          pt-10
          pl-16
        ">
          <Tipography
            variant="h1"
            className="text-white text-5xl font-bold"
          >
            Task Mind
          </Tipography>
        </div>

        {/* CARD */}
        <div className="
          flex
          items-center
          justify-center
          pr-16
        ">
          {children}
        </div>
      </div>
    </div>
  );
}