import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../../_lib/auth';
import { authorizeBusinessAccess } from '../../../../../_lib/businessAuth';
import { deleteOrderSchema, DeleteOrderData } from '@/validations/dashboard/operations/sales/orders/orderValidation';
import { Order } from '@/models/associationt.ts/association';

export async function DELETE(req: NextRequest) {
  try {
    // Authenticate user
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    // Business authorization
    const { searchParams } = new URL(req.url);
    const businessIdInput = searchParams.get('businessId') || (await req.json().then(body => body.businessId).catch(() => null));
    const authz = await authorizeBusinessAccess((auth as any).userId, businessIdInput, 'delete');
    if (!authz.ok) return authz.response;
    const businessId = authz.businessId;

    // Parse and validate request body
    const body = await req.json();
    const validatedData: DeleteOrderData = deleteOrderSchema.parse(body);

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

    // Delete the order
    await Order().destroy({
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
