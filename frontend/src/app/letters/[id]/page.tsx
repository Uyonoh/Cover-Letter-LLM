"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { supabase } from "@/utils/supabaseClient";
import { SendHorizonal } from "lucide-react";
import Loading from "@/components/Loading";
import DeleteButton from "@/components/DeleteButton";
import type { LetterView } from "@/types/letters";

function View() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobId, setJobId] = useState("");
  const [letter, setLetter] = useState("");
  const [oldLetter, setOldLetter] = useState("");
  const [prompt, setPrompt] = useState("");
  const [prompts, setPrompts] = useState<string[]>([]);
  const max_prompt_length = 150;

  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isModifying, setIsModifying] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    apiFetch(`/letters/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data: {letter: LetterView}) => {
        setJobTitle(data.letter?.jobs?.title ?? "");
        setJobId(data.letter?.job_id ?? "");
        setLetter(data.letter?.content ?? "");
        setOldLetter(data.letter?.content ?? "");
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("Failed to load letter");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  function handleSetPrompt (newPrompt: string) {
    if (newPrompt.length <= max_prompt_length) {
      setPrompt(newPrompt);
    }}

  useEffect(() => {
    const popularPrompts = [
      "Revise this letter to sound more appropriate for a senior role",
      "Recast this as approachable and conversational - like someone you'd want on your team",
      "Replace passive phrasing with active statements that project authority",
      "Make this sound more collaborative, not boastful",
      "Integrate metrics to show tangible outcomes where possible",
      "Refine the middle paragraphs to showcase niche exxpertise and distinctive skills",
      "Reshape the opening to immediately capture attention",
      "Reorganize this to tell a smother story",
      "Rewrite the last paragraph to convey genuine excitement and innitiative",
      "Add a concise anecdote that illustrates problem-solving skills or passion",
      "Make it clear that I'm already fluent in this industry",
    ]
    // Only use n random prompts
    const n = 3;
    const shuffled = popularPrompts.sort(() => 0.5 - Math.random());
    const prompts = shuffled.slice(0, n);

    setPrompts(prompts);
  }, [oldLetter]);

  async function handleRegenerate() {
    // TODO: Add selection of various modifiers
    try {
      setIsRegenerating(true);
      const res = await apiFetch(`/letters/${id}/regenerate`, {
        method: "POST",
        // body: JSON.stringify({
        //   jobTitle,
        // }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setLetter(data.generatedLetter);
    } catch (err) {
      console.error("Regenerate failed:", err);
      alert("Could not regenerate letter.");
    } finally {
      setIsRegenerating(false);
    }
  }

  async function handleModify() {

    try {
      setIsModifying(true);
      const payload = {
        letter: letter,
        job_title: jobTitle,
        prompt: prompt
      };
      const response = await apiFetch("/letters/modify", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        alert("Failed to modify Letter!");
        return;
      }
      alert("Modified!");
      const data = await response.json()
      setLetter(data.letter);
    } catch (err: unknown) {
      console.error("Modify failed:", err);
      alert("Could not modify letter.");
    } finally {
      setIsModifying(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("cover_letters")
        .update({
          content: letter,
        })
        .eq("id", id);

      if (error) throw error;

      const { error: jobErr } = await supabase
        .from("jobs")
        .update({ title: jobTitle })
        .eq("id", jobId);

      if (jobErr) throw jobErr;

      setOldLetter(letter);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Could not save letter.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteJob() {
    // Check if that job still has letters
    const { count } = await supabase
      .from('letters')
      .select('id', { count: 'exact', head: true })
      .eq('job_id', jobId);

    if (count === 0) {
      await supabase.from('jobs').delete().eq('id', jobId);
    }
  }

  if (isLoading) {
    return (
      <Loading isLoading={isLoading} messages={[
        "Loading your letter",
        "Populating data",
        "Just a moment",
      ]} />
    );
  }

  if (!id) {
    return (
      <div>
        <p>Letter not found!!!</p>
      </div>
    );
  }

  return (
    <div className="relative py-5 px-5 sm:px-7 md:px-10 text-white/80">
      <form className="sm:grid sm:grid-cols-12" onSubmit={handleSubmit}>
        <input type="hidden" name="token" id="token" value="" />
        <div className="description col-span-9 sm:border-r sm:border-secondary/80 sm:pr-5 sm:min-h-screen">
          <h2 className="font-bold text-2xl text-white">Your Cover Letter</h2>
          <p className="text-base py-1">{/* job title */}</p>

          <div className="flex flex-col gap-5 py-5">
            <div className="flex justify-between items-center">
              <input
                type="text"
                name="job-title"
                id="job-title"
                value={jobTitle}
                className="sm:w-full bg-secondary/10 text-white border border-secondary rounded-lg py-2 px-4 max-w-[500px]
                                            focus:border-primary focus:ring-0 focus:outline-none text-lg"
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <DeleteButton
                id={id}
                table="cover_letters"
                text=""
                aria-label="Delete this letter"
                onDeleted={handleDeleteJob}
              />
            </div>
            <textarea
              name="job-description"
              id="job-description"
              value={letter}
              placeholder="Paste the job description here or upload a file"
              className="text-white w-full h-50 sm:h-[50vh] border border-secondary rounded-sm p-2
                            focus:border-primary focus:ring-0 focus:outline-none"
              onChange={(e) => setLetter(e.target.value)}
            ></textarea>
            <div className="hidden sm:block">
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 border border-secondary cursor-pointer hover:bg-gray-700"
                  onClick={handleRegenerate}
                >
                  Regenerate
                </button>

                <button
                  type="submit"
                  disabled={oldLetter === letter}
                  className="rounded-lg px-4 py-2 bg-primary text-white hover:bg-primary/90 cursor-pointer disabled:bg-gray-500 disabled:text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right on larger screens, wrap under on small screen */}
        <div className="custumization  sm:col-span-3 sm:pl-5 flex flex-col gap-7">
          <h3 className="font-bold text-xl text-white pt-2">Customize Your Letter</h3>
          
          {/* Custom prompt text area */}
          <div className="relative w-full">
            <textarea
              name="prompt"
              id="prompt"
              value={prompt}
              placeholder="Tweak the tone, adjust the details, or shuffle the content of this cover letter"
              maxLength={500} // set your character limit here
              className="text-white w-full h-50 sm:h-65  border border-secondary rounded-sm p-3 pb-12
                        focus:border-primary focus:ring-0 focus:outline-none resize-none"
              onChange={(e) => handleSetPrompt(e.target.value)}
            ></textarea>

            <div className="absolute bottom-3 w-full flex items-center justify-between h-10 px-2">
              {/* Character count */}
              <div className={`text-sm ` + (prompt.length >= max_prompt_length ? "text-red-500" : "text-white/70")}>
                {prompt.length}/{max_prompt_length}
              </div>

              {/* Send button */}
              <span
                className="rounded-full flex items-center justify-center cursor-pointer"
                onClick={handleModify} // define this function
              >
                <SendHorizonal
                  size={24}
                  className="text-white/80 hover:text-primary"
                />
              </span>
            </div>
          </div>



          {/* Suggestions */}
          <div className="flex flex-col gap-3">
            <p>Popular Fixes</p>
            <div className="flex flex-wrap gap-3">
                {prompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="rounded-lg px-3 py-1 border border-secondary text-sm hover:bg-gray-700 cursor-pointer">
                  {p}
                </button>
                ))}
            </div>
          </div>
              
        </div>
        <div className="flex sm:hidden gap-3 justify-between my-7">
          <button
            type="button"
            className="rounded-lg px-4 py-2 border border-secondary text-white hover:bg-background-light cursor-pointer"
            onClick={handleRegenerate}
          >
            Regenerate
          </button>

          <button
            type="submit"
            disabled={oldLetter === letter}
            className="rounded-lg px-4 py-2 bg-primary text-white hover:bg-primary/90 cursor-pointer disabled:bg-gray-500 disabled:text-white"
          >
            Save
          </button>
        </div>
        {/* <button type="submit" className="rounded-lg p-2 sm:hidden bg-primary w-full my-7 cursor-pointer">Generate Cover Letter</button> */}
      </form>

      <Loading isLoading={isModifying} overlay messages={[
        "Parsing Prompt",
        "Anallyzing letter",
        "Making appropriate changes",
        "Just a moment",
      ]} />
      <Loading isLoading={isRegenerating} overlay messages={[
        "Validating your letter",
        "Making changes",
        "Just a moment",
      ]} />
      <Loading isLoading={isSaving} overlay messages={[
        "Validating your letter",
        "Sending to database",
        "Just a moment",
      ]} />
    </div>
  );
}

export default View;
