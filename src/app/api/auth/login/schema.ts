import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().nonempty().email().toLowerCase(),
  password: z.string().nonempty(),
});
export const loginResponseSchema = z.object({
  username: z.string(),
  email: z.string(),
  role: z.string(),
});
export type LoginRequest = z.infer<typeof loginSchema>;
