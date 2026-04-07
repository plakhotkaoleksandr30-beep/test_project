import { writeState } from "./_state.js";

export default async function handler(req, res) {
  // Keep it simple/reliable for URL requests: support GET.
  // (POST bodies can vary depending on how the function is invoked.)
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const state = req.query?.state ?? "play";

  const updated = await writeState(state);
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    state: updated.state,
    persisted: updated.persisted
  });
}

