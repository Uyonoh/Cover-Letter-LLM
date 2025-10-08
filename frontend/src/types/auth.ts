type UUID = string;

interface User {
  id: UUID;
  email: string;
  password: string;
}

export type { User };
