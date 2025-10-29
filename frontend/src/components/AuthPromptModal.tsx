"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPromptModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();

  if (!open) return null;

  const handleContinue = () => {
    onClose();
    router.push("/login?next=/letters/generate");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-lg">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Let’s set up your account 🎉
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We’ll help you create your account and start working on your first cover letter right away.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Maybe later
          </button>
          <button
            onClick={handleContinue}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
