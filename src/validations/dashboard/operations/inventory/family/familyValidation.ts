import { z } from 'zod';

export const createFamilySchema = z.object({
  name: z.string().min(1, 'Family name is required').max(255, 'Family name must not exceed 255 characters').trim(),
});

export const updateFamilySchema = createFamilySchema.partial().extend({
  id: z.number().int().positive('Family ID must be a positive integer'),
});

export const getFamilySchema = z.object({
  id: z.number().int().positive('Family ID must be a positive integer'),
});

export const getFamiliesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const deleteFamilySchema = z.object({
  id: z.number().int().positive('Family ID must be a positive integer'),
});

export type CreateFamilyInput = z.infer<typeof createFamilySchema>;
export type UpdateFamilyInput = z.infer<typeof updateFamilySchema>;
export type GetFamilyInput = z.infer<typeof getFamilySchema>;
export type GetFamiliesQueryInput = z.infer<typeof getFamiliesQuerySchema>;
export type DeleteFamilyInput = z.infer<typeof deleteFamilySchema>;
