export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks);
  const response = await fetch("https://api.gladia.io/v2/upload", {
    method: "POST",
    headers: {
      "x-gladia-key": process.env.GLADIA_API_KEY,
      "content-type": req.headers["content-type"],
    },
    body,
  });
  const data = await response.json();
  res.status(response.status).json(data);
}
