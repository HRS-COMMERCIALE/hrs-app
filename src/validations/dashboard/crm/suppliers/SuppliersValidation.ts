import { z } from 'zod';

export const createSupplierSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  type: z.string().min(1, 'Type is required').max(255).trim(),
  taxId: z.string().min(1, 'Tax ID is required').max(255).trim(),
  registrationNumber: z
    .string()
    .min(1, 'Registration number is required')
    .max(255)
    .trim(),
  email: z.string().email('Invalid email address').max(255),
  address: z.string().min(1, 'Address is required').max(255).trim(),
  phone1: z.string().max(30).nullable(),
  phone2: z.string().max(30).nullable().optional(),
  phone3: z.string().max(30).nullable().optional(),
  codesPostauxId: z.number().int().positive().optional(),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;

export const updateSupplierSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255).trim().optional(),
  type: z.string().min(1).max(255).trim().optional(),
  taxId: z.string().min(1).max(255).trim().optional(),
  registrationNumber: z.string().min(1).max(255).trim().optional(),
  email: z.string().email().max(255).optional(),
  address: z.string().min(1).max(255).trim().optional(),
  phone1: z.string().max(30).nullable().optional(),
  phone2: z.string().max(30).nullable().optional(),
  phone3: z.string().max(30).nullable().optional(),
  codesPostauxId: z.number().int().positive().optional(),
});

export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;

export const deleteSupplierSchema = z.object({
  id: z.number().int().positive(),
});

export type DeleteSupplierInput = z.infer<typeof deleteSupplierSchema>;


