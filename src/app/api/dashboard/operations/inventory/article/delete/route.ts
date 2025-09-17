import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/_lib/auth';
import { Business, Article } from '@/models/associationt.ts/association';
import { deleteArticleSchema } from '@/validations/dashboard/operations/inventory/article/articleValidation';
import { deleteFromCloudinary } from '@/utils/cloudinary';

export async function DELETE(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    const parsed = deleteArticleSchema.safeParse({ id: id ? parseInt(id) : null });
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid article ID',
          details: parsed.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { id: articleId } = parsed.data;

    // Get user's business
    const business = await Business().findOne({ where: { userId: (auth as any).userId } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found for user' }, { status: 404 });
    }
    const businessId = business.get('id') as number;

    // Find the article to delete
    const article = await Article().findOne({
      where: {
        id: articleId,
        businessId,
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Get image URL before deletion
    const imageUrl = article.get('imageUrl') as string | null;

    // Delete the article
    await article.destroy();

    // Delete image from Cloudinary if it exists
    if (imageUrl) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = imageUrl.split('/');
        const publicId = urlParts[urlParts.length - 1].split('.')[0];
        const folderPath = 'hrs-app/articles/';
        const fullPublicId = folderPath + publicId;
        
        await deleteFromCloudinary(fullPublicId);
      } catch (deleteError) {
        console.error('Error deleting image from Cloudinary:', deleteError);
        // Don't fail the request if image deletion fails
      }
    }

    return NextResponse.json(
      {
        message: 'Article deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete article',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
