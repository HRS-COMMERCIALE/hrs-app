import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../_lib/auth';
import { CodesPostaux, Business } from '@/models/associationt.ts/association';

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const business = await Business().findByPk(auth.userId);
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    const businessId = business.get('id');

    // Get all postal codes for this business
    const postalCodes = await CodesPostaux().findAll({
      where: { businessId },
      order: [['createdAt', 'DESC']], // Most recent first
      attributes: ['id', 'governorate', 'code', 'city', 'location', 'createdAt']
    });

    return NextResponse.json({ 
      data: postalCodes,
      count: postalCodes.length 
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch postal codes', details: error?.message }, { status: 500 });
  }
}
