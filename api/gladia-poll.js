export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { result_url } = req.body;
  if (!result_url) return res.status(400).json({ error: "result_url manquant" });
  const response = await fetch(result_url, {
    headers: { "x-gladia-key": process.env.GLADIA_API_KEY },
  });
  const data = await response.json();
  res.status(response.status).json(data);
}
