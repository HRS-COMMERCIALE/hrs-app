import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Supplier, Business, CodesPostaux } from '@/models/associationt.ts/association';
import { authorizeBusinessAccess } from '@/app/api/_lib/businessAuth';
import { updateSupplierSchema } from '@/validations/dashboard/crm/suppliers/SuppliersValidation';

export async function PUT(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const parsed = updateSupplierSchema.safeParse(body);
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

    const { id, codesPostauxId, ...updates } = parsed.data as any;

    // Business authorization
    const { searchParams } = new URL(req.url);
    const businessIdInput = searchParams.get('businessId') || body.businessId;
    const authz = await authorizeBusinessAccess((auth as any).userId, businessIdInput, 'update');
    if (!authz.ok) return authz.response;
    const businessId = authz.businessId;

    const supplier = await Supplier().findOne({ where: { id, businessId } });
    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    let validatedCodesPostauxId: number | null | undefined = undefined;
    if (codesPostauxId !== undefined) {
      if (codesPostauxId === null) {
        validatedCodesPostauxId = null;
      } else {
        const cp = await CodesPostaux().findOne({ where: { id: codesPostauxId, businessId } });
        if (!cp) {
          return NextResponse.json({ error: 'Invalid codesPostauxId for this business' }, { status: 400 });
        }
        validatedCodesPostauxId = codesPostauxId;
      }
    }

    const updatePayload: any = { ...updates };
    if (validatedCodesPostauxId !== undefined) {
      updatePayload.codesPostauxId = validatedCodesPostauxId;
    }

    await supplier.update(updatePayload);

    return NextResponse.json({ data: supplier, message: 'Supplier updated successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating supplier:', error);
    return NextResponse.json(
      { error: 'Failed to update supplier', details: error?.message },
      { status: 500 }
    );
  }
}


