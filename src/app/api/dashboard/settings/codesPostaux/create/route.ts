import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../_lib/auth';
import { CodesPostaux ,Business} from '@/models/associationt.ts/association';

export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const {  governorate, code, city, location } = body || {};

    if ( !governorate || !code || !city || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const business = await Business.findByPk(auth.userId);
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    const businessId = business.get('id');

    const created = await CodesPostaux().create({ businessId, governorate, code, city, location });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create postal code', details: error?.message }, { status: 500 });
  }
}


