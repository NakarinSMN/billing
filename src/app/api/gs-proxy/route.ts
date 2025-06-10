// /app/api/gs-proxy/route.ts
export async function POST(req: Request) {
    const body = await req.json();
    const gsUrl = "https://script.google.com/macros/s/AKfycbz3WJmHNJ2h8Yj1rm2tc_mXj6JNCYz8t-vOmg9kC6aKgpAAuXmH5Z3DNZQF8ecGZUGw/exec";
  
    const res = await fetch(gsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }
  