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
const query = process.argv.slice(2).join(" ") || "Leon 是什么样的设计师？";

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
    inputs: {
      assistant_identity:
        "Leon's AI portfolio assistant based on public portfolio materials and processed communication-style summaries.",
      privacy_boundary:
        "Do not claim to be the real Leon. Do not reveal private chat records or raw WeChat history.",
      source_policy:
        "Use only the Dify knowledge base, public portfolio materials, and processed personality summaries.",
    },
    query,
    response_mode: "streaming",
    user: env.DIFY_USER_ID || "portfolio-visitor",
    auto_generate_name: false,
  }),
});

console.log(`status=${response.status}`);

if (!response.ok || !response.body) {
  const rawBody = await response.text();
  console.log(`error_preview=${rawBody.slice(0, 160)}`);
  process.exit(1);
}

const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = "";
let answerPreview = "";

function countDocuments(value) {
  if (Array.isArray(value)) {
    return value.length;
  }

  if (value && typeof value === "object") {
    return Object.values(value).reduce(
      (sum, child) => sum + countDocuments(child),
      0,
    );
  }

  return 0;
}

function describeInputs(value) {
  if (!value || typeof value !== "object") {
    return "none";
  }

  return Object.entries(value)
    .map(([key, child]) => {
      if (typeof child === "string") {
        return `${key}:string(${child.length})`;
      }

      if (Array.isArray(child)) {
        return `${key}:array(${child.length})`;
      }

      if (child && typeof child === "object") {
        return `${key}:object(${Object.keys(child).length})`;
      }

      return `${key}:${typeof child}`;
    })
    .join(",");
}

function processEvent(eventText) {
  const dataLine = eventText
    .split("\n")
    .find((line) => line.startsWith("data:"));

  if (!dataLine) {
    return false;
  }

  const payload = dataLine.replace(/^data:\s*/, "");

  if (payload === "[DONE]") {
    return true;
  }

  let event;

  try {
    event = JSON.parse(payload);
  } catch {
    return false;
  }

  const nodeTitle = event.data?.title || event.data?.node_type || "";

  if (event.event === "node_finished") {
    const documentCount =
      countDocuments(event.data?.outputs?.documents) ||
      countDocuments(event.data?.outputs?.result) ||
      countDocuments(event.data?.outputs?.records);

    console.log(
      `node_finished title="${nodeTitle}" type="${event.data?.node_type || ""}" inputs=${describeInputs(event.data?.inputs)} documents=${documentCount}`,
    );
  }

  if (event.conversation_id) {
    console.log(`conversation_id=${event.conversation_id}`);
  }

  if (event.answer && answerPreview.length < 160) {
    answerPreview += event.answer;
  }

  return false;
}

while (true) {
  const { done, value } = await reader.read();

  if (done) {
    break;
  }

  buffer += decoder.decode(value, { stream: true });
  const events = buffer.split("\n\n");
  buffer = events.pop() || "";

  for (const eventText of events) {
    if (processEvent(eventText)) {
      break;
    }
  }
}

if (buffer.trim()) {
  processEvent(buffer.trim());
}

console.log(`answer_preview=${answerPreview.slice(0, 160)}`);
