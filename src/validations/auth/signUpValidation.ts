import { z } from 'zod';

export const signUpValidationSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  title: z.string().min(1, 'Title is required'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email format').max(100, 'Email must be less than 100 characters'),
  mobile: z.string().min(8, 'Mobile number must be at least 8 digits').max(15, 'Mobile number must be less than 15 digits').refine((val) => /^\d+$/.test(val), {
    message: 'Mobile number must contain only digits'
  }),
  landline: z.string().optional().refine((val) => !val || /^\d+$/.test(val), {
    message: 'Landline must be a number'
  }),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password must be less than 100 characters'),
});

export type SignUpValidationData = z.infer<typeof signUpValidationSchema>;
