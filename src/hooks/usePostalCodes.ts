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
}

interface UpdatePostalCodeData {
  id: number;
  governorate: string;
  code: string;
  city: string;
  location: string;
}

// API functions
const fetchPostalCodes = async (): Promise<PostalCode[]> => {
  const response = await fetch('/api/dashboard/settings/codesPostaux/getAll', {
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
export const usePostalCodes = () => {
  return useQuery({
    queryKey: ['postalCodes'],
    queryFn: fetchPostalCodes,
  });
};

export const useCreatePostalCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostalCode,
    onSuccess: () => {
      // Invalidate and refetch postal codes
      queryClient.invalidateQueries({ queryKey: ['postalCodes'] });
    },
  });
};

export const useUpdatePostalCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePostalCode,
    onSuccess: () => {
      // Invalidate and refetch postal codes
      queryClient.invalidateQueries({ queryKey: ['postalCodes'] });
    },
  });
};

export const useDeletePostalCodes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePostalCodes,
    onSuccess: () => {
      // Invalidate and refetch postal codes
      queryClient.invalidateQueries({ queryKey: ['postalCodes'] });
    },
  });
};
