import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
  codesPostauxId?: number | null;
}

// API functions
const fetchSuppliers = async (): Promise<Supplier[]> => {
  const response = await fetch('/api/dashboard/crm/suppliers/getAll', {
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

const createSupplier = async (data: CreateSupplierData): Promise<void> => {
  const response = await fetch('/api/dashboard/crm/suppliers/create', {
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

const updateSupplier = async (data: UpdateSupplierData): Promise<void> => {
  const response = await fetch('/api/dashboard/crm/suppliers/update', {
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

const deleteSupplier = async (id: number): Promise<void> => {
  const response = await fetch('/api/dashboard/crm/suppliers/delete', {
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
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};


