import type { z } from "zod";

export type ServerActionResponse<T = unknown> =
  | { error: string; message?: never; data?: never; issues?: z.ZodIssue[] }
  | { error?: never; message: string; data?: T; issues?: z.ZodIssue[] }
  | { error?: never; message?: never; data: T; issues?: z.ZodIssue[] };
