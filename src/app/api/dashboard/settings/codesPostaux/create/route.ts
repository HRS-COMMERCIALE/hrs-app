import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../_lib/auth';
import { authorizeBusinessAccess } from '../../../../_lib/businessAuth';
import { CodesPostaux } from '@/models/associationt.ts/association';

export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const {  governorate, code, city, location, businessId } = body || {};

    if ( !governorate || !code || !city || !location || !businessId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const authz = await authorizeBusinessAccess((auth as any).userId as number, businessId, 'create');
    if (!authz.ok) return authz.response;

    const created = await CodesPostaux().create({ businessId: authz.businessId, governorate, code, city, location });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create postal code', details: error?.message }, { status: 500 });
  }
}


