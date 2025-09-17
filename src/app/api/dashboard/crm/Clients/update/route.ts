import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Business, Clients, CodesPostaux } from '@/models/associationt.ts/association';
import { updateClientSchema } from '@/validations/dashboard/crm/clients/clients';

export async function PUT(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();

    // Validate request body
    const parsed = updateClientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { id, ...updateData } = parsed.data;

    // Get user's business
    const business = await Business().findOne({ where: { userId: (auth as any).userId } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found for user' }, { status: 404 });
    }
    const businessId = business.get('id') as number;

    // Check if client exists and belongs to user's business
    const existingClient = await Clients().findOne({
      where: { 
        id,
        businessId 
      },
    });

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Validate codesPostauxId if provided
    if (updateData.codesPostauxId) {
      const postalCode = await CodesPostaux().findOne({ 
        where: { 
          id: updateData.codesPostauxId, 
          businessId 
        } 
      });
      if (!postalCode) {
        return NextResponse.json({ 
          error: 'Invalid postal code for this business' 
        }, { status: 400 });
      }
    }

    // Update client
    const [updatedRowsCount] = await Clients().update(updateData, {
      where: { 
        id,
        businessId 
      },
    });

    if (updatedRowsCount === 0) {
      return NextResponse.json({ error: 'No changes made to client' }, { status: 400 });
    }

    // Fetch updated client with relations
    const updatedClient = await Clients().findOne({
      where: { 
        id,
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

    return NextResponse.json({
      data: updatedClient,
      message: 'Client updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      {
        error: 'Failed to update client',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
