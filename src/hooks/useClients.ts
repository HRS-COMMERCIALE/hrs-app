import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

const fetchClients = async (params: GetClientsParams = {}): Promise<ClientsResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.type) searchParams.set('type', params.type);
  if (params.category) searchParams.set('category', params.category);
  if (params.governorate) searchParams.set('governorate', params.governorate);

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

const fetchClient = async (id: number): Promise<ClientItem> => {
  const response = await fetch(`/api/dashboard/crm/Clients/getOne?id=${id}`, {
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

const createClient = async (data: CreateClientData): Promise<void> => {
  const response = await fetch('/api/dashboard/crm/Clients/create', {
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

const updateClient = async (data: UpdateClientData): Promise<ClientItem> => {
  const response = await fetch('/api/dashboard/crm/Clients/update', {
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

const deleteClient = async (id: number): Promise<void> => {
  const response = await fetch(`/api/dashboard/crm/Clients/delete?id=${id}`, {
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
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => fetchClients(params),
  });
};

export const useClient = (id: number) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => fetchClient(id),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateClient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', data.id] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};


