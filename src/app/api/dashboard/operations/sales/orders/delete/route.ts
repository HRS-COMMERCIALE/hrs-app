import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '../../../../../_lib/auth';
import { deleteOrderSchema, DeleteOrderData } from '@/validations/dashboard/operations/sales/orders/orderValidation';
import { Order, Business } from '@/models/associationt.ts/association';

export async function DELETE(req: NextRequest) {
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
    const validatedData: DeleteOrderData = deleteOrderSchema.parse(body);

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

    // Delete the order
    await Order.destroy({
      where: {
        id: validatedData.id,
        businessId: businessId,
        transactionType: 'SALE',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting order:', error);

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
