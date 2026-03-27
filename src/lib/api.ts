import { auth } from "./firebase";


// 🔥 Get token with caching + lock
async function getToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const now = Date.now();
  const token = await user.getIdToken();
  return token;
}

// 🔥 Generic API caller
export async function callBackend(
  endpoint: string,
  method: string = "GET",
  body?: any
) {
  const token = await getToken();

  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const controller = new AbortController();


  // ⚡ Dynamic timeout (AI endpoints get more time)
  const isAI = endpoint.toLowerCase().includes("ai");
  const timeoutDuration = isAI ? 30000 : 15000;

  const timeout = setTimeout(() => controller.abort(), timeoutDuration);

  try {
    const response = await fetchWithRetry(
      `${backendUrl}/${endpoint}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      },
      2 // retries
    );

    clearTimeout(timeout);

    // 🛡 Safe JSON parsing
    const text = await response.text();
    let data: any = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }

    // ❌ Handle API errors
    if (!response.ok) {
      throw new Error(
        data?.error ||
        data?.message ||
        `Request failed (${response.status})`
      );
    }

    return data;

  } catch (error: any) {
    clearTimeout(timeout);

    // ⏱ Timeout error
    if (error.name === "AbortError") {
      throw new Error("Request timeout. Please try again.");
    }
    throw error;
  }
}

async function fetchWithRetry(url: string, options: any, retries: number): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (!res.ok && retries > 0) {
      return fetchWithRetry(url, options, retries - 1);
    }
    return res;
  } catch (err) {
    if (retries > 0) {
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

