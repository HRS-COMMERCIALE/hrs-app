import { Business } from '@/models/associationt.ts/association';
import type { RegisterSchema } from '@/validations/auth/register';
import type { Transaction } from 'sequelize';
import { uploadToCloudinary } from '@/utils/cloudinary';

export async function createBusiness(payload: RegisterSchema, userId: number, transaction?: Transaction): Promise<any> {
  try {
    let logoFilePath: string | null = null;
    
    // Handle logo file upload if present
    if (payload.business.logoFile && payload.business.logoFile instanceof File) {
      try {
        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(
          payload.business.logoFile, 
          'hrs-app/business-logos'
        );
        logoFilePath = uploadResult.secure_url;
        console.log('✅ Logo uploaded to Cloudinary:', logoFilePath);
      } catch (fileError) {
        console.error('❌ Error uploading logo file:', fileError);
        throw new Error('Failed to upload logo file to Cloudinary');
      }
    }

    const newBusiness = await Business.create({
      userId: userId,
      businessName: payload.business.businessName,
      taxId: payload.business.taxId,
      cnssCode: payload.business.cnssCode,
      industry: payload.business.industry,
      size: payload.business.size,
      currency: payload.business.currency,
      website: payload.business.website || '',
      logoFile: logoFilePath,
    }, { transaction });

    return newBusiness;
  } catch (error) {
    console.error('Error creating business:', error);
    throw new Error('Failed to create business');
  }
}
