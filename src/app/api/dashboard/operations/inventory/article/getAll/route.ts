import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Business, Article, Family, Supplier } from '@/models/associationt.ts/association';
import { getArticlesQuerySchema } from '@/validations/dashboard/operations/inventory/article/articleValidation';
import { Op } from 'sequelize';

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const parsed = getArticlesQuerySchema.safeParse(queryParams);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: parsed.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { page, limit, search, typeArticle, natureArticle, familyId, supplierId } = parsed.data;

    // Get user's business
    const business = await Business().findOne({ where: { userId: (auth as any).userId } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found for user' }, { status: 404 });
    }
    const businessId = business.get('id') as number;

    // Build where clause
    const whereClause: any = { businessId };

    // Add search filter
    if (search) {
      whereClause[Op.or] = [
        { article: { [Op.iLike]: `%${search}%` } },
        { marque: { [Op.iLike]: `%${search}%` } },
        { fournisseur: { [Op.iLike]: `%${search}%` } },
        { codeBarre: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Add type filter
    if (typeArticle) {
      whereClause.typeArticle = typeArticle;
    }

    // Add nature filter
    if (natureArticle) {
      whereClause.natureArticle = natureArticle;
    }

    // Add family filter
    if (familyId) {
      whereClause.familyId = familyId;
    }

    // Add supplier filter
    if (supplierId) {
      whereClause.supplierId = supplierId;
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get articles with pagination and includes
    const { count, rows: articles } = await Article().findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['id', 'DESC']], // Most recent first
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
      attributes: [
        'id', 'article', 'familyId', 'codeBarre', 'marque',
        'supplierId', 'fournisseur', 'typeArticle', 'majStock', 'maintenance',
        'garantie', 'garantieUnite', 'natureArticle', 'descriptifTechnique',
        'ArticleStatus', 'Sale', 'Invoice', 'Serializable', 'qteDepart',
        'qteEnStock', 'qteMin', 'qteMax', 'prixMP', 'imageUrl',
        'prixAchatHT', 'fraisAchat', 'prixAchatBrut', 'pourcentageFODEC',
        'FODEC', 'pourcentageTVA', 'TVASurAchat', 'prixAchatTTC',
        'prixVenteBrut', 'pourcentageMargeBeneficiaire', 'margeBeneficiaire',
        'prixVenteHT', 'pourcentageMaxRemise', 'remise', 'TVASurVente',
        'prixVenteTTC', 'margeNet', 'TVAAPayer'
      ],
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      data: articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },
      message: 'Articles retrieved successfully',
    });
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch articles',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
