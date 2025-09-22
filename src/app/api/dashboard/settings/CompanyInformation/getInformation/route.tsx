import { NextResponse } from 'next/server';
import { Business } from '../../../../../../models/associationt.ts/association';
import { authorizeBusinessAccess } from '../../../../_lib/businessAuth';
import { requireAuth } from '../../../../_lib/auth';

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    const userId = (auth as any).userId as number;
    const { searchParams } = new URL(req.url);
    const businessIdParam = searchParams.get('businessId');

    // Business-level auth (read)
    const authz = await authorizeBusinessAccess(userId, businessIdParam, 'read');
    if (!authz.ok) return authz.response;

    // Load the targeted business (subset fields)
    const business = await Business().findOne({
      where: { id: authz.businessId },
      attributes: [ 
        'userId',
        'currency',
        'size',
        'industry',
        'businessName',
        'registrationNumber',
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


