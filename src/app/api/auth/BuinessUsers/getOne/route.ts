import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../_lib/auth';
import { User, Business, BuinessUsers, Address } from '../../../../../models/associationt.ts/association';
import { ApiResponseHandler } from '../../../../../utils/help/apiResponses';

// Force this route to be server-side only
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authPayload = await requireAuth(request);
    if (authPayload instanceof NextResponse) return authPayload;

    // Get businessId from query parameters
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return ApiResponseHandler.badRequest('Business ID is required', 'missing_business_id');
    }

    const businessIdNum = parseInt(businessId);
    if (isNaN(businessIdNum)) {
      return ApiResponseHandler.badRequest('Invalid business ID format', 'invalid_business_id');
    }

    // Get the specific business association for the user
    const businessAssociation = await BuinessUsers().findOne({
      where: { 
        userId: authPayload.userId,
        businessId: businessIdNum,
        status: 'active' // Only get active (non-banned) associations
      },
      include: [
        {
          model: Business(),
          as: 'business',
          attributes: [
            'id',
            'businessName',
            'logoFile',
            'currency',
            'industry',
            'size',
            'website',
            'registrationNumber',
            'taxId',
            'cnssCode',
            'createdAt'
          ],
          include: [
            {
              model: Address(),
              as: 'addresses',
              attributes: [
                'id',
                'country',
                'governorate',
                'postalCode',
                'address',
                'phone',
                'createdAt'
              ]
            }
          ]
        }
      ],
      attributes: [
        'id',
        'role',
        'isOnline',
        'joinedAt',
        'lastActiveAt'
      ]
    });

    if (!businessAssociation) {
      return ApiResponseHandler.error('Business not found or access denied', 'business_not_found', undefined, 404);
    }

    const business = businessAssociation.get('business') as any;
    const addresses = business?.addresses || [];

    // Transform the data
    const businessData = {
      associationId: businessAssociation.get('id'),
      role: businessAssociation.get('role'),
      isOnline: businessAssociation.get('isOnline'),
      joinedAt: businessAssociation.get('joinedAt'),
      lastActiveAt: businessAssociation.get('lastActiveAt'),
      business: business ? {
        id: business.id,
        businessName: business.businessName,
        logoFile: business.logoFile,
        currency: business.currency,
        industry: business.industry,
        size: business.size,
        website: business.website,
        registrationNumber: business.registrationNumber,
        taxId: business.taxId,
        cnssCode: business.cnssCode,
        createdAt: business.createdAt,
        addresses: addresses.map((addr: any) => ({
          id: addr.id,
          country: addr.country,
          governorate: addr.governorate,
          postalCode: addr.postalCode,
          address: addr.address,
          phone: addr.phone,
          createdAt: addr.createdAt
        }))
      } : null
    };

    return ApiResponseHandler.success(
      businessData,
      'Business details retrieved successfully'
    );

  } catch (error) {
    console.error('/api/auth/BuinessUsers/getOne error:', error);
    
    if (error instanceof Error) {
      return ApiResponseHandler.error(
        error.message,
        'business_fetch_error',
        undefined,
        500
      );
    }
    
    return ApiResponseHandler.internalError('Failed to fetch business details');
  }
}
