import { writeState } from "./_state.js";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const state =
    (req.method === "GET" ? req.query?.state : req.body?.state) ?? "play";

  const updated = await writeState(state);
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    state: updated.state,
    persisted: updated.persisted
  });
}

