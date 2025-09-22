import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Clients } from '@/models/associationt.ts/association';
import { authorizeBusinessAccess } from '@/app/api/_lib/businessAuth';
import { deleteClientSchema } from '@/validations/dashboard/crm/clients/clients';

export async function DELETE(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    const parsed = deleteClientSchema.safeParse({ id: id ? parseInt(id) : null });
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

    // Authorize using explicit businessId
    const businessIdInput = searchParams.get('businessId');
    const authz = await authorizeBusinessAccess((auth as any).userId, businessIdInput, 'delete');
    if (!authz.ok) return authz.response;
    const businessId = authz.businessId;

    // Check if client exists and belongs to user's business
    const existingClient = await Clients().findOne({
      where: { 
        id: clientId,
        businessId 
      },
    });

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Delete client
    const deletedRowsCount = await Clients().destroy({
      where: { 
        id: clientId,
        businessId 
      },
    });

    if (deletedRowsCount === 0) {
      return NextResponse.json({ error: 'Failed to delete client' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Client deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete client',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
