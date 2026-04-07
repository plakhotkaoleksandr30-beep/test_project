# Simple Login + Play/Stop (persistent) + Status URL

## Credentials

- Username: `admin`
- Password: `90045`

## Behavior

- Login with the credentials above.
- After login, click the main button to toggle **Play** ↔ **Stop**.
- The last state is saved and restored on the next run.

## Run locally

### Option A: Recommended (includes `/status` URL)

Run the included Python server:

```bash
python server.py
```

Then open `http://127.0.0.1:8000` in your browser.

Check current state via URL:

- `http://127.0.0.1:8000/status`

Set state via URL:

- `http://127.0.0.1:8000/set?state=play`
- `http://127.0.0.1:8000/set?state=stop`

### Option B: Open directly (no status URL)

You can also open `index.html` directly, but then the `/status` URL won’t work (there’s no server). In that mode, state persistence uses browser localStorage only.

## Deploy to Vercel (so URL checks work after deploy)

This repo includes Vercel API routes:

- `GET /api/status` → `{ state, persisted }`
- `GET /api/set?state=play|stop` → `{ state, persisted }`

### Persistence on Vercel

To keep state across executions on Vercel, use **Vercel KV**:

- Create a KV store in your Vercel project (Storage tab).
- Ensure the KV environment variables are present in the project (Vercel adds them automatically when you connect KV).

If KV isn’t configured, the API will still respond but `persisted` will be `false` and state may reset between executions.

