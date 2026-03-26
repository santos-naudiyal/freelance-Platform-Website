import { auth } from "./firebase";

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

// 🔥 Get token with caching
async function getToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const now = Date.now();

  // If token exists and not expired → reuse
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  // Force refresh only if needed
  const tokenResult = await user.getIdTokenResult();
  cachedToken = tokenResult.token;

  // Firebase gives expiration time
  tokenExpiry = new Date(tokenResult.expirationTime).getTime() - 60 * 1000; // refresh 1 min before expiry

  return cachedToken;
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
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout for AI generation

  try {
    const response = await fetch(`${backendUrl}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // Handle non-JSON safely
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `Request failed (${response.status})`);
    }

    return data;
  } catch (error: any) {
    clearTimeout(timeout);

    // Handle timeout
    if (error.name === "AbortError") {
      throw new Error("Request timeout. Please try again.");
    }

    throw error;
  }
}
