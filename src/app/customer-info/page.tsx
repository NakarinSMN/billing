"use client";

import Link from "next/link";
import { CustomerIcon } from "@/components/icons/customer-icon";

export default function CustomerInfoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center p-4 page-transition">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center mb-4">
          <CustomerIcon className="w-6 h-6 mr-2" />
          <h1 className="text-center text-2xl font-bold">ข้อมูลลูกค้า</h1>
        </div>

        <div className="border-t border-gray-300 mb-8" />

        <div className="bg-white/70 dark:bg-gray-800/70 rounded-md p-6 mb-6 shadow-sm">
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-green-50 dark:bg-green-900/30 rounded-full mb-4">
              <CustomerIcon className="w-12 h-12 text-green-500 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold">หน้านี้กำลังอยู่ในระหว่างการพัฒนา</h2>
            <p className="text-gray-600 dark:text-gray-300">
              ระบบจัดการข้อมูลลูกค้าจะเปิดให้บริการเร็วๆ นี้
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              (This page is under development. The customer information management system will be available soon.)
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="nav-button inline-flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
