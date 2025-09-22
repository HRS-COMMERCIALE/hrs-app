import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Business, CodesPostaux, Clients } from '@/models/associationt.ts/association';
import { authorizeBusinessAccess } from '@/app/api/_lib/businessAuth';
import { createClientSchema } from '@/validations/dashboard/crm/clients/clients';

export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();

    const parsed = createClientSchema.safeParse(body);
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

    const {
      name,
      type,
      address,
      governorate,
      city,
      category,
      registrationNumber,
      taxId,
      vat,
      email,
      phone1,
      phone2,
      phone3,
      faxNumber,
      startDate,
      endDate,
      Billing,
      Price,
      affiliation,
      ExemptionNumber,
      codesPostauxId,
    } = parsed.data;

    const business = await Business().findOne({ where: { userId: (auth as any).userId } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found for user' }, { status: 404 });
    }
    const authz = await authorizeBusinessAccess((auth as any).userId, business.get('id'), 'create');
    if (!authz.ok) return authz.response;
    const businessId = authz.businessId;

    let validatedCodesPostauxId: number | null = null;
    if (codesPostauxId) {
      const cp = await CodesPostaux().findOne({ where: { id: codesPostauxId, businessId } });
      if (!cp) {
        return NextResponse.json({ error: 'Invalid codesPostauxId for this business' }, { status: 400 });
      }
      validatedCodesPostauxId = codesPostauxId;
    }

    const created = await Clients().create({
      businessId,
      codesPostauxId: validatedCodesPostauxId,
      name,
      type,
      address,
      governorate: governorate ?? null,
      city: city ?? null,
      category: category ?? null,
      registrationNumber: registrationNumber ?? null,
      taxId: taxId ?? null,
      vat: vat ?? null,
      email: email ?? null,
      phone1: phone1 ?? null,
      phone2: phone2 ?? null,
      phone3: phone3 ?? null,
      faxNumber: faxNumber ?? null,
      startDate: startDate ?? null,
      endDate: endDate ?? null,
      Billing: Billing ?? null,
      Price: Price ?? null,
      affiliation: affiliation ?? null,
      ExemptionNumber: ExemptionNumber ?? null,
    } as any);

    return NextResponse.json(
      {
        data: created,
        message: 'Client created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      {
        error: 'Failed to create client',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}


