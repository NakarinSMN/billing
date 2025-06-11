// --- ไฟล์ 1: components/icons/pricing-icon.tsx ---
// ไฟล์นี้ควรอยู่ในโฟลเดอร์ 'components/icons/' ในโปรเจกต์ Next.js ของคุณ
import React from 'react';

export function PricingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3v18" />
      <path d="M12 3v18" />
      <path d="M18 3v18" />
      <path d="M4 8h2" />
      <path d="M4 16h2" />
      <path d="M8 8h4" />
      <path d="M8 16h4" />
      <path d="M16 8h2" />
      <path d="M16 16h2" />
    </svg>
  );
}
