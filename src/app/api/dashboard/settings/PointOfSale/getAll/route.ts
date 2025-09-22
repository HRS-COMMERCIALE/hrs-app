import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../_lib/auth';
import { authorizeBusinessAccess } from '../../../../_lib/businessAuth';
import { PointOfSale } from '@/models/associationt.ts/association';

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const businessIdParam = searchParams.get('businessId');

    // Authorize read access for this business
    const authz = await authorizeBusinessAccess((auth as any).userId as number, businessIdParam, 'read');
    if (!authz.ok) return authz.response;

    // Get all points of sale for this business
    const pointsOfSale = await PointOfSale().findAll({
      where: { businessId: authz.businessId },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'pointOfSale', 'location', 'createdAt', 'updatedAt']
    });

    return NextResponse.json({ 
      data: pointsOfSale,
      count: pointsOfSale.length,
      message: 'Points of sale retrieved successfully'
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching points of sale:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch points of sale', 
      details: error?.message 
    }, { status: 500 });
  }
}
