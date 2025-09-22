import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../_lib/auth';
import { authorizeBusinessAccess } from '../../../../_lib/businessAuth';
import { PointOfSale } from '@/models/associationt.ts/association';
import { updatePointOfSaleSchema } from '@/validations/dashboard/settings/pointOfSale';

export async function PUT(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    
    // Validate input data
    const validationResult = updatePointOfSaleSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    const { id, pointOfSale, location, businessId } = validationResult.data as any;

    // Authorize update access for this business
    const authz = await authorizeBusinessAccess((auth as any).userId as number, businessId, 'update');
    if (!authz.ok) return authz.response;

    // Check if the point of sale belongs to this business
    const existingPointOfSale = await PointOfSale().findOne({
      where: { id, businessId: authz.businessId }
    });

    if (!existingPointOfSale) {
      return NextResponse.json({ error: 'Point of sale not found' }, { status: 404 });
    }

    // Check for duplicate if updating name or location
    if (pointOfSale !== undefined || location !== undefined) {
      const duplicateCheck = await PointOfSale().findOne({
        where: {
          businessId: authz.businessId,
          pointOfSale: pointOfSale || existingPointOfSale.get('pointOfSale'),
          location: location || existingPointOfSale.get('location'),
          id: { [require('sequelize').Op.ne]: id } // Exclude current record
        }
      });

      if (duplicateCheck) {
        return NextResponse.json({ 
          error: 'Point of sale already exists with this name and location' 
        }, { status: 409 });
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (pointOfSale !== undefined) updateData.pointOfSale = pointOfSale;
    if (location !== undefined) updateData.location = location;

    // Update the point of sale
    await existingPointOfSale.update(updateData);

    return NextResponse.json({ 
      data: existingPointOfSale,
      message: 'Point of sale updated successfully'
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating point of sale:', error);
    return NextResponse.json({ 
      error: 'Failed to update point of sale', 
      details: error?.message 
    }, { status: 500 });
  }
}
