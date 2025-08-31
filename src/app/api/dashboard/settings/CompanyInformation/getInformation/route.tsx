import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../_lib/auth';
import { Business } from '../../../../../../models/associationt.ts/association';

export async function GET(req: Request) {
  // Authenticate request and get payload
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const userId = auth.userId;

    // Find the business tied to the authenticated user
    const business = await (Business as any).findOne({
      where: { userId },
      attributes: [ 
        'userId',
        'currency',
        'size',
        'industry',
        'businessName',
        'taxId',
        'cnssCode',
        'website',
        'logoFile',
      ],
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json({ data: business });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to load business info', details: error?.message }, { status: 500 });
  }
}


