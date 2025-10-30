"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface ToLoginProps {
  message?: string;
}

export function ToLogin({ message }: ToLoginProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Optional: allow redirect back to the previous page after login
  const next = searchParams?.get("next") || "/generate";

  function handleLoginRedirect() {
    router.push(`/login?next=${encodeURIComponent(next)}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen px-5 bg-black/70">
      <div className="bg-secondary/20 border border-secondary rounded-lg p-8 max-w-md text-center shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-3">Login Required</h2>
        <p className="text-gray-300 mb-6">
          {message ||
            "You need to be logged in to access this feature. Please log in to continue."}
        </p>
        <button
          onClick={handleLoginRedirect}
          className="bg-primary text-white py-2 px-5 rounded-md hover:bg-primary/90 transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
