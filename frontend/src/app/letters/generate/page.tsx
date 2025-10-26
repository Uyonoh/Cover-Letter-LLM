"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Paperclip } from "lucide-react";
import { apiFetch } from "@/utils/api";
import Loading from "@/components/Loading";

function Generate() {
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Customization state
    const [style, setStyle] = useState<"professional" | "casual" | "creative">("professional");
    const [length, setLength] = useState<"concise" | "standard" | "detailed">("standard");
    const [modifiers, setModifiers] = useState({
        leadership: false,
        technical: false,
        problemSolving: false,
    });

    const router = useRouter();

    async function handleGenerateLetter(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await apiFetch("/letters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    job_title: jobTitle,
                    job_description: jobDescription,
                    style,
                    length,
                    modifiers: Object.keys(modifiers).filter(
                        (key) => modifiers[key as keyof typeof modifiers]
                    ),
                }),
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/letters/${data.letter_id}`);
            } else {
                alert("Generation Failed");
            }
        } finally {
            setIsLoading(false);
        }
    }

    function handleReset() {
        setStyle("professional");
        setLength("standard");
        setModifiers({
            leadership: false,
            technical: false,
            problemSolving: false,
        });
    }


    return (
        <div className="py-5 px-5 sm:px-7 md:px-10 text-white/80">
            <form onSubmit={handleGenerateLetter} className="sm:grid sm:grid-cols-12">
                <input type="hidden" name="token" id="token" value="" />

                {/* Left side: description */}
                <div className="description col-span-9 sm:border-r sm:border-secondary/80 sm:pr-5 sm:min-h-screen">
                    <h2 className="font-bold text-2xl text-white">Generate Your Cover Letter</h2>
                    <p className="text-base py-1">
                        Create a tailored cover letter in seconds by providing a job description
                    </p>

                    <div className="flex flex-col gap-5 py-5">
                        <input
                            type="text"
                            name="job-title"
                            id="job-title"
                            placeholder="Enter Job Title (Optional)"
                            className="bg-secondary/10 text-white border border-secondary rounded-lg py-2 px-4 max-w-[500px]
                         focus:border-primary focus:ring-0 focus:outline-none text-lg"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                        />

                        <textarea
                            name="job-description"
                            id="job-description"
                            placeholder="Paste the job description here or upload a file"
                            className="text-white w-full h-50 sm:h-[50vh] border border-secondary rounded-sm p-2
                         focus:border-primary focus:ring-0 focus:outline-none"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />

                        <div className="flex justify-center sm:justify-end items-center">
                            {/* <button
                                type="button"
                                className="flex gap-2 items-center rounded-lg px-4 py-2 border border-secondary cursor-pointer hover:bg-gray-700"
                            >
                                <Paperclip size={18} />
                                Upload File
                            </button> */}
                            <button
                                type="submit"
                                className="rounded-lg px-4 py-2 hidden sm:block bg-primary cursor-pointer text-white hover:bg-primary/90 transition-colors"
                            >
                                Generate Cover Letter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right side: customization */}
                <div className="customization sm:col-span-3 sm:pl-5 flex flex-col gap-7">
                    <h3 className="font-bold text-xl text-white pt-2">Customization</h3>

                    {/* Style */}
                    <div className="flex flex-col gap-3">
                        <p>Cover Letter Style</p>
                        <div className="flex flex-wrap gap-3">
                            <label className="flex-1 min-w-[100px]">
                                <input
                                    className="sr-only peer"
                                    type="radio"
                                    name="cover-letter-style"
                                    value="professional"
                                    checked={style === "professional"}
                                    onChange={() => setStyle("professional")}
                                />
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary
                                peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Professional
                                </div>
                            </label>
                            <label className="flex-1 min-w-[100px]">
                                <input
                                    className="sr-only peer"
                                    type="radio"
                                    name="cover-letter-style"
                                    value="casual"
                                    checked={style === "casual"}
                                    onChange={() => setStyle("casual")}
                                />
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary
                                peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Casual
                                </div>
                            </label>
                            <label className="flex-1 w-full min-w-[100px]">
                                <input
                                    className="sr-only peer"
                                    type="radio"
                                    name="cover-letter-style"
                                    value="creative"
                                    checked={style === "creative"}
                                    onChange={() => setStyle("creative")}
                                />
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary
                                peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Creative
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Length */}
                    <div className="flex flex-col gap-3">
                        <p>Length</p>
                        <div className="flex flex-wrap gap-3">
                            <label className="flex-1 min-w-[80px]">
                                <input
                                    className="sr-only peer"
                                    type="radio"
                                    name="cover-letter-length"
                                    value="concise"
                                    checked={length === "concise"}
                                    onChange={() => setLength("concise")}
                                />
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary
                                peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Concise
                                </div>
                            </label>
                            <label className="flex-1 min-w-[80px]">
                                <input
                                    className="sr-only peer"
                                    type="radio"
                                    name="cover-letter-length"
                                    value="standard"
                                    checked={length === "standard"}
                                    onChange={() => setLength("standard")}
                                />
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary
                                peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Standard
                                </div>
                            </label>
                            <label className="flex-1 min-w-[80px]">
                                <input
                                    className="sr-only peer"
                                    type="radio"
                                    name="cover-letter-length"
                                    value="detailed"
                                    checked={length === "detailed"}
                                    onChange={() => setLength("detailed")}
                                />
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary
                                peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Detailed
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Modifiers */}
                    <div className="flex flex-col gap-3">
                        <p>Modifiers</p>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-3">
                                <input
                                    type="checkbox"
                                    id="leadership"
                                    checked={modifiers.leadership}
                                    onChange={(e) =>
                                        setModifiers({ ...modifiers, leadership: e.target.checked })
                                    }
                                />
                                <label htmlFor="leadership">Highlight Leadership Skills</label>
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="checkbox"
                                    id="technical"
                                    checked={modifiers.technical}
                                    onChange={(e) =>
                                        setModifiers({ ...modifiers, technical: e.target.checked })
                                    }
                                />
                                <label htmlFor="technical">Emphasize Technical Expertise</label>
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="checkbox"
                                    id="problem-solving"
                                    checked={modifiers.problemSolving}
                                    onChange={(e) =>
                                        setModifiers({ ...modifiers, problemSolving: e.target.checked })
                                    }
                                />
                                <label htmlFor="problem-solving">Showcase Problem-Solving Skills</label>
                            </div>
                        </div>
                        {/* reset */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="rounded-lg px-4 py-2 border border-secondary text-white hover:bg-gray-700 transition-colors"
                            >
                                Reset to Defaults
                            </button>
                        </div>
                    </div>
                    {/* TODO: Add custom prompt text area if needed */}
                </div>

                {/* Mobile-only submit button */}
                <button
                    type="submit"
                    className="rounded-lg p-2 sm:hidden bg-primary w-full my-7 cursor-pointer"
                >
                    Generate Cover Letter
                </button>
            </form>

            <Loading
                isLoading={isLoading}
                messages={[
                    "Analyzing Job Description",
                    "Crafting Your Cover Letter",
                    "Finalizing Details",
                ]}
                overlay
                delay={3500}
            />
        </div>
    );
}

export default Generate;
