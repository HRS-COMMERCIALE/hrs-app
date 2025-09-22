import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Family } from '@/models/associationt.ts/association';
import { authorizeBusinessAccess } from '@/app/api/_lib/businessAuth';
import { createFamilySchema } from '@/validations/dashboard/operations/inventory/family/familyValidation';

export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();

    // Validate input data
    const validationResult = createFamilySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { name } = validationResult.data;

    // Business authorization (create)
    const businessIdInput = new URL(req.url).searchParams.get('businessId') || (body?.businessId as string | undefined);
    const authz = await authorizeBusinessAccess((auth as any).userId, businessIdInput, 'create');
    if (!authz.ok) return authz.response;
    const businessId = authz.businessId;

    // Check if family already exists for this business
    const existingFamily = await Family().findOne({
      where: {
        businessId,
        name,
      },
    });

    if (existingFamily) {
      return NextResponse.json(
        {
          error: 'Family already exists with this name',
        },
        { status: 409 }
      );
    }

    // Create the family
    const created = await Family().create({
      businessId,
      name,
    });

    return NextResponse.json(
      {
        data: created,
        message: 'Family created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating family:', error);
    return NextResponse.json(
      {
        error: 'Failed to create family',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
