import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

const fetchFamilies = async (params: GetFamiliesParams = {}): Promise<FamilyItem[]> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);

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

const createFamily = async (data: CreateFamilyData): Promise<FamilyItem> => {
  const response = await fetch('/api/dashboard/operations/inventory/family/add', {
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

const updateFamily = async (data: UpdateFamilyData): Promise<FamilyItem> => {
  const response = await fetch('/api/dashboard/operations/inventory/family/update', {
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

const deleteFamily = async (id: number): Promise<void> => {
  const response = await fetch(`/api/dashboard/operations/inventory/family/delete?id=${id}`, {
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
  return useQuery({
    queryKey: ['families', params],
    queryFn: () => fetchFamilies(params),
  });
};

export const useCreateFamily = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFamily,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
    },
  });
};

export const useUpdateFamily = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFamily,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
    },
  });
};

export const useDeleteFamily = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFamily,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
    },
  });
};
