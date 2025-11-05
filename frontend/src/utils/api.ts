import { supabase } from "./supabaseClient";
import type { APIError } from "@/types/api";

const apiRoot = process.env.NEXT_PUBLIC_API_URL?.toString();


async function apiFetch(path: string, options: RequestInit = {}, response_type: string = "json") {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(`${apiRoot}${path}`, {
    ...options,
    credentials: "include", // send cookies
    next: {
      revalidate: 60,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
      ...(options.headers || {}),
    },
  });

  if (response_type === "json") {
    const json = await res.json();

    if (json.status === "error") {
      const error = new Error(json.message || "An error occurred");
      (error as APIError).code = json.error_code;
      (error as APIError).details = json.details;
      throw error;
    }

    return json.data;
  } else if (response_type === "blob") {
    const blob = await res.blob();

    if (blob.size <= 0) {
      const error = new Error("An error occurred file size is zero");
      (error as APIError).code = "SERVER_ERROR";
      (error as APIError).details = `The returned file has an invalid size of ${blob.size}`;
      throw error;
    }

    return blob;
  } else {
    const error = new Error("An error occurred");
    (error as APIError).code = "BAD_REQUEST_ERROR";
    (error as APIError).details = `Unknown response type: ${response_type}`;
    throw error;
  }
}

export { apiFetch };