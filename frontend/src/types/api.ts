export interface ErrorResponse {
  message: string; // e.g. "Password is required"
  path: string; // e.g. "/paste/a9b86721-3ab2-41d0-80de-36930c6450d4"
  statusCode: number; // e.g. 401
  success: false; // always false for errors
  timestamp: string; // ISO datetime string
}
