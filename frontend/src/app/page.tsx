"use client";

import "@/styles/index.css";
import { Clock, FilePenLine, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthPromptModal from "@/components/AuthPromptModal";
import { useAuth } from "@/hooks/useAuth";

function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { session } = useAuth();
  const user = session?.user;

  const handleGenerateClick = () => {
    if (user) {
      router.push("/letters/generate");
    } else {
      setModalOpen(true);
    }
  };

  return(
    <div className="py-5 px-5 sm:px-7 md:px-10">
      <div className="hero flex justify-center align-center min-h-[480px] sm:min-h-[560px]
        bg-center bg-cover bg-no-repeat rounded-lg md:rounded-lg px-6 py-10">
          <div className="flex flex-col gap-6 text-center justify-center items-center max-w-[700px]">
            <h1 className="font-black text-4xl md:text-5xl tracking-tighter leading-tight">Craft Cover Letters That Land Interviews</h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto">Leverage the power of AI to create personalized cover letters that
              highlight your strengths and align with each job description, 
              saving you time and boosting your chances of landing that interview.
            </p>
            <button className="px-6 py-3 min-w-[84px] max-w-[480px] bg-[#0d7ff2] rounded-xl truncate text-base font-bold
              cursor-pointer hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
              onClick={(e) => handleGenerateClick()}>
              Get Started on Your Letter
            </button>
          </div>
      </div>

      <section className="px-3 py-10 my-10 flex flex-col justify-center items-center">
        <div className="flex flex-col gap-5 text-center justify-center items-center max-w-[700px]">
          <h2 className="font-bold text-2xl tracking-tighter">Why Choose CoverLetterLLM? </h2>
          <p className="text-base sm:text-lg text-white/80 tracking-light">Our AI-powered cover letter generator is designed
             to streamline your job application process and maximize your chances of success.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5 py-5 my-5">
          <div className="flex flex-col p-5 gap-2 bg-[#0f2d4b] border border-[#0f3760]
            rounded-lg">
            <span className="bg-[#0d7ff2] h-12 w-12 rounded-full flex justify-center items-center" >
              <Clock color="#fff" className="material-symbols-outlined text-2xl" />
            </span>
            <h2 className="font-bold text-xl">Save Time</h2>
            <p className="text-sm text-white/80 leading-lighter tracking-wide">Generate a compelling cover letter in minutes, freeing up your time to focus on other aspects of your job search.</p>
          </div>

          <div className="flex flex-col p-5 gap-2 bg-[#0f2d4b] border border-[#0f3760]
            rounded-lg">
            <span className="bg-[#0d7ff2] h-12 w-12 rounded-full flex justify-center items-center" >
              <FilePenLine color="#fff" className="material-symbols-outlined text-2xl" />
            </span>
            <h2 className="font-bold text-xl">Personalized for Each Job</h2>
            <p className="text-sm text-white/80 leading-lighter tracking-wide">Our AI analyzes job descriptions to tailor your cover letter, ensuring it highlights the most relevant skills and experiences.</p>
          </div>

          <div className="flex flex-col p-5 gap-2 bg-[#0f2d4b] border border-[#0f3760]
            rounded-lg">
            <span className="bg-[#0d7ff2] h-12 w-12 rounded-full flex justify-center items-center" >
              <TrendingUp color="#fff" className="material-symbols-outlined text-2xl" />
            </span>
            <h2 className="font-bold text-xl">Increase Interview Rates</h2>
            <p className="text-sm text-white/80 leading-lighter tracking-wide">Studies show that personalized cover letters significantly increase your chances of getting an interview. Our tool helps you achieve this effortlessly.</p>
          </div>
        </div>
      </section>
      <AuthPromptModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default Home;