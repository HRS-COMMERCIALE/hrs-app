import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '../../../../../_lib/auth';
import { createOrderSchema, CreateOrderData } from '@/validations/dashboard/operations/sales/orders/orderValidation';
import { Order, Article, Business } from '@/models/associationt.ts/association';

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const authResult = await getAuthPayload(req);
    if (!authResult.ok) {
      return authResult.response;
    }
    const userId = authResult.payload.userId;
    const business = await Business().findOne({ where: { userId } });
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found for this user' },
        { status: 404 }
      );
    }
    const businessId = (business as any).get('id') as number;

    // Parse and validate request body
    const body = await req.json();
    const validatedData: CreateOrderData = createOrderSchema.parse(body);

    // Verify article exists and belongs to the business
    const article = await Article().findOne({
      where: {
        id: validatedData.articleId,
        businessId: businessId,
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found or does not belong to your business' },
        { status: 404 }
      );
    }

    // Optional stock check: prevent ordering more than stock for products when stock is managed
    const currentStock = Number((article as any).get('qteEnStock')) || 0;
    const typeArticle = (article as any).get('typeArticle') as string | null;
    const majStock = (article as any).get('majStock') as boolean | null;
    if ((typeArticle === 'product') && majStock && validatedData.qte > currentStock) {
      return NextResponse.json(
        { error: 'Quantity exceeds available stock' },
        { status: 400 }
      );
    }

    // Create the order (force transactionType to SALE)
    const order = await Order().create({
      businessId,
      articleId: validatedData.articleId,
      qte: validatedData.qte,
      pourcentageRemise: validatedData.pourcentageRemise || null,
      remise: validatedData.remise || null,
      prixVHT: validatedData.prixVHT,
      pourcentageFodec: validatedData.pourcentageFodec || null,
      fodec: validatedData.fodec || null,
      pourcentageTVA: validatedData.pourcentageTVA || null,
      tva: validatedData.tva || null,
      ttc: validatedData.ttc,
      type: validatedData.type,
      transactionType: 'SALE',
    });

    // Fetch the created order with article details
    const createdOrder = await Order().findByPk((order as any).get('id'), {
      include: [
        {
          model: Article,
          as: 'article',
          attributes: ['id', 'article', 'marque', 'prixVenteTTC'],
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: createdOrder,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: (error.issues ?? []).map((issue: any) => ({
            field: Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path ?? ''),
            message: issue.message,
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
