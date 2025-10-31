import { useState } from "react";
import { apiFetch } from "@/utils/api";

interface ResumeData {
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    highlights: string[];
    skills: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
}

export function useResumeParser() {
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function parseResume(file: File) {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const data = await apiFetch("/resumes/parse", {
        method: "POST",
        body: formData,
      });

      setParsedData(data.data);
      return data.data as ResumeData;
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { parsedData, loading, error, parseResume };
}
