import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../_lib/auth';
import { PointOfSale, Business } from '@/models/associationt.ts/association';
import { createPointOfSaleSchema } from '@/validations/dashboard/settings/pointOfSale';

export async function POST(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    
    // Validate input data
    const validationResult = createPointOfSaleSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    const { pointOfSale, location } = validationResult.data;

    // Get business information
    const business = await Business().findByPk(auth.userId);
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    const businessId = business.get('id');

    // Check if point of sale already exists for this business
    const existingPointOfSale = await PointOfSale().findOne({
      where: {
        businessId,
        pointOfSale,
        location
      }
    });

    if (existingPointOfSale) {
      return NextResponse.json({ 
        error: 'Point of sale already exists with this name and location' 
      }, { status: 409 });
    }

    // Create the point of sale
    const created = await PointOfSale().create({ 
      businessId, 
      pointOfSale, 
      location 
    });

    return NextResponse.json({ 
      data: created,
      message: 'Point of sale created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating point of sale:', error);
    return NextResponse.json({ 
      error: 'Failed to create point of sale', 
      details: error?.message 
    }, { status: 500 });
  }
}
