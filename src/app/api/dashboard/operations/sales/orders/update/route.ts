import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '../../../../../_lib/auth';
import { updateOrderSchema, UpdateOrderData } from '@/validations/dashboard/operations/sales/orders/orderValidation';
import { Order, Article, Business } from '@/models/associationt.ts/association';

export async function PUT(req: NextRequest) {
  try {
    // Authenticate user
    const authResult = await getAuthPayload(req);
    if (!authResult.ok) {
      return authResult.response;
    }
    const userId = authResult.payload.userId;
    const business = await Business.findOne({ where: { userId } });
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found for this user' },
        { status: 404 }
      );
    }
    const businessId = (business as any).get('id') as number;

    // Parse and validate request body
    const body = await req.json();
    const validatedData: UpdateOrderData = updateOrderSchema.parse(body);

    // Find the order and verify ownership
    const existingOrder = await Order.findOne({
      where: {
        id: validatedData.id,
        businessId: businessId,
        transactionType: 'SALE',
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found or does not belong to your business' },
        { status: 404 }
      );
    }

    // If articleId is being updated, verify the new article exists and belongs to the business
    if (validatedData.articleId && validatedData.articleId !== (existingOrder as any).articleId) {
      const article = await Article.findOne({
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
    }

    // Prepare update data (exclude id from update)
    const { id, transactionType: _ignoredTransactionType, ...updateData } = validatedData;

    // Update the order
    await Order.update({ ...updateData, transactionType: 'SALE' }, {
      where: {
        id: validatedData.id,
        businessId: businessId,
        transactionType: 'SALE',
      },
    });

    // Fetch the updated order with article details
    const updatedOrder = await Order.findByPk(validatedData.id, {
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
      message: 'Order updated successfully',
      data: updatedOrder,
    });
  } catch (error: any) {
    console.error('Error updating order:', error);

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
