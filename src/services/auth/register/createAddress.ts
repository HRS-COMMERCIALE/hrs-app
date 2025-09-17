import { Address } from '@/models/associationt.ts/association';
import type { RegisterSchema } from '@/validations/auth/register';
import type { Transaction } from 'sequelize';

export async function createAddress(payload: RegisterSchema, businessId: number, transaction?: Transaction): Promise<any> {
  try {
    const newAddress = await Address().create({
      businessId: businessId,
      country: payload.address.country,
      governorate: payload.address.governorate,
      postalCode: payload.address.postalCode,
      address: payload.address.address,
      phone: payload.address.phone,
      fax: payload.address.fax || null,
    }, { transaction });

    return newAddress;
  } catch (error) {
    console.error('Error creating address:', error);
    throw new Error('Failed to create address');
  }
}
