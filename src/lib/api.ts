import { auth } from "./firebase";


async function getToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const now = Date.now();

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
