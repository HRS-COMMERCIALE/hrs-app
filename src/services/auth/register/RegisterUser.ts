import type { RegisterSchema } from '@/validations/auth/register';
import { User, Business, Address } from '@/models/associationt.ts/association';
import { hashPassword, checkPasswordStrength } from '@/utils/bycript/password';
import { createBusiness } from './createBuissness';
import { createAddress } from './createAddress';

export async function RegisterUser(payload: RegisterSchema) {
  // Check password strength
  const strengthCheck = checkPasswordStrength(payload.user.password);
  if (!strengthCheck.isStrong) {
    throw new Error(`Password is too weak: ${strengthCheck.feedback.join(', ')}`);
  }

  // Check if email already exists
  const existingUserByEmail = await User.findOne({
    where: { email: payload.user.email }
  });
  if (existingUserByEmail) {
    throw new Error('Email already exists');
  }

  // Check if mobile already exists
  const existingUserByMobile = await User.findOne({
    where: { mobile: payload.user.mobile }
  });
  if (existingUserByMobile) {
    throw new Error('Mobile number already exists');
  }

  // Check if business name already exists
  const existingBusinessByName = await Business.findOne({
    where: { businessName: payload.business.businessName }
  });
  if (existingBusinessByName) {
    throw new Error('Business name already exists');
  }

  // Check if tax ID already exists
  const existingBusinessByTaxId = await Business.findOne({
    where: { taxId: payload.business.taxId }
  });
  if (existingBusinessByTaxId) {
    throw new Error('Tax ID already exists');
  }

  // Check if CNSS code already exists
  const existingBusinessByCnssCode = await Business.findOne({
    where: { cnssCode: payload.business.cnssCode }
  });
  if (existingBusinessByCnssCode) {
    throw new Error('CNSS code already exists');
  }

  // Hash the password
  const hashedPassword = await hashPassword(payload.user.password);

  // Create user, business, and address in a transaction
  const result = await User.sequelize!.transaction(async (transaction) => {
    // Create user
    const newUser = await User.create({
      status: payload.user?.status || 'active',
      title: payload.user.title,
      firstName: payload.user.firstName,
      lastName: payload.user.lastName,
      email: payload.user.email,
      mobile: payload.user.mobile,
      landline: payload.user?.landline,
      password: hashedPassword,
      role: 'manager',
    }, { transaction });


    // Create business
    const newBusiness = await createBusiness(payload, newUser.dataValues.id, transaction);

    // Create address
    const newAddress = await createAddress(payload, newBusiness.dataValues.id, transaction);

    return { newUser, newBusiness, newAddress };
  });

  return result;
}