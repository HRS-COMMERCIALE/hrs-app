import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export interface FamilyItem {
  id: number;
  businessId: number;
  name: string;
}

export interface CreateFamilyData {
  name: string;
}

export interface UpdateFamilyData extends Partial<CreateFamilyData> {
  id: number;
}

export interface GetFamiliesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface FamiliesResponse {
  data: FamilyItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const fetchFamilies = async (params: GetFamiliesParams & { businessId?: number } = {}): Promise<FamilyItem[]> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.businessId) searchParams.set('businessId', params.businessId.toString());

  const response = await fetch(`/api/dashboard/operations/inventory/family/getAll?${searchParams.toString()}`, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
  const body = await response.json();
  return body.data;
};

const createFamily = async (data: CreateFamilyData & { businessId: number }): Promise<FamilyItem> => {
  const response = await fetch(`/api/dashboard/operations/inventory/family/add?businessId=${data.businessId}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
  const body = await response.json();
  return body.data;
};

const updateFamily = async (data: UpdateFamilyData & { businessId: number }): Promise<FamilyItem> => {
  const response = await fetch(`/api/dashboard/operations/inventory/family/update?businessId=${data.businessId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
  const body = await response.json();
  return body.data;
};

const deleteFamily = async (id: number, businessId: number): Promise<void> => {
  const response = await fetch(`/api/dashboard/operations/inventory/family/delete?id=${id}&businessId=${businessId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
};

export const useFamilies = (params?: GetFamiliesParams) => {
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  return useQuery({
    queryKey: ['families', { ...params, businessId }],
    queryFn: () => fetchFamilies({ ...params, businessId }),
  });
};

export const useCreateFamily = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  return useMutation({
    mutationFn: (payload: CreateFamilyData) => {
      if (!businessId) throw new Error('Missing businessId');
      return createFamily({ ...payload, businessId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
    },
  });
};

export const useUpdateFamily = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  return useMutation({
    mutationFn: (payload: UpdateFamilyData) => {
      if (!businessId) throw new Error('Missing businessId');
      return updateFamily({ ...payload, businessId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
    },
  });
};

export const useDeleteFamily = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  return useMutation({
    mutationFn: (id: number) => {
      if (!businessId) throw new Error('Missing businessId');
      return deleteFamily(id, businessId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
    },
  });
};
