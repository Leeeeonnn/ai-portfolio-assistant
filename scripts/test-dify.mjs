import { readFileSync } from "node:fs";

function readEnvFile(path) {
  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator), line.slice(separator + 1)];
      }),
  );
}

const env = readEnvFile(".env.local");
const baseUrl = env.DIFY_API_BASE_URL || "https://api.dify.ai/v1";

if (!env.DIFY_API_KEY) {
  console.error("DIFY_API_KEY is not configured in .env.local");
  process.exit(1);
}

const response = await fetch(`${baseUrl}/chat-messages`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${env.DIFY_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    inputs: {},
    query: "先做个自我介绍吧",
    response_mode: "blocking",
    user: env.DIFY_USER_ID || "portfolio-visitor",
    auto_generate_name: false,
  }),
});

const rawBody = await response.text();
let payload;

try {
  payload = JSON.parse(rawBody);
} catch {
  payload = {};
}

console.log(`status=${response.status}`);
console.log(`conversation_id=${payload.conversation_id || ""}`);
console.log(
  `answer_preview=${String(
    payload.answer || payload.message || payload.error || rawBody,
  ).slice(0, 160)}`,
);

if (!response.ok) {
  process.exit(1);
}
