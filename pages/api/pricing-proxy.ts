// --- ไฟล์ 3: pages/api/pricing-proxy.ts ---
// ไฟล์นี้คือ Next.js API Route ที่ทำหน้าที่เป็น Proxy
// ควรอยู่ในโฟลเดอร์ 'pages/api/' ในโปรเจกต์ Next.js ของคุณ
import type { NextApiRequest, NextApiResponse } from 'next';

// 🚨 สำคัญ: แทนที่ URL นี้ด้วย Web App URL จริงของ Google Apps Script ของคุณ
// คุณต้อง Deploy Google Apps Script ของคุณในโหมด Web App (Execute as: Me, Who has access: Anyone)
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz3WJmHNJ2h8Yj1rm2tc_mXj6JNCYz8T-yOmg9kC6aKgpAAuXmH5Z3DNZQF8ecGZUGw/exec';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // จัดการคำขอ GET เพื่อดึงข้อมูลบริการทั้งหมด
  if (req.method === 'GET') {
    try {
      // ส่งคำขอไปยัง GAS doGet เพื่อดึงข้อมูลทั้งหมด
      const gasResponse = await fetch(`${GAS_WEB_APP_URL}`);
      if (!gasResponse.ok) {
        throw new Error(`Google Apps Script GET failed with status: ${gasResponse.status}`);
      }
      const data = await gasResponse.json();
      return res.status(200).json(data);
    } catch (error: any) {
      console.error("Error fetching data from GAS:", error);
      return res.status(500).json({ error: 'Failed to fetch data', message: error.message });
    }
  }

  // จัดการคำขอ POST สำหรับการเพิ่ม, อัปเดต, ลบข้อมูล
  if (req.method === 'POST') {
    try {
      // ส่งข้อมูล body ทั้งหมดจาก Next.js ไปยัง GAS doPost
      // GAS doPost ของคุณจะทำการแยก `method` (add, update, delete) และข้อมูลอื่นๆ เอง
      const gasResponse = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      if (!gasResponse.ok) {
        throw new Error(`Google Apps Script POST failed with status: ${gasResponse.status}`);
      }

      const result = await gasResponse.json();
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error sending data to GAS:", error);
      return res.status(500).json({ error: 'Failed to perform operation', message: error.message });
    }
  }

  // หากไม่ใช่เมธอด GET หรือ POST ให้ส่งคืน 405 Method Not Allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
