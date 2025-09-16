import { NextResponse } from 'next/server';
import { getPlansForDisplay } from '../../stripe-config/PaymentPlanceConfig';

export async function GET() {
  try {
    const plans = getPlansForDisplay();
    
    return NextResponse.json({
      success: true,
      plans: plans
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}
