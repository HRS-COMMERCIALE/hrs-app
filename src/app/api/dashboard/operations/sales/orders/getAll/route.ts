import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '../../../../../_lib/auth';
import { getOrdersSchema, GetOrdersData } from '@/validations/dashboard/operations/sales/orders/orderValidation';
import { Order, Article ,Business } from '@/models/associationt.ts/association';
import { Op } from 'sequelize';

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const authResult = await getAuthPayload(req);
    if (!authResult.ok) {
      return authResult.response;
    }
    const userId = authResult.payload.userId;
    // derive businessId from user
    const business = await  Business.findOne({ where: { userId } });
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found for this user' },
        { status: 404 }
      );
    }
    const businessId = (business as any).get('id') as number;

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
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
    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Article,
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
