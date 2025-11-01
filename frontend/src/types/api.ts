interface APIError extends Error {
  code?: string;
  details?: string;
}

export type { APIError };