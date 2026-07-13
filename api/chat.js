// Vercel Serverless Function
// This runs on the server, so the API key here is NEVER visible to users in the browser.
// Set OPENROUTER_API_KEY in Vercel Project Settings → Environment Variables.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Method not allowed" } });
    return;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: { message: "Server is missing OPENROUTER_API_KEY. Add it in Vercel → Settings → Environment Variables." } });
    return;
  }

  try {
    const { messages, model, max_tokens } = req.body || {};

    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://towards-the-goal.vercel.app",
        "X-Title": "Towards the Goal"
      },
      body: JSON.stringify({
        model: model || "openrouter/auto",
        max_tokens: max_tokens || 600,
        messages: messages || []
      })
    });

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(500).json({ error: { message: "Server error contacting AI provider." } });
  }
}
