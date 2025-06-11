// pages/api/gs-proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Proxy endpoint to forward requests to your Google Apps Script Web App.
 * This avoids CORS issues by funneling all client calls through Next.js server.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const gsUrl =
    'https://script.google.com/macros/s/AKfycbz3WJmHNJ2h8Yj1rm2tc_mXj6JNCYz8T-yOmg9kC6aKgpAAuXmH5Z3DNZQF8ecGZUGw/exec';

  let payload: any;
  try {
    payload = req.body;
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  try {
    const gsRes = await fetch(gsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await gsRes.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return res
        .status(502)
        .json({ error: 'Invalid JSON from Google Script', raw: text });
    }

    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Proxy request failed', message: err.message });
  }
}
