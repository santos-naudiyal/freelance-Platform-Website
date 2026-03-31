import { auth } from "./firebase";

/**
 * Retrieves the current Firebase ID token safely.
 * Avoids multiple listeners and prevents quota issues.
 */
// Cache tracks BOTH token and the UID it belongs to.
// If the current user differs (i.e. a different person logs in),
// the stale token is discarded and a fresh one is fetched.
let cachedToken: string | null = null;
let cachedTokenUid: string | null = null;

export function clearTokenCache() {
  cachedToken = null;
  cachedTokenUid = null;
}

async function getToken(): Promise<string> {
  try {
    let user = auth.currentUser;

    // Wait for auth to initialize if not ready
    if (!user) {
      await new Promise<void>((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
          user = u;
          unsubscribe();
          resolve();
        });
      });
    }

    if (!user) {
      throw new Error("User not authenticated");
    }

    // ✅ Return cached token only if it belongs to the SAME user
    if (cachedToken && cachedTokenUid === user.uid) {
      return cachedToken;
    }

    // Different user or no cache — clear stale token and fetch fresh
    cachedToken = null;
    cachedTokenUid = null;

    const token = await user.getIdToken();
    cachedToken = token;
    cachedTokenUid = user.uid;

    return token;
  } catch (error) {
    console.error("❌ getToken error:", error);
    throw error;
  }
}

// 🔥 Generic API caller
export async function callBackend(
  endpoint: string,
  method: string = "GET",
  body?: any
) {
  try {
    const token = await getToken();

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const baseUrl = backendUrl.endsWith("/")
      ? backendUrl.slice(0, -1)
      : backendUrl;

    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;

    const url = `${baseUrl}/${cleanEndpoint}`;

    const isFormData = body instanceof FormData;

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch (_) {}

      throw new Error(
        errorData.error ||
          errorData.message ||
          `API request failed with status ${response.status}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`❌ [API Error] ${method} ${endpoint}:`, error.message);
    throw error;
  }
}