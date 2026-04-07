import { readState } from "./_state.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const current = await readState();
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    state: current.state,
    persisted: current.persisted
  });
}

