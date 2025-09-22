"use server";

import { generateCoverLetter } from "@/utils/api";
import type { Session } from "@supabase/supabase-js";

async function handleSubmit(formData: FormData) {
    // Very hacky way to get token
    const obj = formData.get("token")?.slice(1, -1);
    let token ="";
    if (typeof obj === "string") {
        const objArr = obj.split(",");

        const tokArr = objArr.map((item) => {
            const [key, value] = item.split(":")
            if (key === '"access_token"') {
                return value;
            } else {
                return "";
            }
        });
        token = tokArr[0];
    };

    const jobTitle = formData.get("job-title")?.toString();
    const jobDescription = formData.get("job-description")?.toString();
    const job = {jobTitle, jobDescription};

    const letter = await generateCoverLetter({job, token});
    console.log("SUCCESS!!!!!!!!!!!!!!!!1111");
    console.log(letter);
}

export { handleSubmit };