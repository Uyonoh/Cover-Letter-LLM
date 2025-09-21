"use server";

import { generateCoverLetter } from "@/services/API";

async function handleSubmit(formData: FormData) {
    console.log("ACMAV:");
        const jobDescription = formData.get("job-description")?.toString();

        const letter = await generateCoverLetter({jobDescription});
        console.log(letter);
    }

export { handleSubmit };