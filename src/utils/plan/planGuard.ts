import { NextResponse } from 'next/server';
import { User } from '../../models/associationt.ts/association';
import { isPlanValid, getPlanStatus } from './planValidation';

/**
 * Middleware function to check if user has a valid plan
 * @param userId - The user ID to check
 * @param requiredPlan - Optional specific plan required (e.g., 'Premium', 'Platinum')
 * @returns NextResponse with error if plan is invalid, null if valid
 */
export async function requireValidPlan(
  userId: number, 
  requiredPlan?: string
): Promise<NextResponse | null> {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      }, { status: 404 });
    }

    const planStatus = getPlanStatus(user);

    // Check if plan is valid
    if (!planStatus.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Your subscription has expired',
        code: 'PLAN_EXPIRED',
        planStatus: {
          isValid: false,
          isExpired: true,
          planName: planStatus.planName,
          validUntil: planStatus.validUntil,
          daysRemaining: planStatus.daysRemaining
        }
      }, { status: 403 });
    }

    // Check if specific plan is required
    if (requiredPlan && user.plan !== requiredPlan) {
      return NextResponse.json({
        success: false,
        error: `${requiredPlan} plan required for this feature`,
        code: 'INSUFFICIENT_PLAN',
        planStatus: {
          isValid: true,
          isExpired: false,
          planName: planStatus.planName,
          validUntil: planStatus.validUntil,
          daysRemaining: planStatus.daysRemaining,
          requiredPlan
        }
      }, { status: 403 });
    }

    return null; // Plan is valid
  } catch (error: any) {
    console.error('Plan validation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to validate plan'
    }, { status: 500 });
  }
}

/**
 * Check if user can access a specific feature based on their plan
 * @param user - The user object
 * @param feature - The feature name to check
 * @returns boolean - true if user can access the feature
 */
export function canAccessFeature(user: any, feature: string): boolean {
  const planStatus = getPlanStatus(user);
  
  if (!planStatus.isValid) {
    return false;
  }

  // Define feature access based on plans
  const featureAccess: Record<string, string[]> = {
    'free': ['basic_features'],
    'Premium': ['basic_features', 'premium_features', 'advanced_analytics'],
    'Platinum': ['basic_features', 'premium_features', 'advanced_analytics', 'platinum_features', 'priority_support'],
    'custom': ['basic_features', 'premium_features', 'advanced_analytics', 'platinum_features', 'priority_support', 'custom_features']
  };

  const userPlan = user.plan || 'free';
  const allowedFeatures = featureAccess[userPlan] || featureAccess['free'];
  
  return allowedFeatures.includes(feature);
}

/**
 * Get available features for a user's plan
 * @param user - The user object
 * @returns string[] - Array of available feature names
 */
export function getAvailableFeatures(user: any): string[] {
  const planStatus = getPlanStatus(user);
  
  if (!planStatus.isValid) {
    return ['basic_features']; // Only basic features for expired plans
  }

  const featureAccess: Record<string, string[]> = {
    'free': ['basic_features'],
    'Premium': ['basic_features', 'premium_features', 'advanced_analytics'],
    'Platinum': ['basic_features', 'premium_features', 'advanced_analytics', 'platinum_features', 'priority_support'],
    'custom': ['basic_features', 'premium_features', 'advanced_analytics', 'platinum_features', 'priority_support', 'custom_features']
  };

  const userPlan = user.plan || 'free';
  return featureAccess[userPlan] || featureAccess['free'];
}
