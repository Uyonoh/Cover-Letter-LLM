type UUID = string;

interface Profile {
  id: UUID;
  first_name: string;
  last_name: string;
  created_at: string;
  profile_completed: boolean;
}

export type { Profile };
