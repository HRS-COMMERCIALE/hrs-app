import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export interface ClientItem {
  id: number;
  businessId: number;
  codesPostauxId: number | null;
  name: string;
  type: string;
  address: string;
  governorate: string | null;
  city: string | null;
  category: string | null;
  registrationNumber: string | null;
  taxId: string | null;
  vat: string | null;
  email: string | null;
  phone1: string | null;
  phone2: string | null;
  phone3: string | null;
  faxNumber: string | null;
  startDate: string | null;
  endDate: string | null;
  Billing: string | null;
  Price: string | null;
  affiliation: string | null;
  ExemptionNumber: string | null;
  codesPostaux?: {
    id: number;
    code: string;
    city: string;
    governorate: string;
    location: string;
  };
}

export interface CreateClientData {
  name: string;
  type: string;
  address: string;
  governorate?: string | null;
  city?: string | null;
  category?: string | null;
  registrationNumber?: string | null;
  taxId?: string | null;
  vat?: string | null;
  email?: string | null;
  phone1?: string | null;
  phone2?: string | null;
  phone3?: string | null;
  faxNumber?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  Billing?: string | null;
  Price?: string | null;
  affiliation?: string | null;
  ExemptionNumber?: string | null;
  codesPostauxId?: number;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  id: number;
}

export interface GetClientsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  category?: string;
  governorate?: string;
}

export interface ClientsResponse {
  data: ClientItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const fetchClients = async (params: GetClientsParams & { businessId?: number } = {}): Promise<ClientsResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.type) searchParams.set('type', params.type);
  if (params.category) searchParams.set('category', params.category);
  if (params.governorate) searchParams.set('governorate', params.governorate);
  if (params.businessId) searchParams.set('businessId', params.businessId.toString());

  const response = await fetch(`/api/dashboard/crm/Clients/getAll?${searchParams.toString()}`, {
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

const fetchClient = async (id: number, businessId: number): Promise<ClientItem> => {
  const response = await fetch(`/api/dashboard/crm/Clients/getOne?id=${id}&businessId=${businessId}`, {
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

const createClient = async (data: CreateClientData & { businessId: number }): Promise<void> => {
  const response = await fetch(`/api/dashboard/crm/Clients/create?businessId=${data.businessId}`, {
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

const updateClient = async (data: UpdateClientData & { businessId: number }): Promise<ClientItem> => {
  const response = await fetch(`/api/dashboard/crm/Clients/update?businessId=${data.businessId}`, {
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

const deleteClient = async (id: number, businessId: number): Promise<void> => {
  const response = await fetch(`/api/dashboard/crm/Clients/delete?id=${id}&businessId=${businessId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
};

export const useClients = (params?: GetClientsParams) => {
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  return useQuery({
    queryKey: ['clients', { ...params, businessId }],
    queryFn: () => fetchClients({ ...params, businessId }),
  });
};

export const useClient = (id: number) => {
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  return useQuery({
    queryKey: ['client', id, businessId],
    queryFn: () => {
      if (!businessId) throw new Error('Missing businessId');
      return fetchClient(id, businessId);
    },
    enabled: !!id && !!businessId,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  return useMutation({
    mutationFn: (payload: CreateClientData) => {
      if (!businessId) throw new Error('Missing businessId');
      return createClient({ ...payload, businessId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  return useMutation({
    mutationFn: (payload: UpdateClientData) => {
      if (!businessId) throw new Error('Missing businessId');
      return updateClient({ ...payload, businessId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', data.id] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  return useMutation({
    mutationFn: (id: number) => {
      if (!businessId) throw new Error('Missing businessId');
      return deleteClient(id, businessId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};


