export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const response = await fetch("https://api.gladia.io/v2/pre-recorded", {
    method: "POST",
    headers: {
      "x-gladia-key": process.env.GLADIA_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  res.status(response.status).json(data);
}
