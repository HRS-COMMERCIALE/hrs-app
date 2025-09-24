import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../../_lib/auth';
import { authorizeBusinessAccess } from '../../../../../_lib/businessAuth';
import { updateOrderSchema, UpdateOrderData } from '@/validations/dashboard/operations/sales/orders/orderValidation';
import { Order, Article } from '@/models/associationt.ts/association';

export async function PUT(req: NextRequest) {
  try {
    // Authenticate user
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    // Business authorization
    const { searchParams } = new URL(req.url);
    const businessIdInput = searchParams.get('businessId') || (await req.json().then(body => body.businessId).catch(() => null));
    const authz = await authorizeBusinessAccess((auth as any).userId, businessIdInput, 'update');
    if (!authz.ok) return authz.response;
    const businessId = authz.businessId;

    // Parse and validate request body
    const body = await req.json();
    const validatedData: UpdateOrderData = updateOrderSchema.parse(body);

    // Find the order and verify ownership
    const existingOrder = await Order().findOne({
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
    }

    // Prepare update data (exclude id from update)
    const { id, transactionType: _ignoredTransactionType, ...updateData } = validatedData;

    // Update the order
    await Order().update({ ...updateData, transactionType: 'SALE' }, {
      where: {
        id: validatedData.id,
        businessId: businessId,
        transactionType: 'SALE',
      },
    });

    // Fetch the updated order with article details
    const updatedOrder = await Order().findByPk(validatedData.id, {
      include: [
        {
          model: Article(),
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
