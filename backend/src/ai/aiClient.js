const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 2500);

async function postToAiService(path, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    const response = await fetch(`${AI_SERVICE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || data.error || `AI service request failed with ${response.status}`);
    }
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

function aiSnapshot(db) {
  return {
    users: db.users || [],
    courses: db.courses || [],
    studentProgress: db.studentProgress || [],
    payments: db.payments || [],
    certificates: db.certificates || [],
    submissions: db.submissions || [],
  };
}

async function generateInsights(db) {
  return postToAiService("/ai/insights", aiSnapshot(db));
}

async function systemSummary(db) {
  return postToAiService("/ai/system-summary", aiSnapshot(db));
}

async function markLongAnswer(payload) {
  return postToAiService("/ai/mark-long-answer", payload);
}

module.exports = {
  aiSnapshot,
  generateInsights,
  markLongAnswer,
  systemSummary,
};
