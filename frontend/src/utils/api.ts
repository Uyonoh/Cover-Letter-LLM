import { supabase } from "./supabaseClient";
import type { APIError } from "@/types/api";

const apiRoot = process.env.NEXT_PUBLIC_API_URL?.toString();


async function apiFetch(path: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(`${apiRoot}${path}`, {
    ...options,
    credentials: "include", // send cookies
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
      ...(options.headers || {}),
    },
  });

  const json = await res.json();

  if (json.status === "error") {
    const error = new Error(json.message || "An error occurred");
    (error as APIError).code = json.error_code;
    (error as APIError).details = json.details;
    throw error;
  }

  return json.data;
}

export { apiFetch };