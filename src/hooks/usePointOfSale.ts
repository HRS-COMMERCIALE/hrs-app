import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface PointOfSale {
  id: number;
  pointOfSale: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

interface CreatePointOfSaleData {
  pointOfSale: string;
  location: string;
  businessId: number;
}

interface UpdatePointOfSaleData {
  id: number;
  pointOfSale?: string;
  location?: string;
  businessId: number;
}

// Fetch all points of sale
export function usePointOfSale(businessId: number | null) {
  return useQuery<PointOfSale[]>({
    queryKey: ['pointsOfSale', businessId],
    enabled: typeof businessId === 'number' && !Number.isNaN(businessId),
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/settings/PointOfSale/getAll?businessId=${businessId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch points of sale');
      }
      const result = await response.json();
      return result.data;
    },
  });
}

// Create point of sale
export function useCreatePointOfSale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreatePointOfSaleData) => {
      const response = await fetch('/api/dashboard/settings/PointOfSale/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create point of sale');
      }
      
      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pointsOfSale', variables.businessId] });
    },
  });
}

// Update point of sale
export function useUpdatePointOfSale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdatePointOfSaleData) => {
      const response = await fetch('/api/dashboard/settings/PointOfSale/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update point of sale');
      }
      
      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pointsOfSale', variables.businessId] });
    },
  });
}

// Delete points of sale
export function useDeletePointOfSale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: { ids: number[]; businessId: number }) => {
      const response = await fetch('/api/dashboard/settings/PointOfSale/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete points of sale');
      }
      
      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pointsOfSale', variables.businessId] });
    },
  });
}
