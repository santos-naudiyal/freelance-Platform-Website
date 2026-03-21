import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "./firebase";

// Initialize the client-side Gemini SDK if an API key is provided directly to the frontend.
// Note: It's generally safer to call the backend endpoints. Use this only for minor client-only tasks.
const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
export const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

/**
 * Helper to call the secure backend AI endpoints.
 * Automatically attaches the Firebase ID token for authentication.
 */
export async function callBackendAI(endpoint: string, body: Record<string, any>) {
  if (!auth.currentUser) {
    throw new Error("Must be logged in to use AI features.");
  }

  const token = await auth.currentUser.getIdToken();
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const response = await fetch(`${backendUrl}/ai/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `AI request failed with status ${response.status}`);
  }

  return response.json();
}
