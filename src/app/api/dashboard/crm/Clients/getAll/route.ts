import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Business, Clients, CodesPostaux } from '@/models/associationt.ts/association';
import { getClientsQuerySchema } from '@/validations/dashboard/crm/clients/clients';
import { Op } from 'sequelize';

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const parsed = getClientsQuerySchema.safeParse(queryParams);
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

    const { page, limit, search, type, category, governorate } = parsed.data;

    // Get user's business
    const business = await Business.findOne({ where: { userId: (auth as any).userId } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found for user' }, { status: 404 });
    }
    const businessId = business.get('id') as number;

    // Build where clause
    const whereClause: any = { businessId };

    // Add search filter
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { taxId: { [Op.iLike]: `%${search}%` } },
        { registrationNumber: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Add type filter
    if (type) {
      whereClause.type = type;
    }

    // Add category filter
    if (category) {
      whereClause.category = category;
    }

    // Add governorate filter
    if (governorate) {
      whereClause.governorate = governorate;
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get clients with pagination
    const { count, rows: clients } = await Clients.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: CodesPostaux,
          as: 'codesPostaux',
          required: false,
        },
      ],
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      data: clients,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },
      message: 'Clients retrieved successfully',
    });
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch clients',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
