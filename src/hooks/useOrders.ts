import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type OrderItem = {
  id: number;
  businessId: number;
  articleId: number;
  qte: number;
  pourcentageRemise?: number | null;
  remise?: number | null;
  prixVHT: number;
  pourcentageFodec?: number | null;
  fodec?: number | null;
  pourcentageTVA?: number | null;
  tva?: number | null;
  ttc: number;
  type: 'order' | 'delivery' | 'invoice' | 'returns';
  article?: {
    id: number;
    article: string;
    marque?: string | null;
    prixVenteTTC?: number | null;
    qteEnStock?: number | null;
  };
};

export type OrdersPagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type GetOrdersParams = {
  page?: number;
  limit?: number;
  search?: string;
  articleId?: number;
};

export type CreateOrderData = {
  articleId: number;
  qte: number;
  prixVHT: number;
  pourcentageRemise?: number;
  remise?: number;
  pourcentageFodec?: number;
  fodec?: number;
  pourcentageTVA?: number;
  tva?: number;
  ttc: number;
  type: 'order' | 'delivery' | 'invoice' | 'returns';
};

export type UpdateOrderData = Partial<CreateOrderData> & { id: number };

async function fetchOrders(params: GetOrdersParams) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.articleId) searchParams.set('articleId', String(params.articleId));

  const res = await fetch(`/api/dashboard/operations/sales/orders/getAll?${searchParams.toString()}`,
    { credentials: 'include' }
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Failed to fetch orders (${res.status})`);
  }
  return res.json() as Promise<{ success: boolean; data: OrderItem[]; pagination: OrdersPagination }>;
}

export function useOrders(params: GetOrdersParams) {
  const { page = 1, limit = 10, search, articleId } = params;
  return useQuery({
    queryKey: ['orders', { page, limit, search: search || '', articleId: articleId || null }],
    queryFn: () => fetchOrders({ page, limit, search, articleId }),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });
}

async function postCreateOrder(data: CreateOrderData) {
  const res = await fetch('/api/dashboard/operations/sales/orders/create', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Failed to create order (${res.status})`);
  }
  return res.json();
}

async function putUpdateOrder(data: UpdateOrderData) {
  const res = await fetch('/api/dashboard/operations/sales/orders/update', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Failed to update order (${res.status})`);
  }
  return res.json();
}

async function deleteOrderById(id: number) {
  const res = await fetch('/api/dashboard/operations/sales/orders/delete', {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Failed to delete order (${res.status})`);
  }
  return res.json();
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCreateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putUpdateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrderById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}


