import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../_lib/auth';
import { PointOfSale, Business } from '@/models/associationt.ts/association';

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    // Get business information
    const business = await Business.findByPk(auth.userId);
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    const businessId = business.get('id');

    // Get all points of sale for this business
    const pointsOfSale = await PointOfSale.findAll({
      where: { businessId },
      order: [['createdAt', 'DESC']], // Most recent first
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
