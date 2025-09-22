import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../_lib/auth';
import { authorizeBusinessAccess } from '../../../../_lib/businessAuth';
import { CodesPostaux } from '@/models/associationt.ts/association';

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const businessIdParam = searchParams.get('businessId');

    const authz = await authorizeBusinessAccess((auth as any).userId as number, businessIdParam, 'read');
    if (!authz.ok) return authz.response;

    // Get all postal codes for this business
    const postalCodes = await CodesPostaux().findAll({
      where: { businessId: authz.businessId },
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
