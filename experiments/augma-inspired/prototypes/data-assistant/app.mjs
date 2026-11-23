import { answer } from "./assistant-core.mjs";
const $ = id => document.getElementById(id);

function appendMessage(role, message) {
  const wrap = document.createElement("article");
  wrap.className = "message " + role;
  const label = document.createElement("div");
  label.className = "message-label";
  label.textContent = role === "user" ? "PERTANYAAN" : "EVIDENCE ASSISTANT · MOCK";
  const body = document.createElement("p");
  body.textContent = message;
  wrap.append(label, body);
  $("conversation").append(wrap);
  return wrap;
}

function submitQuestion(query) {
  const text = String(query ?? "").trim().slice(0, 240);
  if (!text) return;
  const welcome = document.querySelector(".welcome");
  if (welcome) welcome.remove();
  appendMessage("user", text);
  const result = answer(text);
  const response = appendMessage("assistant", result.text);
  const status = document.createElement("div");
  status.className = "result-status " + result.status;
  status.textContent = "STATUS: " + result.status.toUpperCase() + " · " + result.provider;
  response.append(status);
  if (result.sources.length) {
    const title = document.createElement("p");
    title.className = "source-title";
    title.textContent = "Sumber yang digunakan:";
    response.append(title);
    const links = document.createElement("ul");
    links.className = "sources";
    for (const source of result.sources) {
      const item = document.createElement("li");
      const anchor = document.createElement("a");
      anchor.href = source.url;
      anchor.textContent = source.id + " · " + source.label;
      if (source.url.startsWith("https://")) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }
      item.append(anchor);
      links.append(item);
    }
    response.append(links);
  }
  $("conversation").scrollTop = $("conversation").scrollHeight;
}

$("ask-form").addEventListener("submit", event => {
  event.preventDefault();
  submitQuestion($("question").value);
  $("question").value = "";
  $("question").focus();
});

for (const button of document.querySelectorAll("[data-prompt]")) {
  button.addEventListener("click", () => {
    const prompt = button.dataset.prompt;
    submitQuestion(prompt);
  });
}
