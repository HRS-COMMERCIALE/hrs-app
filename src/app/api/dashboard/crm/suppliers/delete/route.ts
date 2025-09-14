import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Supplier, Business } from '@/models/associationt.ts/association';
import { deleteSupplierSchema } from '@/validations/dashboard/crm/suppliers/SuppliersValidation';

export async function DELETE(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const parsed = deleteSupplierSchema.safeParse(body);
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

    const { id } = parsed.data;

    const business = await Business.findOne({ where: { userId: (auth as any).userId } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found for user' }, { status: 404 });
    }
    const businessId = business.get('id') as number;

    const supplier = await Supplier.findOne({ where: { id, businessId } });
    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    await supplier.destroy();

    return NextResponse.json({ message: 'Supplier deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting supplier:', error);
    return NextResponse.json(
      { error: 'Failed to delete supplier', details: error?.message },
      { status: 500 }
    );
  }
}


