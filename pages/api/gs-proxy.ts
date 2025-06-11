
// 'https://script.google.com/macros/s/AKfycbz3WJmHNJ2h8Yj1rm2tc_mXj6JNCYz8T-yOmg9kC6aKgpAAuXmH5Z3DNZQF8ecGZUGw/exec';


// pages/api/submit-car.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbz3WJmHNJ2h8Yj1rm2tc_mXj6JNCYz8T-yOmg9kC6aKgpAAuXmH5Z3DNZQF8ecGZUGw/exec';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { plate } = req.query;

  if (req.method === 'GET') {
    // ตรวจสอบซ้ำ: รับ ?plate=XXX
    try {
      const gsRes = await fetch(`${GAS_URL}?method=check&plate=${encodeURIComponent(plate as string)}`);
      const json = await gsRes.json();
      return res.status(200).json({ exists: json.exists });
    } catch (err: any) {
      return res.status(500).json({ exists: false, error: err.message });
    }
  }

  if (req.method === 'POST') {
    // บันทึกทะเบียนใหม่
    try {
      const body = req.body;
      const gsRes = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'add', ...body }),
      });
      const json = await gsRes.json();
      return res.status(200).json({ result: json.result });
    } catch (err: any) {
      return res.status(500).json({ result: 'error', message: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method Not Allowed');
}


// pages/api/get-car.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { plate } = req.query;
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const gsRes = await fetch(`
      https://script.google.com/macros/s/AKfycbz3WJmHNJ2h8Yj1rm2tc_mXj6JNCYz8T-yOmg9kC6aKgpAAuXmH5Z3DNZQF8ecGZUGw/exec?method=get&plate=${encodeURIComponent(plate as string)}`
    );
    const json = await gsRes.json();
    return res.status(200).json({ exists: json.exists, data: json.data });
  } catch (err: any) {
    return res.status(500).json({ exists: false, data: null, error: err.message });
  }
}


// pages/api/update-car.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const body = req.body;
    const gsRes = await fetch(
      'https://script.google.com/macros/s/AKfycbz3WJmHNJ2h8Yj1rm2tc_mXj6JNCYz8T-yOmg9kC6aKgpAAuXmH5Z3DNZQF8ecGZUGw/exec',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'update', ...body }),
      }
    );
    const json = await gsRes.json();
    return res.status(200).json({ success: json.result === 'success' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
