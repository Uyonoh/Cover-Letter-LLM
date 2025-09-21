import { error } from "console";

interface CoverLetterResponse {
    id: string;
    user_id: string;
    letter: string;
    job_title: string;
    job_description: string;
    // prompt: string;
    created_at: string;
    // updated_at: string;
}

async function generateCoverLetter({ jobDescription }: { jobDescription: string | undefined }):Promise<string> {
    const body = {
        jobDescription: jobDescription
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/letters/generate/", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(body),
        }
        )

        const data: CoverLetterResponse = await response.json();

        return data.letter;
    } catch (error: unknown) {
        console.log("error", error);
    }

    return "";
}

export type { CoverLetterResponse };
export { generateCoverLetter };