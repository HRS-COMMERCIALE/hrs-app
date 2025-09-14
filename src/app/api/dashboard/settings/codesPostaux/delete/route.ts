import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../_lib/auth';
import { CodesPostaux, Business } from '@/models/associationt.ts/association';

export async function DELETE(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { ids } = body || {};

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid ids array' }, { status: 400 });
    }

    const business = await Business.findByPk(auth.userId);
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    const businessId = business.get('id');

    // Check if all postal codes belong to this business
    const existingPostalCodes = await CodesPostaux.findAll({
      where: { 
        id: ids,
        businessId 
      }
    });

    if (existingPostalCodes.length !== ids.length) {
      return NextResponse.json({ error: 'Some postal codes not found or don\'t belong to this business' }, { status: 404 });
    }

    // Delete all specified postal codes
    await CodesPostaux.destroy({
      where: { 
        id: ids,
        businessId 
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Deleted ${ids.length} postal code(s)`,
      deletedCount: ids.length 
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete postal codes', details: error?.message }, { status: 500 });
  }
}
