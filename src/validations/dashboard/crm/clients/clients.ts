import { z } from 'zod';

// Tunisian Governorates
const tunisianGovernorates = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba',
  'Kairouan', 'Kasserine', 'Kébili', 'Kef', 'Mahdia', 'Manouba', 'Médenine',
  'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
  'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
] as const;

// Client Types
const clientTypes = ['Central', 'Branch'] as const;

// Client Categories
const clientCategories = ['State', 'Private'] as const;

// Billing Types
const billingTypes = ['Contract', 'Special', 'Normal'] as const;

// Price Types
const priceTypes = ['Daily', 'Monthly', 'Yearly'] as const;

export const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).trim(),
  type: z.enum(clientTypes, { required_error: 'Type is required' }),
  address: z.string().min(1, 'Address is required').max(255).trim(),
  governorate: z.enum(tunisianGovernorates).nullable().optional(),
  city: z.string().max(255).nullable().optional(),
  category: z.enum(clientCategories).nullable().optional(),
  registrationNumber: z.string().max(255).nullable().optional(),
  taxId: z.string().max(255).nullable().optional(),
  vat: z.string().max(255).nullable().optional(),
  email: z.string().email('Invalid email address').max(255).nullable().optional(),
  phone1: z.string().max(30).nullable().optional(),
  phone2: z.string().max(30).nullable().optional(),
  phone3: z.string().max(30).nullable().optional(),
  faxNumber: z.string().max(50).nullable().optional(),
  startDate: z.coerce.date().nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
  Billing: z.enum(billingTypes).nullable().optional(),
  Price: z.enum(priceTypes).nullable().optional(),
  affiliation: z.string().max(255).nullable().optional(),
  ExemptionNumber: z.string().max(255).nullable().optional(),
  codesPostauxId: z.number().int().positive().optional(),
});

export const updateClientSchema = createClientSchema.partial().extend({
  id: z.number().int().positive('Valid client ID is required'),
});

export const getClientSchema = z.object({
  id: z.number().int().positive('Valid client ID is required'),
});

export const deleteClientSchema = z.object({
  id: z.number().int().positive('Valid client ID is required'),
});

export const getClientsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  type: z.enum(clientTypes).optional(),
  category: z.enum(clientCategories).optional(),
  governorate: z.enum(tunisianGovernorates).optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type GetClientInput = z.infer<typeof getClientSchema>;
export type DeleteClientInput = z.infer<typeof deleteClientSchema>;
export type GetClientsQueryInput = z.infer<typeof getClientsQuerySchema>;

