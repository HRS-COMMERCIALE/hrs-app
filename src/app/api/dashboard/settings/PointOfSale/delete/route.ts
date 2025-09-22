import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../_lib/auth';
import { authorizeBusinessAccess } from '../../../../_lib/businessAuth';
import { PointOfSale } from '@/models/associationt.ts/association';
import { deletePointOfSaleSchema } from '@/validations/dashboard/settings/pointOfSale';

export async function DELETE(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    
    // Validate input data
    const validationResult = deletePointOfSaleSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    const { ids, businessId } = validationResult.data as any;

    // Authorize delete access for this business
    const authz = await authorizeBusinessAccess((auth as any).userId as number, businessId, 'delete');
    if (!authz.ok) return authz.response;

    // Check if all points of sale belong to this business
    const existingPointsOfSale = await PointOfSale().findAll({
      where: { 
        id: ids,
        businessId: authz.businessId 
      }
    });

    if (existingPointsOfSale.length !== ids.length) {
      return NextResponse.json({ 
        error: 'Some points of sale not found or don\'t belong to this business' 
      }, { status: 404 });
    }

    // Delete all specified points of sale
    const deletedCount = await PointOfSale().destroy({
      where: { 
        id: ids,
        businessId: authz.businessId 
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Deleted ${deletedCount} point(s) of sale`,
      deletedCount 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error deleting points of sale:', error);
    return NextResponse.json({ 
      error: 'Failed to delete points of sale', 
      details: error?.message 
    }, { status: 500 });
  }
}
