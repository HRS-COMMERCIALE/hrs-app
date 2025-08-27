import { Business } from '@/models/associationt.ts/association';
import type { RegisterSchema } from '@/validations/auth/register';
import type { Transaction } from 'sequelize';

export async function createBusiness(payload: RegisterSchema, userId: number, transaction?: Transaction): Promise<any> {
  try {
    const newBusiness = await Business.create({
      userId: userId,
      businessName: payload.business.businessName,
      taxId: payload.business.taxId,
      cnssCode: payload.business.cnssCode,
      industry: payload.business.industry,
      size: payload.business.size,
      currency: payload.business.currency,
      website: payload.business.website || '',
      logoFile: payload.business.logoFile as string || null,
    }, { transaction });

    return newBusiness;
  } catch (error) {
    console.error('Error creating business:', error);
    throw new Error('Failed to create business');
  }
}
