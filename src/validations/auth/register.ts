import { z } from 'zod';

export const registerSchema = z.object({
  business: z.object({
    businessName: z.string().min(2, 'Company name must be at least 2 characters').max(100, 'Company name must not exceed 100 characters'),
    registrationNumber: z.string().max(100, 'Registration Number must not exceed 100 characters'),
    taxId: z.string().min(3, 'Tax ID must be at least 3 characters').max(50, 'Tax ID must not exceed 50 characters'),
    cnssCode: z.string().min(3, 'CNSS Code must be at least 3 characters').max(50, 'CNSS Code must not exceed 50 characters'),
    industry: z.string().min(2, 'Industry sector must be at least 2 characters').max(100, 'Industry sector must not exceed 100 characters'),
    size: z.string().min(2, 'Company size must be at least 2 characters').max(50, 'Company size must not exceed 50 characters'),
    currency: z.string().min(3, 'Currency must be at least 3 characters').max(10, 'Currency must not exceed 10 characters'),
    website: z.string().url().optional().or(z.literal('')),
    documentHeaderColor: z.string().optional(),
    tableHeaderBackgroundColor: z.string().optional(),
    tableHeaderTitleColor: z.string().optional(),
    referralCode: z.string().optional(),
    logoFile: z.any().optional()
  }),
  address: z.object({
    country: z.string().min(2, 'Country must be at least 2 characters').max(100, 'Country must not exceed 100 characters'),
    governorate: z.string().min(2, 'Governorate must be at least 2 characters').max(100, 'Governorate must not exceed 100 characters'),
    postalCode: z.string().min(3, 'Postal code must be at least 3 characters').max(20, 'Postal code must not exceed 20 characters'),
    address: z.string().min(4, 'Full address must be at least 10 characters').max(500, 'Full address must not exceed 500 characters'),
    phone: z.string().min(8, 'Telephone must be at least 10 digits').max(15, 'Telephone must not exceed 15 digits'),
    fax: z.string().optional()
  }),

})

;

export type RegisterSchema = z.infer<typeof registerSchema>;
