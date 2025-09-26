import { supabase } from "./supabaseClient";

const apiRoot = process.env.NEXT_PUBLIC_API?.toString();

interface apiError {
    message: string;
};

interface Job {
  title: string | undefined;
  description: string | undefined;
};

interface CoverLetterResponse {
  id: string;
  user_id: string;
  text: string;
  job_title: string;
  job_description: string;
  // prompt: string;
  created_at: string;
  // updated_at: string;
};

interface loginProps {
  email: string;
  password: string;
};

interface letterBrief {
  jobs: Job;
  created_at: string;
}

async function fetchProtected() {
  const session = await supabase.auth.getSession();
  const accessToken = session.data.session?.access_token;

  const res = await fetch(`${apiRoot}/protected`, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  return res.json();
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    credentials: "include", // send cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  return res;
}

async function generateCoverLetter({ job }: { job: Job }): Promise<string> {
  try {
    const response = await fetch(`${apiRoot}/letters`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify({ job }),
    });
    if (!response.ok) {
      throw new Error(`
                Failed to generate cover letter with error: ${response.status} \n
                ::: ${response.statusText}
                `);
    }

    const data: CoverLetterResponse = await response.json();

    return data.text;
  } catch (error: unknown) {
    console.log("error", error);
  }

  return "";
}

async function login({ user }: { user: loginProps }) {
  try {
    const response = await fetch(`${apiRoot}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error(`
                Authentication error: ${response.status} \n
                ::: ${response.statusText}
                ${await response.text()}
                `);
    }

    const data = await response.json();
    const cookies = "No response"

    return cookies;
  } catch (error: unknown) {
    console.log("error", error);
  }

  return "";
}

export type { apiError, CoverLetterResponse, loginProps, letterBrief };
export { apiFetch, fetchProtected, generateCoverLetter, login };