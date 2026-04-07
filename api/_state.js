import { kv } from "@vercel/kv";

const KEY = "playStopState";

function normalizeState(value) {
  const v = String(value || "").toLowerCase();
  return v === "stop" ? "stop" : "play";
}

export async function readState() {
  // If KV isn’t configured, kv calls can throw. We’ll fall back.
  try {
    const state = await kv.get(KEY);
    return { state: normalizeState(state), persisted: true };
  } catch {
    return { state: "play", persisted: false };
  }
}

export async function writeState(next) {
  const state = normalizeState(next);
  try {
    await kv.set(KEY, state);
    return { state, persisted: true };
  } catch {
    return { state, persisted: false };
  }
}

