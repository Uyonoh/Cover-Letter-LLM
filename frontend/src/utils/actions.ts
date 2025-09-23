"use server";

import { generateCoverLetter, login } from "@/utils/api";
import type { loginProps } from "@/utils/api";
import type { Session } from "@supabase/supabase-js";

async function handleGenerateLetter(formData: FormData) {
    const jobTitle = formData.get("job-title")?.toString();
    const jobDescription = formData.get("job-description")?.toString();
    const job = {jobTitle, jobDescription};

    const letter = await generateCoverLetter({job});
    console.log("SUCCESS!!!!!!!!!!!!!!!!1111");
    console.log(letter);
}

async function handleLogin({ email, password }: { email: string, password: string }) {
    const user: loginProps = {
        email: email,
        password: password,
    }
    const response = await login({user});
    // const data = await response.toString()
    console.log("Login:", response);
    return response;
}

export { handleGenerateLetter, handleLogin };