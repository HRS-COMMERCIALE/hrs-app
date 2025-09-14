import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Business, Family } from '@/models/associationt.ts/association';
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

    // Get user's business
    const business = await Business.findOne({ where: { userId: (auth as any).userId } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found for user' }, { status: 404 });
    }
    const businessId = business.get('id') as number;

    // Check if family already exists for this business
    const existingFamily = await Family.findOne({
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
    const created = await Family.create({
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
