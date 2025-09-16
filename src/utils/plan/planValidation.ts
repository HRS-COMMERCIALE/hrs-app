import { User } from '../../models/associationt.ts/association';

/**
 * Check if a user's plan is currently valid (not expired)
 * @param user - The user object from database
 * @returns boolean - true if plan is valid, false if expired or invalid
 */
export function isPlanValid(user: any): boolean {
  // Free plan is always valid
  if (user.plan === 'free') {
    return true;
  }

  // If no validity date is set, consider it invalid for paid plans
  if (!user.planValidUntil) {
    return false;
  }

  // Check if the current date is before the validity date
  const now = new Date();
  const validUntil = new Date(user.planValidUntil);
  
  return now < validUntil;
}

/**
 * Get the number of days remaining in the user's plan
 * @param user - The user object from database
 * @returns number - days remaining (0 if expired, negative if expired)
 */
export function getDaysRemaining(user: any): number {
  if (user.plan === 'free' || !user.planValidUntil) {
    return user.plan === 'free' ? Infinity : 0;
  }

  const now = new Date();
  const validUntil = new Date(user.planValidUntil);
  const diffTime = validUntil.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Get plan status information
 * @param user - The user object from database
 * @returns object with plan status details
 */
export function getPlanStatus(user: any): {
  isValid: boolean;
  daysRemaining: number;
  isExpired: boolean;
  validUntil: Date | null;
  planName: string;
} {
  const isValid = isPlanValid(user);
  const daysRemaining = getDaysRemaining(user);
  const isExpired = !isValid && user.plan !== 'free';
  
  return {
    isValid,
    daysRemaining,
    isExpired,
    validUntil: user.planValidUntil ? new Date(user.planValidUntil) : null,
    planName: user.plan || 'free'
  };
}

/**
 * Check if user needs to renew their plan
 * @param user - The user object from database
 * @param warningDays - Number of days before expiry to show warning (default: 7)
 * @returns boolean - true if user should be warned about renewal
 */
export function needsRenewalWarning(user: any, warningDays: number = 7): boolean {
  if (user.plan === 'free') {
    return false;
  }

  const daysRemaining = getDaysRemaining(user);
  return daysRemaining <= warningDays && daysRemaining > 0;
}
