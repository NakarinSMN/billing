"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import Link from "next/link";
import { CarIcon } from "@/components/icons/car-icon";
import { MotorcycleIcon } from "@/components/icons/motorcycle-icon";
import { CarpetIcon } from "@/components/icons/carpet-icon";
import { CustomerIcon } from "@/components/icons/customer-icon";
import { PricingIcon } from "@/components/icons/pricing-icon";
import { AboutIcon } from "@/components/icons/about-icon";
import { useState, useEffect } from "react";

type NavButton = {
  href: string;
  icon: React.ReactNode;
  text: string;
};

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navButtons: NavButton[] = [
    // {
    //   href: "/car-billing",
    //   icon: <CarIcon className="w-5 h-5" />,
    //   text: "ออกบิลรถยนต์"
    // },
    // {
    //   href: "/motorcycle-billing",
    //   icon: <MotorcycleIcon className="w-5 h-5" />,
    //   text: "ออกบิลรถจักรยานยนต์"
    // },
    {
      href: "/adjust-carpet",
      icon: <CarpetIcon className="w-5 h-5" />,
      text: "ปรับรอบพรบ"
    }
    // {
    //   href: "/customer-info",
    //   icon: <CustomerIcon className="w-5 h-5" />,
    //   text: "ข้อมูลลูกค้า"
    // },
    // {
    //   href: "/pricing",
    //   icon: <PricingIcon className="w-5 h-5" />,
    //   text: "ราคางาน"
    // },
    // {
    //   href: "/about",
    //   icon: <AboutIcon className="w-5 h-5" />,
    //   text: "เกี่ยวกับเรา"
    // }
  ];

  return (
    <main className="flex min-h-screen flex-col items-center page-transition">
      <div className="w-full max-w-5xl px-4">
        <div className="flex justify-between items-center py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold">ระบบปรับรอบพรบ. V.2</h1>
{/*           <Link
            href="/dashboard"
            className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md px-3 py-1.5 text-sm flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            แดชบอร์ด
          </Link> */}
        </div>

        <div className="border-t border-gray-300 mb-6 md:mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 justify-items-center">
          {/* Navigation Buttons with animation */}
          {navButtons.map((button, index) => (
            <Link
              key={button.href}
              href={button.href}
              className="nav-button w-full text-center flex items-center justify-center gap-2"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.3s ease-out ${index * 0.1}s`
              }}
            >
              {button.icon}
              <span>{button.text}</span>
            </Link>
          ))}
        </div>

{/*         <div className="mt-8 flex flex-col items-center text-center text-sm text-gray-500 dark:text-gray-400">
          <p>ระบบการออกบิลสำหรับธุรกิจ</p>
          <p className="mt-1">ดูแลโดย smnDev</p>
        </div> */}

        {/* Theme Toggle */}
        <div className="fixed top-4 sm:top-6 md:top-[105px] right-4 sm:right-10">
          <ThemeToggle />
        </div>
      </div>
    </main>
  );
}
