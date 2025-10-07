"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/utils/api";
import Loading from "@/components/Loading";
import DeleteButton from "@/components/DeleteButton";


function View() {
    const [jobTitle, setJobTitle] = useState("");
    const [letter, setLetter] = useState("");

    const [style, setStyle] = useState<"professional" | "casual" | "creative">("professional");
    const [length, setLength] = useState<"concise" | "standard" | "detailed">("standard");
    const [modifiers, setModifiers] = useState({
        leadership: false,
        technical: false,
        problemSolving: false,
    });

    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (!id) return;
        setIsLoading(true);

        apiFetch(`/letters/${id}`)
            .then(async (res) => {
                if (!res.ok) throw new Error(await res.text());
                return res.json();
            })
            .then((data) => {
                setJobTitle(data.letter?.jobs?.title ?? "");
                setLetter(data.letter?.content ?? "");

                // Pre-populate customization
                setStyle(data.letter?.style ?? "professional");
                setLength(data.letter?.length ?? "standard");
                setModifiers({
                    leadership: data.letter?.modifiers?.includes("leadership") ?? false,
                    technical: data.letter?.modifiers?.includes("technical") ?? false,
                    problemSolving: data.letter?.modifiers?.includes("problemSolving") ?? false,
                });
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                alert("Failed to load letter");
            })
            .finally(() => setIsLoading(false));
    }, [id]);


    async function handleRegenerate() {
        try {
            setIsLoading(true);
            const res = await apiFetch(`/letters/${id}/regenerate`, {
                method: "POST",
                body: JSON.stringify({
                    jobTitle,
                    style,
                    length,
                    modifiers: Object.keys(modifiers).filter((key) => modifiers[key as keyof typeof modifiers]),
                }),
            });

            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setLetter(data.generatedLetter);
        } catch (err) {
            console.error("Regenerate failed:", err);
            alert("Could not regenerate letter.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await apiFetch(`/letters/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobTitle,
                    content: letter,
                    style,
                    length,
                    modifiers: Object.keys(modifiers).filter(
                        (key) => modifiers[key as keyof typeof modifiers]
                    ),
                }),
            });

            if (!res.ok) {
                throw new Error(await res.text());
            }

            const data = await res.json();
            console.log("Letter saved:", data);
            alert("Letter saved successfully!");
        } catch (err) {
            console.error("Save failed:", err);
            alert("Could not save letter.");
        } finally {
            setIsLoading(false);
        }
    }


    if (isLoading) {
        return (
            <Loading isLoading={isLoading} messages={["Retrieving your letter..."]} />
        );
    }

    if (!id) {
        return (
            <div>
                <p>Letter not found!!!</p>
            </div>
        )
    }

    return (
        <div className="relative py-5 px-5 sm:px-7 md:px-10 text-white/80">
            <form className="sm:grid sm:grid-cols-12" onSubmit={handleSubmit}>
                <input type="hidden" name="token" id="token" value="" />
                <div className="description col-span-9 sm:border-r sm:border-secondary/80 sm:pr-5 sm:min-h-screen">
                    <h2 className="font-bold text-2xl text-white">Your Cover Letter</h2>
                    <p className="text-base py-1">
                        {/* job title */}
                    </p>

                    <div className="flex flex-col gap-5 py-5">
                        <div className="flex justify-between items-center">
                            <input type="text" name="job-title" id="job-title"
                                value={jobTitle}
                                className="sm:w-full bg-secondary/10 text-white border border-secondary rounded-lg py-2 px-4 max-w-[500px]
                                            focus:border-primary focus:ring-0 focus:outline-none text-lg"
                                onChange={(e) => setJobTitle(e.target.value)} />
                            <DeleteButton id={id} table="cover_letters" text="" aria-label="Delete this letter" />
                        </div>
                        <textarea name="job-description" id="job-description"
                            value={letter}
                            placeholder="Paste the job description here or upload a file"
                            className="text-white w-full h-50 sm:h-[50vh] border border-secondary rounded-sm p-2
                            focus:border-primary focus:ring-0 focus:outline-none"
                            onChange={e => setLetter(e.target.value)}>
                        </textarea>
                        <div className="hidden sm:block">
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    className="rounded-lg px-4 py-2 border border-primary text-white hover:bg-background-light cursor-pointer"
                                    onClick={handleRegenerate}
                                >
                                    Regenerate
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-lg px-4 py-2 bg-primary text-white hover:bg-primary/90 cursor-pointer"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right on larger screens, wrap under on small screen */}
                <div className="custumization  sm:col-span-3 sm:pl-5 flex flex-col gap-7">
                    <h3 className="font-bold text-xl text-white pt-2">Customization</h3>
                    {/* Letter Style */}
                    <div className="flex flex-col gap-3">
                        <p>Cover Letter Style</p>
                        <div className="flex flex-wrap gap-3">
                            <label className="flex-1 min-w-[100px]">
                                <input className="sr-only peer" name="cover-letter-style" type="radio" value="professional"
                                    checked={style === "professional"}
                                    onChange={() => setStyle("professional")} />
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary dark:border-gray-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Professional
                                </div>
                            </label>
                            <label className="flex-1 min-w-[100px]">
                                <input className="sr-only peer" name="cover-letter-style" type="radio" value="casual"
                                    checked={style === "casual"}
                                    onChange={() => setStyle("casual")} />
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary dark:border-gray-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Casual
                                </div>
                            </label>
                            <label className="flex-1 w-full min-w-[100px] ">
                                <input className="sr-only peer" name="cover-letter-style" type="radio" value="creative"
                                    checked={style === "creative"}
                                    onChange={() => setStyle("creative")} />
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary dark:border-gray-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
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
                                <input className="sr-only peer" name="cover-letter-length" type="radio" value="concise"
                                    checked={length === "concise"}
                                    onChange={() => setLength("concise")} />
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary dark:border-gray-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Concise
                                </div>
                            </label>
                            <label className="flex-1 min-w-[80px]">
                                <input className="sr-only peer" name="cover-letter-length" type="radio" value="standard"
                                    checked={length === "standard"}
                                    onChange={() => setLength("standard")} />
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary dark:border-gray-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Standard
                                </div>
                            </label>
                            <label className="flex-1 min-w-[80px]">
                                <input className="sr-only peer" name="cover-letter-length" type="radio" value="detailed"
                                    checked={length === "detailed"}
                                    onChange={() => setLength("detailed")} />
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary dark:border-gray-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Detailed
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* modifiers */}
                    <div className="flex flex-col gap-3">
                        <p>Modifiers</p>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-3">
                                <input type="checkbox" name="leadership" id="leadership"
                                    checked={modifiers.leadership}
                                    onChange={(e) =>
                                        setModifiers({ ...modifiers, leadership: e.target.checked })
                                    } />
                                <label htmlFor="leadership">Highlight Leadership Skills</label>
                            </div>
                            <div className="flex gap-3">
                                <input type="checkbox" name="technical" id="technical"
                                    checked={modifiers.technical}
                                    onChange={(e) =>
                                        setModifiers({ ...modifiers, technical: e.target.checked })
                                    } />
                                <label htmlFor="technical">Emphasize Technical Expertise</label>
                            </div>
                            <div className="flex gap-3">
                                <input type="checkbox" name="problem-solving" id="problem-solving"
                                    checked={modifiers.problemSolving}
                                    onChange={(e) =>
                                        setModifiers({ ...modifiers, problemSolving: e.target.checked })
                                    } />
                                <label htmlFor="problem-solving">Showcase Problem-Solving Skills</label>
                            </div>
                        </div>
                    </div>
                    {/* TODO: Add custom prompt text area */}
                </div>
                <div className="flex sm:hidden gap-3 justify-between my-7">
                    <button
                        type="button"
                        className="rounded-lg px-4 py-2 border border-primary text-white hover:bg-background-light cursor-pointer"
                        onClick={handleRegenerate}
                    >
                        Regenerate
                    </button>

                    <button
                        type="submit"
                        className="rounded-lg px-4 py-2 bg-primary text-white hover:bg-primary/90 cursor-pointer"
                    >
                        Save
                    </button>
                </div>
                {/* <button type="submit" className="rounded-lg p-2 sm:hidden bg-primary w-full my-7 cursor-pointer">Generate Cover Letter</button> */}
            </form>

        </div>
    );
}

export default View;