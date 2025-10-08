import type { Job } from "@/types/jobs";

type UUID = string;

interface CoverLetter {
  id: UUID;
  user_id: UUID;
  job_id: UUID;
  content: string;
  version: number;
  created_at: string;
  style: "professional" | "casual" | "creative";
  length: "concise" | "standard" | "detailed";
  modifiers: string[];
}

interface letterBrief {
  id: UUID;
  jobs: Job;
  content: string;
  created_at: string;
}

interface LetterView extends CoverLetter {
  jobs: Job;
}

export type { CoverLetter, letterBrief, LetterView };
