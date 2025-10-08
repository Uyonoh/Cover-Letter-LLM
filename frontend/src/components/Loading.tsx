"use client";

import { useEffect, useState } from "react";

interface LoadingProps {
  isLoading: boolean;
  messages?: string[];
  overlay?: boolean;
  finalMessage?: string; // optional default message at the end
}

function Loading({ isLoading, messages = [], overlay, finalMessage = "Almost done..." }: LoadingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [doneCycling, setDoneCycling] = useState(false);

  useEffect(() => {
    if (!isLoading || messages.length === 0) return;

    setCurrentIndex(0);
    setDoneCycling(false);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setDoneCycling(true);
          return prev;
        }
      });
    }, 2500); // change every 2.5s

    return () => clearInterval(interval);
  }, [isLoading, messages]);

  const classes = overlay
    ? "fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    : "";

  const displayMessage = doneCycling ? finalMessage : messages[currentIndex];

  return (
    <div>
      {isLoading && (
        <div className={classes}>
          <div className="flex flex-col gap-7 justify-center items-center h-64">
            {displayMessage && (
              <h1
                key={displayMessage}
                className="font-bold text-2xl transition-opacity duration-700 ease-in-out opacity-100"
              >
                {displayMessage}
              </h1>
            )}
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Loading;