import { Poppins } from "next/font/google";

import {cn} from '@/lib/utils'
import Image from "next/image";
import { Button } from "@/components/ui/button"
import LoginButton from "@/components/auth/login-button";
import RegisterButton from "@/components/auth/register-button";


const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
 });

export default function Home() {
  return (
    <>
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-700 to-violet-900">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-semibold text-white drop-shadow-md">🔐 Auth</h1>
      <p className={cn(
        "text-white text-lg",
        font.className
        )}>A simple authentication service</p>
        <div className="space-y-5 text-center">
         <LoginButton  asChild>
          <Button variant="secondary" size="lg"  className="text-md font-bold hover:scale-[1.12] transition-all duration-500 drop-shadow-md">
            Sign In
            </Button>
         </LoginButton>
         <RegisterButton>
          <Button variant="secondary" size="lg"  className="text-md font-bold hover:scale-[1.12] transition-all duration-500 drop-shadow-md">
            Sign Up
            </Button>
         </RegisterButton>
        </div>
      </div>
    </main>
    </>
  );
}
