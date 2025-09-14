import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../_lib/auth';
import { CodesPostaux, Business } from '@/models/associationt.ts/association';

export async function PUT(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { id, governorate, code, city, location } = body || {};

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const business = await Business.findByPk(auth.userId);
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    const businessId = business.get('id');

    // Check if the postal code belongs to this business
    const existingPostalCode = await CodesPostaux.findOne({
      where: { id, businessId }
    });

    if (!existingPostalCode) {
      return NextResponse.json({ error: 'Postal code not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (governorate !== undefined) updateData.governorate = governorate;
    if (code !== undefined) updateData.code = code;
    if (city !== undefined) updateData.city = city;
    if (location !== undefined) updateData.location = location;

    await existingPostalCode.update(updateData);

    return NextResponse.json({ data: existingPostalCode }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update postal code', details: error?.message }, { status: 500 });
  }
}
