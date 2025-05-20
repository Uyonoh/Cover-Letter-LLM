import { useEffect, useState } from "react";
import React from "react";
import { APIRoot, getAuthToken } from "../services/api";

type UUID = string;

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
    async function fetchLetters(token: string) {
      try {
        const response = await fetch(APIRoot + "/letters", {
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

    getAuthToken()
    .then((token) => {
      if (!token) {
        setError("No token found");
        return;
      }
      fetchLetters(token);
    })
    
    
  }, []);

  return { letters, loading, error };
}
