// ✅ src/app/api/gs-proxy/route.ts
export async function POST(req: Request) {
    const body = await req.json();
    const gsUrl = "https://script.google.com/macros/s/AKfycbz3WJmHNJ2h8Yj1rm2tc_mXj6JNCYz8T-yOmg9kC6aKgpAAuXmH5Z3DNZQF8ecGZUGw/exec";
  
    try {
      const res = await fetch(gsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
  
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        return new Response(JSON.stringify(json), {
          headers: { "Content-Type": "application/json" }
        });
      } catch {
        return new Response(JSON.stringify({ error: "Response is not JSON", raw: text }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
  
    } catch (error) {
      return new Response(JSON.stringify({ error: "Proxy error", details: error }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  