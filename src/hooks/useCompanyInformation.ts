import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface CompanyInformation {
  businessName: string;
  registrationNumber: string;
  taxId: string;
  cnssCode: string;
  website: string;
  currency: string;
  size: string;
  industry: string;
  logoFile: string;
}

interface UpdateCompanyInfoData {
  businessName: string;
  registrationNumber?: string;
  taxId?: string;
  cnssCode?: string;
  website?: string;
  currency: string;
  size: string;
  industry: string;
  logo?: File;
  businessId: number;
}

// API functions
const fetchCompanyInformation = async (businessId: number): Promise<CompanyInformation> => {
  const response = await fetch(`/api/dashboard/settings/CompanyInformation/getInformation?businessId=${businessId}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${response.status})`);
  }

  const body = await response.json();
  const data = body?.data || {};
  
  return {
    businessName: data.businessName ?? '',
    registrationNumber: data.registrationNumber ?? '',
    taxId: data.taxId ?? '',
    cnssCode: data.cnssCode ?? '',
    website: data.website ?? '',
    currency: data.currency ?? '',
    size: data.size ?? '',
    industry: data.industry ?? '',
    logoFile: data.logoFile ?? '',
  };
};

const updateCompanyInformation = async (data: UpdateCompanyInfoData): Promise<void> => {
  let response: Response;
  
  if (data.logo) {
    // Upload with logo file
    const formData = new FormData();
    formData.append('businessName', data.businessName.trim());
    formData.append('registrationNumber', data.registrationNumber?.trim() || '');
    formData.append('taxId', data.taxId?.trim() || '');
    formData.append('cnssCode', data.cnssCode?.trim() || '');
    formData.append('website', data.website?.trim() || '');
    formData.append('currency', data.currency.trim());
    formData.append('size', data.size.trim());
    formData.append('industry', data.industry.trim());
    formData.append('logo', data.logo);
    formData.append('businessId', String(data.businessId));
    
    response = await fetch('/api/dashboard/settings/CompanyInformation/updateCompanyInfo', {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });
  } else {
    // Update without logo
    response = await fetch('/api/dashboard/settings/CompanyInformation/updateCompanyInfo', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        businessName: data.businessName.trim(),
        registrationNumber: data.registrationNumber?.trim() || '',
        taxId: data.taxId?.trim() || '',
        cnssCode: data.cnssCode?.trim() || '',
        website: data.website?.trim() || '',
        currency: data.currency.trim(),
        size: data.size.trim(),
        industry: data.industry.trim(),
        businessId: data.businessId,
      }),
    });
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || 'Failed to update company information');
  }
};

// Custom hooks
export const useCompanyInformation = (businessId: number | null) => {
  return useQuery({
    queryKey: ['companyInformation', businessId],
    queryFn: () => fetchCompanyInformation(businessId as number),
    enabled: typeof businessId === 'number' && !Number.isNaN(businessId),
    // Cache for 10 minutes since company info changes less frequently
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

export const useUpdateCompanyInformation = (businessId: number | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<UpdateCompanyInfoData, 'businessId'>) => {
      if (typeof businessId !== 'number' || Number.isNaN(businessId)) {
        return Promise.reject(new Error('No business selected'));
      }
      return updateCompanyInformation({ ...data, businessId });
    },
    onSuccess: () => {
      // Invalidate and refetch company information
      queryClient.invalidateQueries({ queryKey: ['companyInformation', businessId] });
    },
  });
};
