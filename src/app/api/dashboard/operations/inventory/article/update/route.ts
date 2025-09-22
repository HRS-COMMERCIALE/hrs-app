import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Article, Family, Supplier } from '@/models/associationt.ts/association';
import { authorizeBusinessAccess } from '@/app/api/_lib/businessAuth';
import { updateArticleSchema } from '@/validations/dashboard/operations/inventory/article/articleValidation';
import { uploadToCloudinary, deleteFromCloudinary } from '@/utils/cloudinary';

export async function PUT(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    // Parse form data
    const formData = await req.formData();
    
    // Extract all fields from form data
    const articleData: any = {};
    let imageFile: File | null = null;

    // Process form data
    for (const [key, value] of formData.entries()) {
      if (key === 'image' && value instanceof File) {
        imageFile = value;
      } else {
        // Convert string values to appropriate types
        if (value === 'true') {
          articleData[key] = true;
        } else if (value === 'false') {
          articleData[key] = false;
        } else if (value === '' || value === 'Select Unit') {
          articleData[key] = null;
        } else if (!isNaN(Number(value)) && value !== '') {
          articleData[key] = Number(value);
        } else {
          articleData[key] = value;
        }
      }
    }

    // Validate input data
    const validationResult = updateArticleSchema.safeParse(articleData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { id, ...validatedData } = validationResult.data;

    // Business authorization (update)
    const businessIdInput = (formData.get('businessId') as string) || new URL(req.url).searchParams.get('businessId');
    const authz = await authorizeBusinessAccess((auth as any).userId, businessIdInput, 'update');
    if (!authz.ok) return authz.response;
    const businessId = authz.businessId;

    // Find the article to update
    const article = await Article().findOne({
      where: {
        id,
        businessId,
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Check if article name already exists (excluding current one)
    if (validatedData.article) {
      const existingArticle = await Article().findOne({
        where: {
          businessId,
          article: validatedData.article,
          id: { [require('sequelize').Op.ne]: id },
        },
      });

      if (existingArticle) {
        return NextResponse.json(
          {
            error: 'Another article already exists with this name',
          },
          { status: 409 }
        );
      }
    }

    // Validate family if provided
    if (validatedData.familyId) {
      const family = await Family().findOne({
        where: { id: validatedData.familyId, businessId },
      });
      if (!family) {
        return NextResponse.json(
          { error: 'Invalid family ID for this business' },
          { status: 400 }
        );
      }
    }

    // Validate supplier if provided
    if (validatedData.supplierId) {
      const supplier = await Supplier().findOne({
        where: { id: validatedData.supplierId, businessId },
      });
      if (!supplier) {
        return NextResponse.json(
          { error: 'Invalid supplier ID for this business' },
          { status: 400 }
        );
      }
    }

    // Handle image upload and deletion of old image
    let imageUrl = article.get('imageUrl') as string | null;
    
    if (imageFile) {
      try {
        // Delete old image if it exists
        if (imageUrl) {
          // Extract public_id from Cloudinary URL
          const urlParts = imageUrl.split('/');
          const publicId = urlParts[urlParts.length - 1].split('.')[0];
          const folderPath = 'hrs-app/articles/';
          const fullPublicId = folderPath + publicId;
          
          await deleteFromCloudinary(fullPublicId);
        }

        // Upload new image
        const uploadResult = await uploadToCloudinary(imageFile, 'hrs-app/articles');
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json(
          {
            error: 'Failed to upload image',
            details: uploadError instanceof Error ? uploadError.message : 'Unknown error',
          },
          { status: 500 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    
    // Only update provided fields
    Object.keys(validatedData).forEach(key => {
      if (validatedData[key as keyof typeof validatedData] !== undefined) {
        updateData[key] = validatedData[key as keyof typeof validatedData];
      }
    });

    // Always update imageUrl if it was processed
    if (imageFile) {
      updateData.imageUrl = imageUrl;
    }

    // Update the article
    await article.update(updateData);

    // Fetch the updated article with relations
    const updatedArticle = await Article().findByPk(id, {
      include: [
        {
          model: Family(),
          as: 'family',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: Supplier(),
          as: 'supplier',
          attributes: ['id', 'name'],
          required: false,
        },
      ],
    });

    return NextResponse.json(
      {
        data: updatedArticle,
        message: 'Article updated successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating article:', error);
    
    // Handle specific database errors
    if (error.name === 'SequelizeDatabaseError') {
      return NextResponse.json(
        {
          error: 'Database error occurred',
          details: error.message,
          field: error.original?.where?.includes('parameter') ? 'Invalid field data' : 'Unknown field error',
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        error: 'Failed to update article',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
