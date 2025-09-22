import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface PostalCode {
  id: number;
  governorate: string;
  code: string;
  city: string;
  location: string;
}

interface CreatePostalCodeData {
  governorate: string;
  code: string;
  city: string;
  location: string;
  businessId: number;
}

interface UpdatePostalCodeData {
  id: number;
  governorate: string;
  code: string;
  city: string;
  location: string;
  businessId: number;
}

// API functions
const fetchPostalCodes = async (businessId: number): Promise<PostalCode[]> => {
  const response = await fetch(`/api/dashboard/settings/codesPostaux/getAll?businessId=${businessId}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${response.status})`);
  }

  const body = await response.json();
  return body?.data || [];
};

const createPostalCode = async (data: CreatePostalCodeData): Promise<void> => {
  const response = await fetch('/api/dashboard/settings/codesPostaux/create', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
};

const updatePostalCode = async (data: UpdatePostalCodeData): Promise<void> => {
  const response = await fetch('/api/dashboard/settings/codesPostaux/update', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
};

const deletePostalCodes = async (ids: number[]): Promise<void> => {
  const response = await fetch('/api/dashboard/settings/codesPostaux/delete', {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
};

// Custom hooks
export const usePostalCodes = (businessId: number | null) => {
  return useQuery({
    queryKey: ['postalCodes', businessId],
    enabled: typeof businessId === 'number' && !Number.isNaN(businessId),
    queryFn: () => fetchPostalCodes(businessId as number),
  });
};

export const useCreatePostalCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostalCode,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['postalCodes', variables.businessId] });
    },
  });
};

export const useUpdatePostalCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePostalCode,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['postalCodes', variables.businessId] });
    },
  });
};

export const useDeletePostalCodes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { ids: number[]; businessId: number }) => deletePostalCodesWithBusiness(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['postalCodes', variables.businessId] });
    },
  });
};

const deletePostalCodesWithBusiness = async (input: { ids: number[]; businessId: number }): Promise<void> => {
  const response = await fetch('/api/dashboard/settings/codesPostaux/delete', {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
};
