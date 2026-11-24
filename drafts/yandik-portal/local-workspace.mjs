import { mountBackendWorkspace } from "/drafts/yandik-portal/backend-workspace.mjs";

const root = document.getElementById("backend-root");

async function request(path, body) {
  const options = body === undefined ? {} : {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  const result = await fetch(path, { ...options, credentials: "same-origin", cache: "no-store" });
  return result.json();
}

function node(tag, text) {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  return element;
}

function signIn(message = "") {
  const panel = node("section");
  panel.className = "review-panel";
  const form = node("form");
  form.className = "local-session-form";
  const label = node("label", "Kode sesi DEMO");
  const code = node("input");
  code.type = "password";
  code.required = true;
  code.autocomplete = "off";
  label.append(code);
  const submit = node("button", "Masuk ke DEMO");
  submit.type = "submit";
  const status = node("p", message);
  status.setAttribute("role", "status");
  form.append(label, submit, status);
  panel.append(node("h1", "Masuk ke YANDIK+"),
    node("p", "Salin kode sesi dari jendela server DEMO."), form);
  root.replaceChildren(panel);

  form.addEventListener("submit", async event => {
    event.preventDefault();
    submit.disabled = true;
    try {
      const result = await request("/local/session", { code: code.value.trim() });
      if (result.status === 200) await openWorkspace(result.data);
      else status.textContent = "Kode sesi DEMO tidak cocok.";
    } catch {
      status.textContent = "Server DEMO tidak dapat dihubungi. Coba lagi.";
    } finally {
      submit.disabled = false;
    }
  });
}

async function openWorkspace({ allow_commands: allowCommands }) {
  const workspace = node("div");
  const logout = node("button", "Keluar dari DEMO");
  const tools = node("div");
  tools.className = "backend-session";
  logout.type = "button";
  tools.append(logout);
  root.replaceChildren(workspace, tools);
  let unmount;
  logout.addEventListener("click", async () => {
    logout.disabled = true;
    try {
      const result = await request("/local/session", { action: "logout" });
      if (result.status !== 200) throw Error("LOGOUT_FAILED");
      unmount?.();
      signIn("Sesi DEMO telah ditutup.");
    } catch {
      logout.disabled = false;
      logout.textContent = "Keluar gagal. Coba lagi";
    }
  });

  unmount = await mountBackendWorkspace(workspace, {
    transport: async command => {
      const result = await request("/local/dispatch", command);
      if (result.status === 401) {
        unmount?.();
        signIn("Sesi DEMO berakhir. Gunakan kembali kode sesi DEMO.");
      }
      return result;
    },
    executionAuthorized: true,
    allowCommands,
  });
}

try {
  const session = await request("/local/session");
  if (session.status === 200) await openWorkspace(session.data);
  else signIn();
} catch {
  signIn("Server DEMO tidak dapat dihubungi.");
}
