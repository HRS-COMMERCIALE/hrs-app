import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Business, Family, Article } from '@/models/associationt.ts/association';
import { deleteFamilySchema } from '@/validations/dashboard/operations/inventory/family/familyValidation';

export async function DELETE(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    const parsed = deleteFamilySchema.safeParse({ id: id ? parseInt(id) : null });
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid family ID',
          details: parsed.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { id: familyId } = parsed.data;

    // Get user's business
    const business = await Business.findOne({ where: { userId: (auth as any).userId } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found for user' }, { status: 404 });
    }
    const businessId = business.get('id') as number;

    // Find the family to delete
    const family = await Family.findOne({
      where: {
        id: familyId,
        businessId,
      },
    });

    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    // Check if family has associated articles
    const articlesCount = await Article.count({
      where: {
        familyId: familyId,
        businessId,
      },
    });

    if (articlesCount > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete family',
          message: `This family has ${articlesCount} associated article(s). Please remove or reassign the articles first.`,
        },
        { status: 409 }
      );
    }

    // Delete the family
    await family.destroy();

    return NextResponse.json(
      {
        message: 'Family deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting family:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete family',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
