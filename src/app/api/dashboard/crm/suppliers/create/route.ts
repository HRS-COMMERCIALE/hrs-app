import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Supplier, Business, CodesPostaux } from '@/models/associationt.ts/association';
import { authorizeBusinessAccess } from '@/app/api/_lib/businessAuth';
import { createSupplierSchema } from '@/validations/dashboard/crm/suppliers/SuppliersValidation';

export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();

    const parsed = createSupplierSchema.safeParse(body);
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

    const { name, type, taxId, registrationNumber, email, address, phone1, phone2, phone3, codesPostauxId } = parsed.data;

    // Business authorization
    const { searchParams } = new URL(req.url);
    const businessIdInput = searchParams.get('businessId') || body.businessId;
    const authz = await authorizeBusinessAccess((auth as any).userId, businessIdInput, 'create');
    if (!authz.ok) return authz.response;
    const businessId = authz.businessId;

    // If codesPostauxId provided, ensure it belongs to the same business
    let validatedCodesPostauxId: number | null = null;
    if (codesPostauxId) {
      const cp = await CodesPostaux().findOne({ where: { id: codesPostauxId, businessId } });
      if (!cp) {
        return NextResponse.json({ error: 'Invalid codesPostauxId for this business' }, { status: 400 });
      }
      validatedCodesPostauxId = codesPostauxId;
    }

    const created = await Supplier().create({
      businessId,
      codesPostauxId: validatedCodesPostauxId,
      name,
      type,
      taxId,
      registrationNumber,
      email,
      address,
      phone1: phone1 ?? null,
      phone2: phone2 ?? null,
      phone3: phone3 ?? null,
    } as any);

    return NextResponse.json(
      {
        data: created,
        message: 'Supplier created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating supplier:', error);
    return NextResponse.json(
      {
        error: 'Failed to create supplier',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}


