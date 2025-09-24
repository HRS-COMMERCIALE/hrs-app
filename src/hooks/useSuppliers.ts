import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export interface Supplier {
  id: number;
  businessId: number;
  codesPostauxId: number | null;
  name: string;
  type: string;
  taxId: string;
  registrationNumber: string;
  email: string;
  address: string;
  phone1: string | null;
  phone2: string | null;
  phone3: string | null;
}

export interface CreateSupplierData {
  name: string;
  type: string;
  taxId: string;
  registrationNumber: string;
  email: string;
  address: string;
  phone1?: string | null;
  phone2?: string | null;
  phone3?: string | null;
  codesPostauxId?: number;
}

export interface UpdateSupplierData extends Partial<CreateSupplierData> {
  id: number;
  codesPostauxId?: number;
}

// API functions
const fetchSuppliers = async (businessId?: number): Promise<Supplier[]> => {
  const searchParams = new URLSearchParams();
  if (businessId) searchParams.set('businessId', String(businessId));
  
  const response = await fetch(`/api/dashboard/crm/suppliers/getAll?${searchParams.toString()}`, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${response.status})`);
  }

  const body = await response.json();
  return body?.data || [];
};

const createSupplier = async (data: CreateSupplierData & { businessId: number }): Promise<void> => {
  const response = await fetch(`/api/dashboard/crm/suppliers/create?businessId=${data.businessId}`, {
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

const updateSupplier = async (data: UpdateSupplierData & { businessId: number }): Promise<void> => {
  const response = await fetch(`/api/dashboard/crm/suppliers/update?businessId=${data.businessId}`, {
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

const deleteSupplier = async (id: number, businessId: number): Promise<void> => {
  const response = await fetch(`/api/dashboard/crm/suppliers/delete?businessId=${businessId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
};

// Hooks
export const useSuppliers = () => {
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  
  return useQuery({
    queryKey: ['suppliers', { businessId }],
    queryFn: () => fetchSuppliers(businessId),
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  
  return useMutation({
    mutationFn: (payload: CreateSupplierData) => {
      if (!businessId) throw new Error('Missing businessId');
      return createSupplier({ ...payload, businessId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  
  return useMutation({
    mutationFn: (payload: UpdateSupplierData) => {
      if (!businessId) throw new Error('Missing businessId');
      return updateSupplier({ ...payload, businessId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : undefined;
  
  return useMutation({
    mutationFn: (id: number) => {
      if (!businessId) throw new Error('Missing businessId');
      return deleteSupplier(id, businessId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};


