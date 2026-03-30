import { auth } from "./firebase";

/**
 * Retrieves the current Firebase ID token for the authenticated user.
 * It also handles token refreshing automatically via Firebase SDK.
 */
async function getToken(): Promise<string> {
  // Wait for the auth to initialize if it's not ready
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe();
      if (user) {
        try {
          const token = await user.getIdToken();
          resolve(token);
        } catch (error) {
          reject(new Error("Failed to retrieve authentication token"));
        }
      } else {
        reject(new Error("User not authenticated"));
      }
    });
  });
}

// 🔥 Generic API caller
export async function callBackend(
  endpoint: string,
  method: string = "GET",
  body?: any
) {
  try {
    const token = await getToken();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    const baseUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${baseUrl}/${cleanEndpoint}`;

    const isFormData = body instanceof FormData;
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`[API Error] ${method} ${endpoint}:`, error.message);
    throw error;
  }
}
