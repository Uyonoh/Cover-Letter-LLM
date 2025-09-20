import { Paperclip } from "lucide-react";

function Generate() {
    return (
        <div className="py-5 px-5 sm:px-7 md:px-10 text-white/80">
            <div className="sm:grid sm:grid-cols-12">
                <div className="description col-span-9 sm:border-r sm:border-secondary/80 sm:pr-5 sm:min-h-screen">
                    <h2 className="font-bold text-2xl text-white">Generate Your Cover Letter</h2>
                    <p className="text-base py-1">
                        Create a tailored cover letter in seconds by providing a job description
                    </p>

                    <form action="" method="post" className="flex flex-col gap-5 py-10">
                        <textarea name="job-description" id="job-description"
                            placeholder="Paste the job description here or upload a file"
                            className="text-white w-full h-50 sm:h-[60vh] border border-secondary rounded-sm p-2
                            focus:border-primary focus:ring-0 focus:outline-none">
                        </textarea>
                        <div className="flex justify-center sm:justify-between items-center">
                            <button className="flex gap-2 items-center rounded-lg px-4 py-2 border border-secondary cursor-pointer hover:bg-gray-700">
                                <Paperclip size={18} className="" />
                                Upload File
                            </button>
                            <button className="rounded-lg px-4 py-2 hidden sm:block bg-primary cursor-pointer text-white hover:bg-primary/90 transition-colors">Generate Cover Letter</button>
                        </div>
                    </form>
                </div>
                <div className="custumization  sm:col-span-3 sm:pl-5 flex flex-col gap-7">
                    <h3 className="font-bold text-xl text-white pt-2">Customization</h3>
                    {/* Letter Style */}
                    <div className="flex flex-col gap-3">
                        <p>Cover Letter Style</p>
                        <div className="grid grid-cols-3 sm:grid-cols-2 gap-3">
                            <label className="flex-1">
                                <input  className="sr-only peer" name="cover-letter-style" type="radio" value="professional"/>
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary dark:border-gray-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Professional
                                </div>
                            </label>
                            <label className="flex-1">
                                <input  className="sr-only peer" name="cover-letter-style" type="radio" value="casual"/>
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary dark:border-gray-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Casual
                                </div>
                            </label>
                            <label className="flex-1 sm:col-span-2 ">
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
                        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                            <label className="flex-1">
                                <input  className="sr-only peer" name="cover-letter-length" type="radio" value="concise"/>
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary dark:border-gray-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Concise
                                </div>
                            </label>
                            <label className="flex-1">
                                <input  className="sr-only peer" name="cover-letter-length" type="radio" value="standard"/>
                                <div className="cursor-pointer text-center text-sm font-medium py-2 px-3 rounded-lg border border-secondary dark:border-gray-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors">
                                    Standard
                                </div>
                            </label>
                            <label className="flex-1">
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
                <button className="rounded-lg p-2 sm:hidden bg-primary w-full my-7 cursor-pointer">Generate Cover Letter</button>
            </div>
        </div>
    );
}

export default Generate;