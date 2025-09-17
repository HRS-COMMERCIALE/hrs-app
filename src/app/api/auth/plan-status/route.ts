import { NextRequest, NextResponse } from 'next/server';
import { User } from '../../../../models/associationt.ts/association';
import { getPlanStatus, isPlanValid, getDaysRemaining, needsRenewalWarning } from '../../../../utils/plan/planValidation';
import { requireAuth } from '../../_lib/auth';

// Force this route to be server-side only
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const userId = authResult.userId;
    
    // Get user with plan information
    const user = await User().findByPk(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Get plan status using utility functions
    const planStatus = getPlanStatus(user);
    const daysRemaining = getDaysRemaining(user);
    const needsWarning = needsRenewalWarning(user);

    return NextResponse.json({
      success: true,
      planStatus: {
        ...planStatus,
        daysRemaining,
        needsRenewalWarning: needsWarning,
        warningMessage: needsWarning 
          ? `Your ${planStatus.planName} plan expires in ${daysRemaining} days. Please renew to continue using premium features.`
          : null
      }
    });

  } catch (error: any) {
    console.error('Plan status check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check plan status'
    }, { status: 500 });
  }
}
