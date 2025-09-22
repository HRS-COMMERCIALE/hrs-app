import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export interface ArticleItem {
  id: number;
  businessId: number;
  article: string;
  familyId: number | null;
  codeBarre: string | null;
  marque: string | null;
  supplierId: number | null;
  fournisseur: string | null;
  typeArticle: 'product' | 'service' | null;
  majStock: boolean | null;
  maintenance: boolean | null;
  garantie: number | null;
  garantieUnite: string | null;
  natureArticle: 'local' | 'importe' | null;
  descriptifTechnique: string | null;
  ArticleStatus: boolean | null;
  Sale: boolean | null;
  Invoice: boolean | null;
  Serializable: boolean | null;
  qteDepart: number | null;
  qteEnStock: number | null;
  qteMin: number | null;
  qteMax: number | null;
  prixMP: number | null;
  imageUrl: string | null;
  prixAchatHT: number | null;
  fraisAchat: number | null;
  prixAchatBrut: number | null;
  pourcentageFODEC: number | null;
  FODEC: number | null;
  pourcentageTVA: number | null;
  TVASurAchat: number | null;
  prixAchatTTC: number | null;
  prixVenteBrut: number | null;
  pourcentageMargeBeneficiaire: number | null;
  margeBeneficiaire: number | null;
  prixVenteHT: number | null;
  pourcentageMaxRemise: number | null;
  remise: number | null;
  TVASurVente: number | null;
  prixVenteTTC: number | null;
  margeNet: number | null;
  TVAAPayer: number | null;
  family?: {
    id: number;
    name: string;
  };
  supplier?: {
    id: number;
    name: string;
  };
}

export interface CreateArticleData {
  article: string;
  familyId?: number | null;
  codeBarre?: string | null;
  marque?: string | null;
  supplierId?: number | null;
  fournisseur?: string | null;
  typeArticle?: 'product' | 'service' | null;
  majStock?: boolean | null;
  maintenance?: boolean | null;
  garantie?: number | null;
  garantieUnite?: string | null;
  natureArticle?: 'local' | 'importe' | null;
  descriptifTechnique?: string | null;
  ArticleStatus?: boolean | null;
  Sale?: boolean | null;
  Invoice?: boolean | null;
  Serializable?: boolean | null;
  qteDepart?: number | null;
  qteEnStock?: number | null;
  qteMin?: number | null;
  qteMax?: number | null;
  prixMP?: number | null;
  image?: File | null;
  prixAchatHT?: number | null;
  fraisAchat?: number | null;
  prixAchatBrut?: number | null;
  pourcentageFODEC?: number | null;
  FODEC?: number | null;
  pourcentageTVA?: number | null;
  TVASurAchat?: number | null;
  prixAchatTTC?: number | null;
  prixVenteBrut?: number | null;
  pourcentageMargeBeneficiaire?: number | null;
  margeBeneficiaire?: number | null;
  prixVenteHT?: number | null;
  pourcentageMaxRemise?: number | null;
  remise?: number | null;
  TVASurVente?: number | null;
  prixVenteTTC?: number | null;
  margeNet?: number | null;
  TVAAPayer?: number | null;
}

export interface UpdateArticleData extends Partial<CreateArticleData> {
  id: number;
}

export interface GetArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  typeArticle?: 'product' | 'service';
  natureArticle?: 'local' | 'importe';
  familyId?: number;
  supplierId?: number;
}

export interface ArticlesResponse {
  data: ArticleItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const fetchArticles = async (params: GetArticlesParams & { businessId?: number } = {}): Promise<ArticlesResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.typeArticle) searchParams.set('typeArticle', params.typeArticle);
  if (params.natureArticle) searchParams.set('natureArticle', params.natureArticle);
  if (params.familyId) searchParams.set('familyId', params.familyId.toString());
  if (params.supplierId) searchParams.set('supplierId', params.supplierId.toString());
  if (params.businessId) searchParams.set('businessId', params.businessId.toString());

  const response = await fetch(`/api/dashboard/operations/inventory/article/getAll?${searchParams.toString()}`, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
  return await response.json();
};

const createArticle = async (data: CreateArticleData & { businessId: number }): Promise<ArticleItem> => {
  const formData = new FormData();
  
  // Add all fields to FormData
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'image' && value instanceof File) {
      formData.append('image', value);
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  const response = await fetch('/api/dashboard/operations/inventory/article/add', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    
    // Handle validation errors with detailed messages
    if (body.details && Array.isArray(body.details)) {
      const validationErrors = body.details.map((err: any) => `${err.field}: ${err.message}`).join(', ');
      throw new Error(`Validation failed: ${validationErrors}`);
    }
    
    // Handle other errors
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
  
  const body = await response.json();
  return body.data;
};

const updateArticle = async (data: UpdateArticleData & { businessId: number }): Promise<ArticleItem> => {
  const formData = new FormData();
  
  // Add all fields to FormData
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'image' && value instanceof File) {
      formData.append('image', value);
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  const response = await fetch('/api/dashboard/operations/inventory/article/update', {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });
  
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    
    // Handle validation errors with detailed messages
    if (body.details && Array.isArray(body.details)) {
      const validationErrors = body.details.map((err: any) => `${err.field}: ${err.message}`).join(', ');
      throw new Error(`Validation failed: ${validationErrors}`);
    }
    
    // Handle other errors
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
  
  const body = await response.json();
  return body.data;
};

const deleteArticle = async (id: number, businessId: number): Promise<void> => {
  const response = await fetch(`/api/dashboard/operations/inventory/article/delete?id=${id}&businessId=${businessId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
};

export const useArticles = (params?: GetArticlesParams) => {
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  return useQuery({
    queryKey: ['articles', { ...params, businessId }],
    queryFn: () => fetchArticles({ ...params, businessId }),
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  return useMutation({
    mutationFn: (payload: CreateArticleData) => {
      if (!businessId) throw new Error('Missing businessId');
      return createArticle({ ...payload, businessId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  return useMutation({
    mutationFn: (payload: UpdateArticleData) => {
      if (!businessId) throw new Error('Missing businessId');
      return updateArticle({ ...payload, businessId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  return useMutation({
    mutationFn: (id: number) => {
      if (!businessId) throw new Error('Missing businessId');
      return deleteArticle(id, businessId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};
