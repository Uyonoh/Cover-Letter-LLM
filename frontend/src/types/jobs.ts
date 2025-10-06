interface Job {
  id: string;
  user_id: string;
  title: string;
  company: string | undefined;
  description: string | undefined;
  created_at: string;
}

export type { Job };
