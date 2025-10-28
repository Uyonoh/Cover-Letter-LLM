"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
};

export default function ForgotPassword({ isOpen, onCancel }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const appRoot = process.env.NEXT_PUBLIC_APP_URL!.toString()

  // Allow escape key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appRoot}/password/reset`,
    });

    if (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong.");
    } else {
      setStatus("success");
      setMessage("Check your inbox for a password reset link.");
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-5"
      onClick={onCancel}
    >
      <div
        className="bg-background rounded-xl shadow-2xl w-full max-w-sm p-6 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-semibold text-center mb-2">Reset your password</h1>
        <p className="text-center text-sm text-muted-foreground mb-6">
          Enter your email and we’ll send you a reset link.
        </p>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="name@example.com"
              disabled={status === "loading"}
            />
          </div>

          {message && (
            <div
              className={`text-sm text-center ${
                status === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex justify-center gap-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md px-4 py-2 text-sm border border-border hover:bg-muted transition"
              disabled={status === "loading"}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/80 transition disabled:opacity-70"
              disabled={status === "loading"}
              onClick={handleSubmit}
            >
              {status === "loading" ? "Sending..." : "Send Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
