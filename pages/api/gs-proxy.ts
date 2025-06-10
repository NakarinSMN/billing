// pages/api/gs-proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const gsUrl = 'https://script.google.com/macros/s/AKfycbz3WJmHNJ2h8Yj1rm2tc_mXj6JNCYz8T-yOmg9kC6aKgpAAuXmH5Z3DNZQF8ecGZUGw/exec';

  try {
    // ส่ง request ไปยัง Google Apps Script
    const gsRes = await fetch(gsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const text = await gsRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // กรณีที่ไม่ใช่ JSON
      return res.status(502).json({ error: 'Invalid JSON from GS', raw: text });
    }

    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Proxy fetch failed', message: err.message });
  }
}
