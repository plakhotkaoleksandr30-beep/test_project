from __future__ import annotations

import json
import os
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parent
STATE_PATH = ROOT / "state.json"


def _read_state() -> dict:
    if not STATE_PATH.exists():
        return {"state": "play", "updatedAt": None}
    try:
        return json.loads(STATE_PATH.read_text(encoding="utf-8"))
    except Exception:
        return {"state": "play", "updatedAt": None}


def _write_state(state: str) -> dict:
    state = state.lower().strip()
    if state not in ("play", "stop"):
        state = "play"
    payload = {"state": state, "updatedAt": int(time.time())}
    STATE_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return payload


class Handler(SimpleHTTPRequestHandler):
    def _send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)

        if parsed.path == "/status":
            self._send_json(_read_state())
            return

        if parsed.path == "/set":
            qs = parse_qs(parsed.query)
            desired = (qs.get("state") or ["play"])[0]
            self._send_json(_write_state(desired))
            return

        return super().do_GET()


def main() -> None:
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", 8000), Handler)
    print("Serving on http://127.0.0.1:8000")
    print("Status endpoint: http://127.0.0.1:8000/status")
    print("Set endpoint:    http://127.0.0.1:8000/set?state=play  (or stop)")
    server.serve_forever()


if __name__ == "__main__":
    main()

