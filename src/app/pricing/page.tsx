// app/pricing/page.tsx
"use client";

import Link from "next/link";
import { PricingIcon } from "@/components/icons/pricing-icon";
import { services, Service } from "@/app/config/services";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center p-4 page-transition">
      <div className="w-full max-w-4xl">
        {/* Title */}
        <div className="flex items-center justify-center mb-4">
          <PricingIcon className="w-6 h-6 mr-2" />
          <h1 className="text-center text-2xl font-bold">ราคางาน</h1>
        </div>

        <div className="border-t border-gray-300 mb-8" />

        {/* Table container */}
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-md p-6 mb-6 shadow-sm">
          {/* Scroll wrapper with rounded corners and custom scrollbar */}
          <div className="max-h-[600px] overflow-auto rounded-lg shadow-inner scrollbar-custom">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
              <thead>
                <tr>
                  <th
                    className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium
                               text-gray-500 dark:text-gray-400 uppercase tracking-wider rounded-tl-lg"
                  >
                    บริการ
                  </th>
                  <th
                    className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium
                               text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    รถยนต์ (บาท)
                  </th>
                  <th
                    className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium
                               text-gray-500 dark:text-gray-400 uppercase tracking-wider rounded-tr-lg"
                  >
                    รถจักรยานยนต์ (บาท)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 dark:bg-gray-900/50 divide-y divide-gray-200 dark:divide-gray-700">
                {services.map((service: Service, idx: number) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {service.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {service.carPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {service.motorcyclePrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer notes */}
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>หมายเหตุ: ราคาอาจมีการเปลี่ยนแปลงตามขนาดและประเภทของรถ</p>
            <p className="mt-1">โปรดติดต่อเจ้าหน้าที่สำหรับรายละเอียดเพิ่มเติม</p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link href="/" className="nav-button inline-flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
