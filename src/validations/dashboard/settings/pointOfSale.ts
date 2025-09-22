import { z } from 'zod';

export const createPointOfSaleSchema = z.object({
  pointOfSale: z.string()
    .min(1, 'Point of sale name is required')
    .max(255, 'Point of sale name must be less than 255 characters')
    .trim()
    .refine((val) => val.length > 0, 'Point of sale name cannot be empty'),
  location: z.string()
    .min(1, 'Location is required')
    .max(255, 'Location must be less than 255 characters')
    .trim()
    .refine((val) => val.length > 0, 'Location cannot be empty'),
  businessId: z.number().int().positive('Business ID must be a positive integer'),
});

export const updatePointOfSaleSchema = z.object({
  id: z.number().int().positive('ID must be a positive integer'),
  businessId: z.number().int().positive('Business ID must be a positive integer'),
  pointOfSale: z.string()
    .min(1, 'Point of sale name is required')
    .max(255, 'Point of sale name must be less than 255 characters')
    .trim()
    .refine((val) => val.length > 0, 'Point of sale name cannot be empty')
    .optional(),
  location: z.string()
    .min(1, 'Location is required')
    .max(255, 'Location must be less than 255 characters')
    .trim()
    .refine((val) => val.length > 0, 'Location cannot be empty')
    .optional(),
}).refine((data) => data.pointOfSale !== undefined || data.location !== undefined, {
  message: 'At least one field (pointOfSale or location) must be provided for update'
});

export const deletePointOfSaleSchema = z.object({
  ids: z.array(z.number().int().positive('ID must be a positive integer'))
    .min(1, 'At least one ID must be provided')
    .max(100, 'Cannot delete more than 100 items at once'),
  businessId: z.number().int().positive('Business ID must be a positive integer'),
});

export type CreatePointOfSaleInput = z.infer<typeof createPointOfSaleSchema>;
export type UpdatePointOfSaleInput = z.infer<typeof updatePointOfSaleSchema>;
export type DeletePointOfSaleInput = z.infer<typeof deletePointOfSaleSchema>;
