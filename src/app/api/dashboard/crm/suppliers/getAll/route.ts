import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Supplier, Business } from '@/models/associationt.ts/association';
import { authorizeBusinessAccess } from '@/app/api/_lib/businessAuth';
import { Op } from 'sequelize';

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const q = searchParams.get('q');

    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 0, 1), 100) : 50;
    const offset = offsetParam ? Math.max(parseInt(offsetParam, 10) || 0, 0) : 0;

    const business = await Business().findOne({ where: { userId: (auth as any).userId } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found for user' }, { status: 404 });
    }
    const authz = await authorizeBusinessAccess((auth as any).userId, business.get('id'), 'read');
    if (!authz.ok) return authz.response;
    const businessId = authz.businessId;

    const where: any = { businessId };
    if (q) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${q}%` } },
        { email: { [Op.iLike]: `%${q}%` } },
      ];
    }

    // Order by id desc since createdAt isn't present on this model
    const results = await Supplier().findAll({ where, limit, offset, order: [['id', 'DESC']] });

    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suppliers', details: error?.message },
      { status: 500 }
    );
  }
}


