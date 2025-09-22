import { supabase } from "./supabaseClient";


const apiRoot = process.env.NEXT_PUBLIC_API?.toString();
interface Job {
    jobTitle: string | undefined;
    jobDescription: string | undefined;
}

interface CoverLetterResponse {
    id: string;
    user_id: string;
    text: string;
    job_title: string;
    job_description: string;
    // prompt: string;
    created_at: string;
    // updated_at: string;
}

async function fetchProtected() {
  const session = await supabase.auth.getSession()
  const accessToken = session.data.session?.access_token

  const res = await fetch(`${apiRoot}/protected`, {
    headers: {
        "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  })

  return res.json()
}

async function generateCoverLetter({job, token}: {job: Job, token: string}):Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token || token;

    if (!accessToken) throw new Error("Not authenticated");

    try {
        const response = await fetch(`${apiRoot}/letters`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
            body: JSON.stringify(job),
        }
        )
        if (!response.ok) {
            throw new Error("Failed to generate cover letter")
        }

        const data: CoverLetterResponse = await response.json();

        return data.text;
    } catch (error: unknown) {
        console.log("error", error);
    }

    return "";
}

export type { CoverLetterResponse };
export { fetchProtected, generateCoverLetter };