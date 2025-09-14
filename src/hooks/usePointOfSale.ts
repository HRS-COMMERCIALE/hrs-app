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
}

interface UpdatePointOfSaleData {
  id: number;
  pointOfSale?: string;
  location?: string;
}

// Fetch all points of sale
export function usePointOfSale() {
  return useQuery<PointOfSale[]>({
    queryKey: ['pointsOfSale'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/settings/PointOfSale/getAll');
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pointsOfSale'] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pointsOfSale'] });
    },
  });
}

// Delete points of sale
export function useDeletePointOfSale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await fetch('/api/dashboard/settings/PointOfSale/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete points of sale');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pointsOfSale'] });
    },
  });
}
