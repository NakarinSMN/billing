"use client";

import Link from "next/link";
import { AboutIcon } from "@/components/icons/about-icon";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center p-4 page-transition">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center mb-4">
          <AboutIcon className="w-6 h-6 mr-2" />
          <h1 className="text-center text-2xl font-bold">เกี่ยวกับเรา</h1>
        </div>

        <div className="border-t border-gray-300 mb-8" />

        <div className="bg-white/70 dark:bg-gray-800/70 rounded-md p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/3 flex justify-center">

              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 dark:from-blue-900 dark:to-indigo-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" className="w-24 h-24 text-white">
                  <path d="M64 96c0-35.3 28.7-64 64-64l384 0c35.3 0 64 28.7 64 64l0 256-64 0 0-256L128 96l0 256-64 0L64 96zM0 403.2C0 392.6 8.6 384 19.2 384l601.6 0c10.6 0 19.2 8.6 19.2 19.2c0 42.4-34.4 76.8-76.8 76.8L76.8 480C34.4 480 0 445.6 0 403.2zM281 209l-31 31 31 31c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-48-48c-9.4-9.4-9.4-24.6 0-33.9l48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM393 175l48 48c9.4 9.4 9.4 24.6 0 33.9l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l31-31-31-31c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z" />
                </svg>
              </div>
            </div>
            
            <div className="md:w-2/3 space-y-4">
              <h2 className="text-xl font-bold text-center md:text-left mt-6">ทีมพัฒนาเว็บไซต์ของ SMN Dev</h2>
              <p className="text-gray-600 dark:text-gray-300">
                ทีมพัฒนาเว็บไซต์ของเรา คือหัวใจสำคัญที่ช่วยขับเคลื่อนการเปลี่ยนผ่านสู่ยุคดิจิทัล เรามีความเชี่ยวชาญในการออกแบบและพัฒนาเว็บแอปพลิเคชันที่ตอบโจทย์ธุรกิจของลูกค้า ตั้งแต่เว็บไซต์ทั่วไปจนถึงระบบจัดการภายในที่มีความซับซ้อน
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                SMN Dev มุ่งเน้นการใช้เทคโนโลยีที่ทันสมัย เช่น React, Next.js, Node.js และ MongoDB เพื่อให้ได้ระบบที่มีประสิทธิภาพ ปลอดภัย และสามารถปรับขยายได้ในอนาคต เราพร้อมร่วมเดินทางไปกับคุณในทุกขั้นตอนของการพัฒนา ไม่ว่าจะเป็นการวางแผน ออกแบบ พัฒนา ไปจนถึงการดูแลหลังการใช้งาน
              </p>
              <div className="pt-4 text-gray-700 dark:text-gray-300">
                <h3 className="font-semibold mb-2">ติดต่อเราทีมงาน SMN</h3>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>โทร: 064-993-6361</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>อีเมล: info@abccarwash.com</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>55 หมู่ 7 ต.พิมลราช อ.บางบัวทอง จ.นนทบุรี 11110</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="nav-button inline-flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
