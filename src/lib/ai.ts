import { auth } from "./firebase";

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

// 🔥 Shared token function (same as api.ts — reuse if possible)
async function getToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const now = Date.now();

  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  const tokenResult = await user.getIdTokenResult();
  cachedToken = tokenResult.token;

  tokenExpiry =
    new Date(tokenResult.expirationTime).getTime() - 60 * 1000;

  return cachedToken;
}

// 🔥 AI API caller
export async function callBackendAI(
  endpoint: string,
  body: Record<string, any>
) {
  const token = await getToken();

  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // AI can be slower

  try {
    const response = await fetch(`${backendUrl}/ai/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `AI request failed (${response.status})`);
    }

    return data;
  } catch (error: any) {
    clearTimeout(timeout);

    if (error.name === "AbortError") {
      throw new Error("AI request timeout. Try again.");
    }

    throw error;
  }
}
