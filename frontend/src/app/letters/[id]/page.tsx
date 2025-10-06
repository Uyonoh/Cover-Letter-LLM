"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Trash2 } from "lucide-react";
import { apiFetch } from "@/utils/api";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";


function View() {
    const pathname = usePathname();
    const [jobTitle, setJobTitle] = useState("");
    const [letter, setLetter] = useState("");
    const id = pathname.split("/").pop();
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setDialogOpen] = useState(false);


    useEffect(() => {
        setIsLoading(true);
        if (id) {
            apiFetch(`/letters/${id}`)
            .then((res) => {
                if (res.ok){
                return res.json();
            } else {
                alert("Failed to get letter");
            }
            })
            .then((data) => {
                setJobTitle(data.letter.jobs.title)
                setLetter(data.letter.content);
            })
            .finally(() => {
                setIsLoading(false);
            });
        }

        

    }, [id]);

    function handleDelete ():void {
        console.log("Deleted");
    }


    if (isLoading) {
        return (
            <div className="flex flex-col gap-7 justify-center items-center h-64">
                <h1 className="font-bold text-2xl">Retrieving your letter...</h1>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="relative py-5 px-5 sm:px-7 md:px-10 text-white/80">
            <form action="" className="sm:grid sm:grid-cols-12">
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
                                onChange={(e) => setJobTitle(e.target.value)}/>
                            <Trash2 size={20}
                            className="text-red-700 hover:text-red-500 cursor-pointer"
                            onClick={() => setDialogOpen(true)}/>
                        </div>
                        <textarea name="job-description" id="job-description"
                            value={letter}
                            placeholder="Paste the job description here or upload a file"
                            className="text-white w-full h-50 sm:h-[50vh] border border-secondary rounded-sm p-2
                            focus:border-primary focus:ring-0 focus:outline-none"
                            onChange={e => setLetter(e.target.value)}>
                        </textarea>
                        <div className="hidden sm:flex justify-end items-center">
                            {/* <button className="flex gap-2 items-center rounded-lg px-4 py-2 border border-secondary cursor-pointer hover:bg-gray-700">
                                <Paperclip size={18} className="" />
                                Upload File
                            </button> */}
                            <button type="submit" className="rounded-lg px-4 py-2 bg-primary cursor-pointer text-white hover:bg-primary/90 transition-colors">Generate Cover Letter</button>
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
                                <input  className="sr-only peer" name="cover-letter-style" type="radio" value="professional"/>
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary dark:border-gray-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Professional
                                </div>
                            </label>
                            <label className="flex-1 min-w-[100px]">
                                <input  className="sr-only peer" name="cover-letter-style" type="radio" value="casual"/>
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary dark:border-gray-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Casual
                                </div>
                            </label>
                            <label className="flex-1 w-full min-w-[100px] ">
                                <input  className="sr-only peer" name="cover-letter-style" type="radio" value="creative"/>
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
                                <input  className="sr-only peer" name="cover-letter-length" type="radio" value="concise"/>
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary dark:border-gray-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Concise
                                </div>
                            </label>
                            <label className="flex-1 min-w-[80px]">
                                <input  className="sr-only peer" name="cover-letter-length" type="radio" value="standard"/>
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary dark:border-gray-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Standard
                                </div>
                            </label>
                            <label className="flex-1 min-w-[80px]">
                                <input  className="sr-only peer" name="cover-letter-length" type="radio" value="detailed"/>
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
                                <input type="checkbox" name="leadership" id="leadership" />
                                <label htmlFor="leadership">Highlight Leadership Skills</label>
                            </div>
                            <div className="flex gap-3">
                                <input type="checkbox" name="technical" id="technical" />
                                <label htmlFor="technical">Emphasize Technical Expertise</label>
                            </div>
                            <div className="flex gap-3">
                                <input type="checkbox" name="problem-solving" id="problem-solving" />
                                <label htmlFor="problem-solving">Showcase Problem-Solving Skills</label>
                            </div>
                        </div>
                    </div>
                    {/* TODO: Add custom prompt text area */}
                </div>
                <button type="submit" className="rounded-lg p-2 sm:hidden bg-primary w-full my-7 cursor-pointer">Generate Cover Letter</button>
            </form>

            {/* Delete dialogue */}
            <DeleteConfirmationDialog
                isOpen={isDialogOpen}
                onCancel={() => setDialogOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}

export default View;