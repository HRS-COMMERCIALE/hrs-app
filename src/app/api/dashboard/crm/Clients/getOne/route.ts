import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Business, Clients, CodesPostaux } from '@/models/associationt.ts/association';
import { authorizeBusinessAccess } from '@/app/api/_lib/businessAuth';
import { getClientSchema } from '@/validations/dashboard/crm/clients/clients';

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    const parsed = getClientSchema.safeParse({ id: id ? parseInt(id) : null });
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid client ID',
          details: parsed.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { id: clientId } = parsed.data;

    // Get user's business and authorize read
    const business = await Business().findOne({ where: { userId: (auth as any).userId } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found for user' }, { status: 404 });
    }
    const authz = await authorizeBusinessAccess((auth as any).userId, business.get('id'), 'read');
    if (!authz.ok) return authz.response;
    const businessId = authz.businessId;

    // Find client
    const client = await Clients().findOne({
      where: { 
        id: clientId,
        businessId 
      },
      include: [
        {
          model: CodesPostaux,
          as: 'codesPostaux',
          required: false,
        },
      ],
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({
      data: client,
      message: 'Client retrieved successfully',
    });
  } catch (error: any) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch client',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
