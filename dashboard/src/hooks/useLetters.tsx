import { UUID } from "crypto";
import { useEffect, useState } from "react";
import React from "react";

interface Letter {
  id: UUID;
  user_id: UUID;
  name: string;
  title: string;
  content: string;
  created_at: Date;
}

interface useLetterResult {
  letters: Letter[];
  loading: boolean;
  error: string | null;
}

export function useLetters(): useLetterResult {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchLetters() {
      try {
        const response = await fetch("http://localhost:8080/api/letters", {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cover letters");
        }

        const data: Letter[] = await response.json();
        setLetters(data);
      } catch (error) {
        setError(error.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    }

    fetchLetters();
  }, []);

  return { letters, loading, error };
}
