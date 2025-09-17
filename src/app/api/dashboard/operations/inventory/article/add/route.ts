import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Business, Article, Family, Supplier } from '@/models/associationt.ts/association';
import { createArticleSchema } from '@/validations/dashboard/operations/inventory/article/articleValidation';
import { uploadToCloudinary } from '@/utils/cloudinary';

export async function POST(req: Request) {
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

    // Debug log to see what data we're processing
    console.log('Processed article data:', JSON.stringify(articleData, null, 2));

    // Validate input data
    const validationResult = createArticleSchema.safeParse(articleData);
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

    const validatedData = validationResult.data;

    // Get user's business
    const business = await Business().findOne({ where: { userId: (auth as any).userId } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found for user' }, { status: 404 });
    }
    const businessId = business.get('id') as number;

    // Check if article name already exists for this business
    const existingArticle = await Article().findOne({
      where: {
        businessId,
        article: validatedData.article,
      },
    });

    if (existingArticle) {
      return NextResponse.json(
        {
          error: 'Article already exists with this name',
        },
        { status: 409 }
      );
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

    // Handle image upload
    let imageUrl: string | null = null;
    if (imageFile) {
      try {
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

    // Create the article
    const created = await Article().create({
      businessId,
      article: validatedData.article,
      familyId: validatedData.familyId || null,
      codeBarre: validatedData.codeBarre || null,
      marque: validatedData.marque || null,
      supplierId: validatedData.supplierId || null,
      fournisseur: validatedData.fournisseur || null,
      typeArticle: validatedData.typeArticle || null,
      majStock: validatedData.majStock ?? true,
      maintenance: validatedData.maintenance ?? false,
      garantie: validatedData.garantie || null,
      garantieUnite: validatedData.garantieUnite || null,
      natureArticle: validatedData.natureArticle || null,
      descriptifTechnique: validatedData.descriptifTechnique || null,
      ArticleStatus: validatedData.ArticleStatus ?? true,
      Sale: validatedData.Sale ?? false,
      Invoice: validatedData.Invoice || null,
      Serializable: validatedData.Serializable || null,
      qteDepart: validatedData.qteDepart ?? 0,
      qteEnStock: validatedData.qteEnStock ?? 0,
      qteMin: validatedData.qteMin ?? 0,
      qteMax: validatedData.qteMax ?? 0,
      prixMP: validatedData.prixMP || null,
      imageUrl,
      prixAchatHT: validatedData.prixAchatHT || null,
      fraisAchat: validatedData.fraisAchat || null,
      prixAchatBrut: validatedData.prixAchatBrut || null,
      pourcentageFODEC: validatedData.pourcentageFODEC || null,
      FODEC: validatedData.FODEC || null,
      pourcentageTVA: validatedData.pourcentageTVA || null,
      TVASurAchat: validatedData.TVASurAchat || null,
      prixAchatTTC: validatedData.prixAchatTTC || null,
      prixVenteBrut: validatedData.prixVenteBrut || null,
      pourcentageMargeBeneficiaire: validatedData.pourcentageMargeBeneficiaire || null,
      margeBeneficiaire: validatedData.margeBeneficiaire || null,
      prixVenteHT: validatedData.prixVenteHT || null,
      pourcentageMaxRemise: validatedData.pourcentageMaxRemise || null,
      remise: validatedData.remise || null,
      TVASurVente: validatedData.TVASurVente || null,
      prixVenteTTC: validatedData.prixVenteTTC || null,
      margeNet: validatedData.margeNet || null,
      TVAAPayer: validatedData.TVAAPayer || null,
    });

    // Fetch the created article with relations
    const createdArticle = await Article().findByPk(created.get('id') as number, {
      include: [
        {
          model: Family,
          as: 'family',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name'],
          required: false,
        },
      ],
    });

    return NextResponse.json(
      {
        data: createdArticle,
        message: 'Article created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating article:', error);
    
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
        error: 'Failed to create article',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
