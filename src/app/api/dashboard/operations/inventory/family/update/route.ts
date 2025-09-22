import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Family } from '@/models/associationt.ts/association';
import { authorizeBusinessAccess } from '@/app/api/_lib/businessAuth';
import { updateFamilySchema } from '@/validations/dashboard/operations/inventory/family/familyValidation';

export async function PUT(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();

    // Validate input data
    const validationResult = updateFamilySchema.safeParse(body);
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

    const { id, name } = validationResult.data;

    // Business authorization (update)
    const businessIdInput = new URL(req.url).searchParams.get('businessId') || (body?.businessId as string | undefined);
    const authz = await authorizeBusinessAccess((auth as any).userId, businessIdInput, 'update');
    if (!authz.ok) return authz.response;
    const businessId = authz.businessId;

    // Find the family to update
    const family = await Family().findOne({
      where: {
        id,
        businessId,
      },
    });

    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    // Check if another family with the same name exists (excluding current one)
    if (name) {
      const existingFamily = await Family().findOne({
        where: {
          businessId,
          name,
          id: { [require('sequelize').Op.ne]: id }, // Exclude current family
        },
      });

      if (existingFamily) {
        return NextResponse.json(
          {
            error: 'Another family already exists with this name',
          },
          { status: 409 }
        );
      }
    }

    // Update the family
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;

    await family.update(updateData);

    // Fetch the updated family
    const updatedFamily = await Family().findByPk(id, {
      attributes: ['id', 'name', 'businessId'],
    });

    return NextResponse.json(
      {
        data: updatedFamily,
        message: 'Family updated successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating family:', error);
    return NextResponse.json(
      {
        error: 'Failed to update family',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
