// ✅ src/pages/api/gs-proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const gsUrl = "https://script.google.com/macros/s/AKfycbz3WJmHNJ2h8Yj1rm2tc_mXj6JNCYz8T-yOmg9kC6aKgpAAuXmH5Z3DNZQF8ecGZUGw/exec";

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const gsRes = await fetch(gsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const text = await gsRes.text();
    try {
      const json = JSON.parse(text);
      res.status(200).json(json);
    } catch {
      res.status(500).json({ error: 'Response not JSON', raw: text });
    }
  } catch (err) {
    res.status(500).json({ error: 'Fetch error', detail: err });
  }
}
