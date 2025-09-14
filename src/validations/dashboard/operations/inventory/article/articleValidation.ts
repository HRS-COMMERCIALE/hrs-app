import { z } from 'zod';

// Article Types
const articleTypes = ['product', 'service'] as const;

// Article Nature
const articleNature = ['local', 'importe'] as const;

// Article Status
const articleStatus = ['actif', 'inactif'] as const;

export const createArticleSchema = z.object({
  article: z.string().min(1, 'Article name is required').max(255).trim(),
  familyId: z.number().int().positive('Family ID must be a positive integer').optional(),
  codeBarre: z.number().int().positive('Code Barre must be a positive integer').optional(),
  marque: z.string().max(255).optional(),
  supplierId: z.number().int().positive('Supplier ID must be a positive integer').optional(),
  fournisseur: z.string().max(255).optional(),
  typeArticle: z.enum(articleTypes).optional(),
  majStock: z.boolean().optional(),
  maintenance: z.boolean().optional(),
  garantie: z.number().int().min(0).optional(),
  garantieUnite: z.string().optional(),
  natureArticle: z.enum(articleNature).optional(),
  descriptifTechnique: z.string().optional(),
  ArticleStatus: z.boolean().optional(),
  Sale: z.boolean().optional(),
  Invoice: z.boolean().optional(),
  Serializable: z.boolean().optional(),
  qteDepart: z.number().int().min(0).optional(),
  qteEnStock: z.number().int().min(0).optional(),
  qteMin: z.number().int().min(0).optional(),
  qteMax: z.number().int().min(0).optional(),
  prixMP: z.number().min(0).optional(),
  prixAchatHT: z.number().min(0).optional(),
  fraisAchat: z.number().min(0).optional(),
  prixAchatBrut: z.number().min(0).optional(),
  pourcentageFODEC: z.number().min(0).max(100).optional(),
  FODEC: z.number().min(0).optional(),
  pourcentageTVA: z.number().min(0).max(100).optional(),
  TVASurAchat: z.number().min(0).optional(),
  prixAchatTTC: z.number().min(0).optional(),
  prixVenteBrut: z.number().min(0).optional(),
  pourcentageMargeBeneficiaire: z.number().min(0).max(100).optional(),
  margeBeneficiaire: z.number().min(0).optional(),
  prixVenteHT: z.number().min(0).optional(),
  pourcentageMaxRemise: z.number().min(0).max(100).optional(),
  remise: z.number().min(0).optional(),
  TVASurVente: z.number().min(0).optional(),
  prixVenteTTC: z.number().min(0).optional(),
  margeNet: z.number().min(0).optional(),
  TVAAPayer: z.number().min(0).optional(),
  image: z.any().optional(), // File object for image upload
});

export const updateArticleSchema = createArticleSchema.partial().extend({
  id: z.number().int().positive('Article ID must be a positive integer'),
});

export const getArticleSchema = z.object({
  id: z.number().int().positive('Article ID must be a positive integer'),
});

export const getArticlesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  typeArticle: z.enum(articleTypes).optional(),
  natureArticle: z.enum(articleNature).optional(),
  familyId: z.coerce.number().int().positive().optional(),
  supplierId: z.coerce.number().int().positive().optional(),
});

export const deleteArticleSchema = z.object({
  id: z.number().int().positive('Article ID must be a positive integer'),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type GetArticleInput = z.infer<typeof getArticleSchema>;
export type GetArticlesQueryInput = z.infer<typeof getArticlesQuerySchema>;
export type DeleteArticleInput = z.infer<typeof deleteArticleSchema>;
