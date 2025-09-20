import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../_lib/auth';
import { User, Business, BuinessUsers } from '../../../../../models/associationt.ts/association';
import { ApiResponseHandler } from '../../../../../utils/help/apiResponses';

// Force this route to be server-side only
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authPayload = await requireAuth(request);
    if (authPayload instanceof NextResponse) return authPayload;

    // Get all business associations for the user
    const businessAssociations = await BuinessUsers().findAll({
      where: { 
        userId: authPayload.userId,
        isBanned: false // Only get non-banned associations
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
          ]
        }
      ],
      attributes: [
        'id',
        'role',
        'isOnline',
        'joinedAt',
        'lastActiveAt'
      ],
      order: [['joinedAt', 'DESC']] // Most recently joined first
    });

    // Transform the data to a more usable format
    const businesses = businessAssociations.map((association: any) => {
      const business = association.get('business') as any;
      return {
        associationId: association.get('id'),
        role: association.get('role'),
        isOnline: association.get('isOnline'),
        joinedAt: association.get('joinedAt'),
        lastActiveAt: association.get('lastActiveAt'),
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
          createdAt: business.createdAt
        } : null
      };
    }).filter((item: any) => item.business !== null); // Filter out any null businesses

    return ApiResponseHandler.success(
      {
        businesses,
        totalCount: businesses.length
      },
      'Businesses retrieved successfully'
    );

  } catch (error) {
    console.error('/api/auth/BuinessUsers/getAll error:', error);
    
    if (error instanceof Error) {
      return ApiResponseHandler.error(
        error.message,
        'business_fetch_error',
        undefined,
        500
      );
    }
    
    return ApiResponseHandler.internalError('Failed to fetch user businesses');
  }
}
