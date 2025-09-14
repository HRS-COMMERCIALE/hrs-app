import { z } from 'zod';

export const createOrderSchema = z.object({
  articleId: z.coerce.number().int().positive('Article ID must be a positive integer'),
  qte: z.coerce.number().int().positive('Quantity must be a positive integer'),
  pourcentageRemise: z.coerce.number().min(0).max(100).optional(),
  remise: z.coerce.number().min(0).optional(),
  prixVHT: z.coerce.number().positive('Price excluding tax must be positive'),
  pourcentageFodec: z.coerce.number().min(0).max(100).optional(),
  fodec: z.coerce.number().min(0).optional(),
  pourcentageTVA: z.coerce.number().min(0).max(100).optional(),
  tva: z.coerce.number().min(0).optional(),
  ttc: z.coerce.number().positive('Total including tax must be positive'),
  type: z.enum(['order', 'delivery', 'invoice', 'returns']).default('order'),
  transactionType: z.literal('SALE').default('SALE'),
});

export const updateOrderSchema = createOrderSchema.partial().extend({
  id: z.number().int().positive('Order ID must be a positive integer'),
  transactionType: z.literal('SALE').default('SALE'),
});

export const deleteOrderSchema = z.object({
  id: z.number().int().positive('Order ID must be a positive integer'),
});

export const getOrdersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  articleId: z.number().int().positive().optional(),
});

export type CreateOrderData = z.infer<typeof createOrderSchema>;
export type UpdateOrderData = z.infer<typeof updateOrderSchema>;
export type DeleteOrderData = z.infer<typeof deleteOrderSchema>;
export type GetOrdersData = z.infer<typeof getOrdersSchema>;
