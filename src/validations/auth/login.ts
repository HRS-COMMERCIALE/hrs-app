import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'email is required').email('email must be a valid email'),
  password: z.string().min(1, 'password is required'),
  ip: z.string(),
  userAgent: z.string(),
});

export type LoginPayload = z.infer<typeof loginSchema>;

export function validateLogin(input: unknown): { errors: string[]; value?: LoginPayload } {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => issue.message);
    return { errors };
  }
  return { errors: [], value: parsed.data };
}


