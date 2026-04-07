const VALID_USERNAME = "admin";
const VALID_PASSWORD = "90045";

const loginView = document.getElementById("loginView");
const appView = document.getElementById("appView");

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const fillDemoBtn = document.getElementById("fillDemo");

const runBtn = document.getElementById("runBtn");
const logoutBtn = document.getElementById("logoutBtn");

const STORAGE_KEY = "playStopState";

function normalizeState(value) {
  const v = String(value || "").toLowerCase();
  return v === "stop" ? "stop" : "play";
}

function labelForState(state) {
  return state === "stop" ? "Stop" : "Play";
}

function setButtonState(state) {
  const normalized = normalizeState(state);
  runBtn.textContent = labelForState(normalized);
  localStorage.setItem(STORAGE_KEY, normalized);
}

async function tryFetchJson(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function showLogin() {
  loginView.classList.remove("hidden");
  appView.classList.add("hidden");
  loginError.textContent = "";
  passwordInput.value = "";
  usernameInput.focus();
}

async function showApp() {
  loginView.classList.add("hidden");
  appView.classList.remove("hidden");
  loginError.textContent = "";
  runBtn.disabled = false;
  // Prefer Vercel API routes when deployed, then local python server, then localStorage.
  const apiState = await tryFetchJson("/api/status");
  const localState = apiState?.state ? null : await tryFetchJson("./status");
  const chosen = apiState?.state || localState?.state || localStorage.getItem(STORAGE_KEY) || "play";
  setButtonState(chosen);
  runBtn.focus();
}

function isValid(username, password) {
  return username === VALID_USERNAME && password === VALID_PASSWORD;
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!isValid(username, password)) {
    loginError.textContent = "Invalid username or password.";
    passwordInput.focus();
    passwordInput.select?.();
    return;
  }

  void showApp();
});

fillDemoBtn.addEventListener("click", () => {
  usernameInput.value = VALID_USERNAME;
  passwordInput.value = VALID_PASSWORD;
  loginError.textContent = "";
  passwordInput.focus();
});

logoutBtn.addEventListener("click", () => {
  showLogin();
});

runBtn.addEventListener("click", () => {
  const next = normalizeState(runBtn.textContent) === "play" ? "stop" : "play";
  setButtonState(next);
  // Best-effort persist to whichever backend exists.
  void fetch(`/api/set?state=${encodeURIComponent(next)}`, { cache: "no-store" }).catch(() => {});
  void fetch(`./set?state=${encodeURIComponent(next)}`, { cache: "no-store" }).catch(() => {});
});

showLogin();

