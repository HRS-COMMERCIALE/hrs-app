import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../_lib/auth';
import { authorizeBusinessAccess } from '../../../../_lib/businessAuth';
import { CodesPostaux } from '@/models/associationt.ts/association';

export async function DELETE(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { ids, businessId } = body || {};

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid ids array' }, { status: 400 });
    }

    const authz = await authorizeBusinessAccess((auth as any).userId as number, businessId, 'delete');
    if (!authz.ok) return authz.response;

    // Check if all postal codes belong to this business
    const existingPostalCodes = await CodesPostaux().findAll({
      where: { 
        id: ids,
        businessId: authz.businessId 
      }
    });

    if (existingPostalCodes.length !== ids.length) {
      return NextResponse.json({ error: 'Some postal codes not found or don\'t belong to this business' }, { status: 404 });
    }

    // Delete all specified postal codes
    await CodesPostaux().destroy({
      where: { 
        id: ids,
        businessId: authz.businessId 
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
