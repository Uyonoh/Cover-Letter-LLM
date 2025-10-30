"use client";

import { useRouter } from "next/navigation";

interface ToLoginProps {
  message?: string;
  onContinue: () => void;
}

export function ToProfileUpload({ message, onContinue }: ToLoginProps) {
  const router = useRouter();

  function toResumeUpload() {
    router.push("/profile#resume");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen px-5 bg-black/70">
      <div className="bg-secondary/20 border border-secondary rounded-lg p-8 max-w-md text-center shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-3">Attention</h2>
        <p className="text-gray-300 mb-6 whitespace-pre-line">
          {message ||
            "We could not find your resume.\nUploading a resume ensures your letter is best tailored to your talents."}
        </p>
        <div className="flex justify-between">
          <button
          type="button"
          onClick={onContinue}
          className=" text-white py-2 px-5 rounded-md border border-secondary hover:bg-secondary/90 transition-colors"
        >
          Continue
        </button>
        <button
          type="button"
          onClick={toResumeUpload}
          className="bg-primary text-white py-2 px-5 rounded-md hover:bg-primary/90 transition-colors"
        >
          Upload Resume
        </button>
      </div>
      </div>
    </div>
  );
}
