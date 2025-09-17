import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Business, Family } from '@/models/associationt.ts/association';
import { getFamiliesQuerySchema } from '@/validations/dashboard/operations/inventory/family/familyValidation';
import { Op } from 'sequelize';

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const parsed = getFamiliesQuerySchema.safeParse(queryParams);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: parsed.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { page, limit, search } = parsed.data;

    // Get user's business
    const business = await Business().findOne({ where: { userId: (auth as any).userId } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found for user' }, { status: 404 });
    }
    const businessId = business.get('id') as number;

    // Build where clause
    const whereClause: any = { businessId };

    // Add search filter
    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get families with pagination
    const { count, rows: families } = await Family().findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['id', 'DESC']], // Most recent first
      attributes: ['id', 'name', 'businessId'],
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      data: families,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },
      message: 'Families retrieved successfully',
    });
  } catch (error: any) {
    console.error('Error fetching families:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch families',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
