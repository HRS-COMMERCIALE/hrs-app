import type { RegisterSchema } from '@/validations/auth/register';
import { Business, User } from '@/models/associationt.ts/association';
import type { Transaction } from 'sequelize';
import { createBusiness } from './createBuissness';
import { createAddress } from './createAddress';

export async function RegisterUser(payload: RegisterSchema, userId: number, plan: string) {

  // Enforce plan rules
  if (plan === 'free') {
    throw new Error('PLAN_FORBIDDEN: Free plan cannot create a business');
  }
  if (plan === 'custom') {
    throw new Error('PLAN_NOT_SUPPORTED: Cannot create business for custom plan for now');
  }

  // Determine business limits by plan
  const planLimits: Record<string, number> = {
    Premium: 1,
    Platinum: 1,
    Diamond: 3,
  };
  const maxBusinesses = planLimits[plan] ?? 0;

  if (maxBusinesses <= 0) {
    throw new Error('PLAN_FORBIDDEN: Your plan does not allow creating a business');
  }

  // Use transaction with row locking to avoid race conditions on business limits

  // Check if business name already exists
  const existingBusinessByName = await Business().findOne({
    where: { businessName: payload.business.businessName }
  });
  if (existingBusinessByName) {
    throw new Error('Business name already exists');
  }

  // Check if tax ID already exists
  const existingBusinessByTaxId = await Business().findOne({
    where: { taxId: payload.business.taxId }
  });
  if (existingBusinessByTaxId) {
    throw new Error('Tax ID already exists');
  }

  // Check if CNSS code already exists
  const existingBusinessByCnssCode = await Business().findOne({
    where: { cnssCode: payload.business.cnssCode }
  });
  if (existingBusinessByCnssCode) {
    throw new Error('CNSS code already exists');
  }

  // Create business and address in a transaction for the existing user
  const result = await Business().sequelize!.transaction(async (transaction: Transaction) => {
    // Lock the user row and verify current business count atomically
    const user = await User().findByPk(userId, { transaction, lock: true });
    if (!user) {
      throw new Error('User not found');
    }

    const currentCount = (user.get('buinessCount') as number) || 0;
    if (currentCount >= maxBusinesses) {
      throw new Error(`BUSINESS_LIMIT_REACHED: You have reached the business limit for your ${plan} plan`);
    }

    // Increment user's business count within the same transaction
    await user.increment('buinessCount', { by: 1, transaction });

    // Create business for the authenticated user
    const newBusiness = await createBusiness(payload, userId, transaction);

    // Create address for the new business
    const newAddress = await createAddress(payload, newBusiness.dataValues.id, transaction);

    return { newBusiness, newAddress };
  });

  return result;
}