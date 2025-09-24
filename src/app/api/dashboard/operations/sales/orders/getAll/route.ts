import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../../_lib/auth';
import { authorizeBusinessAccess } from '../../../../../_lib/businessAuth';
import { getOrdersSchema, GetOrdersData } from '@/validations/dashboard/operations/sales/orders/orderValidation';
import { Order, Article } from '@/models/associationt.ts/association';
import { Op } from 'sequelize';

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    // Business authorization
    const { searchParams } = new URL(req.url);
    const businessIdInput = searchParams.get('businessId');
    const authz = await authorizeBusinessAccess((auth as any).userId, businessIdInput, 'read');
    if (!authz.ok) return authz.response;
    const businessId = authz.businessId;

    // Parse and validate query parameters
    const queryData = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      search: searchParams.get('search') || undefined,
      articleId: searchParams.get('articleId') ? parseInt(searchParams.get('articleId')!) : undefined,
    };

    const validatedQuery: GetOrdersData = getOrdersSchema.parse(queryData);

    // Build where clause
    const whereClause: any = {
      businessId: businessId,
      transactionType: 'SALE',
    };

    // Add article filter if provided
    if (validatedQuery.articleId) {
      whereClause.articleId = validatedQuery.articleId;
    }

    // Add search filter if provided
    if (validatedQuery.search) {
      whereClause[Op.or] = [
        { '$article.article$': { [Op.iLike]: `%${validatedQuery.search}%` } },
        { '$article.marque$': { [Op.iLike]: `%${validatedQuery.search}%` } },
      ];
    }

    // Calculate pagination
    const offset = (validatedQuery.page - 1) * validatedQuery.limit;

    // Fetch orders with pagination
    const { count, rows: orders } = await Order().findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Article(),
          as: 'article',
          attributes: ['id', 'article', 'marque', 'prixVenteTTC', 'qteEnStock'],
        },
      ],
      order: [['id', 'DESC']],
      limit: validatedQuery.limit,
      offset: offset,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / validatedQuery.limit);
    const hasNextPage = validatedQuery.page < totalPages;
    const hasPrevPage = validatedQuery.page > 1;

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: validatedQuery.page,
        totalPages,
        totalItems: count,
        itemsPerPage: validatedQuery.limit,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
