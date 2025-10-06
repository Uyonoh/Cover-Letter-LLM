import { supabase } from "./supabaseClient";

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

  return res;
}

export { apiFetch };