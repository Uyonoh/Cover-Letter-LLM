type UUID = string;

interface Job {
  id: UUID;
  user_id: UUID;
  title: string;
  company: string | undefined;
  description: string | undefined;
  created_at: string;
}

export type { Job };
