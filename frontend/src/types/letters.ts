import type { Job } from "@/types/jobs";

interface CoverLetter {
  id: string;
  user_id: string;
  text: string;
  job_id: string;
  content: string;
  version: number;
  created_at: string;
}

interface letterBrief {
  id: string;
  jobs: Job;
  created_at: string;
}

export type { CoverLetter, letterBrief };
