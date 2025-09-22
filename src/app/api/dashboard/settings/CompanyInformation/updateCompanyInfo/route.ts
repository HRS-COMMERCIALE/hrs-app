import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '@/app/api/_lib/auth';
import { Business } from '@/models/associationt.ts/association';
import { uploadToCloudinary, deleteFromCloudinary, isCloudinaryConfigured } from '@/utils/cloudinary';
import { authorizeBusinessAccess } from '@/app/api/_lib/businessAuth';

// Attempt to derive Cloudinary public_id from a secure URL
function deriveCloudinaryPublicId(url: string): string | null {
  try {
    const u = new URL(url);
    // Example: https://res.cloudinary.com/<cloud>/image/upload/v12345/hrs-app/company-logos/abc123.png
    // We want: hrs-app/company-logos/abc123
    const parts = u.pathname.split('/');
    const uploadIndex = parts.findIndex(p => p === 'upload');
    if (uploadIndex === -1) return null;
    const afterUpload = parts.slice(uploadIndex + 1); // [ 'v12345', 'hrs-app', 'company-logos', 'abc123.png' ]
    const withoutVersion = afterUpload[0]?.startsWith('v') ? afterUpload.slice(1) : afterUpload;
    if (withoutVersion.length === 0) return null;
    const filename = withoutVersion.pop() as string;
    const folder = withoutVersion.join('/');
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    return folder ? `${folder}/${nameWithoutExt}` : nameWithoutExt;
  } catch {
    return null;
  }
}

// Input validation schema
interface UpdateCompanyInfoRequest {
  businessName: string;
  registrationNumber?: string;
  taxId?: string;
  cnssCode?: string;
  website?: string;
  currency: string;
  size: string;
  industry: string;
}

// Validation function
function validateInput(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields validation
  if (!data.businessName || typeof data.businessName !== 'string' || data.businessName.trim().length < 2) {
    errors.push('Business name is required and must be at least 2 characters');
  }

  if (!data.currency || typeof data.currency !== 'string' || data.currency.trim().length === 0) {
    errors.push('Currency is required');
  }

  if (!data.size || typeof data.size !== 'string' || data.size.trim().length === 0) {
    errors.push('Company size is required');
  }

  if (!data.industry || typeof data.industry !== 'string' || data.industry.trim().length === 0) {
    errors.push('Industry is required');
  }

  // Optional fields validation
  if (data.website && typeof data.website === 'string' && data.website.trim().length > 0) {
    try {
      new URL(data.website);
    } catch {
      errors.push('Website must be a valid URL');
    }
  }

  if (data.taxId && typeof data.taxId === 'string' && data.taxId.trim().length > 0 && data.taxId.trim().length < 3) {
    errors.push('Tax ID must be at least 3 characters if provided');
  }

  if (data.cnssCode && typeof data.cnssCode === 'string' && data.cnssCode.trim().length > 0 && data.cnssCode.trim().length < 3) {
    errors.push('CNSS Code must be at least 3 characters if provided');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Input sanitization function
function sanitizeInput(data: UpdateCompanyInfoRequest): UpdateCompanyInfoRequest {
  return {
    businessName: data.businessName.trim(),
    registrationNumber: data.registrationNumber?.trim() || '',
    taxId: data.taxId?.trim() || '',
    cnssCode: data.cnssCode?.trim() || '',
    website: data.website?.trim() || '',
    currency: data.currency.trim(),
    size: data.size.trim(),
    industry: data.industry.trim(),
  };
}

export async function PUT(req: NextRequest) {
  try {
    // Rate limiting check (basic implementation)
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Authenticate user
    const authResult = await getAuthPayload(req);
    if (!authResult.ok) {
      return authResult.response;
    }

    const { payload: userPayload } = authResult;
    const userId = userPayload.userId;

    // Detect content type to support multipart (for logo upload) and JSON
    const contentType = req.headers.get('content-type') || '';
    let body: any = {};
    let uploadedLogoUrl: string | undefined;
    let hasNewLogo = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      body = {
        businessName: (formData.get('businessName') as string) ?? '',
        registrationNumber: ((formData.get('registrationNumber') as string) ?? ''),
        taxId: ((formData.get('taxId') as string) ?? ''),
        cnssCode: ((formData.get('cnssCode') as string) ?? ''),
        website: ((formData.get('website') as string) ?? ''),
        currency: (formData.get('currency') as string) ?? '',
        size: (formData.get('size') as string) ?? '',
        industry: (formData.get('industry') as string) ?? '',
        businessId: Number(formData.get('businessId')),
      };

      const logo = formData.get('logo');
      if (logo && typeof logo !== 'string') {
        if (!isCloudinaryConfigured()) {
          return NextResponse.json(
            { error: 'Image service not configured' },
            { status: 500 }
          );
        }
        try {
          const uploadResult = await uploadToCloudinary(logo as File, 'hrs-app/company-logos');
          uploadedLogoUrl = uploadResult.url;
          hasNewLogo = true;
        } catch (e: any) {
          return NextResponse.json(
            { error: e?.message || 'Failed to upload logo image' },
            { status: 500 }
          );
        }
      }
    } else {
      // Parse JSON
      try {
        body = await req.json();
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid JSON in request body' },
          { status: 400 }
        );
      }
    }

    // Validate input
    const validation = validateInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.errors
        },
        { status: 400 }
      );
    }

    // Business-level auth (update)
    const authz = await authorizeBusinessAccess(userId, body.businessId, 'update');
    if (!authz.ok) return authz.response;
    const businessId = authz.businessId;

    // Sanitize input
    const sanitizedData = sanitizeInput(body as UpdateCompanyInfoRequest);

    // Reuse authorized business instance when available to avoid redundant query
    const business = authz.business || await Business().findOne({ where: { id: businessId } });
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Authorization already enforced by authorizeBusinessAccess

    // If a new logo was uploaded, best-effort delete old one and set new URL
    if (hasNewLogo && uploadedLogoUrl) {
      const previousLogoUrl = (business.get('logoFile') as string) || '';
      if (previousLogoUrl) {
        try {
          const publicId = deriveCloudinaryPublicId(previousLogoUrl);
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
        } catch {}
      }
      (sanitizedData as any).logoFile = uploadedLogoUrl;
    }

    // Update business information
    const updatedBusiness = await business.update(sanitizedData);

    // Log successful update
    console.log(`Company information updated for user ${userId} from IP ${clientIP}`);

    return NextResponse.json({
      success: true,
      message: 'Company information updated successfully',
      data: {
        businessName: updatedBusiness.get('businessName'),
        registrationNumber: updatedBusiness.get('registrationNumber'),
        taxId: updatedBusiness.get('taxId'),
        cnssCode: updatedBusiness.get('cnssCode'),
        website: updatedBusiness.get('website'),
        currency: updatedBusiness.get('currency'),
        size: updatedBusiness.get('size'),
        industry: updatedBusiness.get('industry')
      }
    });

  } catch (error: any) {
    // Log error with context
    console.error('Error updating company information:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to update company information',
        message: 'An internal server error occurred. Please try again later.'
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const authResult = await getAuthPayload(req);
    if (!authResult.ok) {
      return authResult.response;
    }

    const { payload: userPayload } = authResult;
    const userId = userPayload.userId;

    // Require businessId from query and authorize read access
    const { searchParams } = new URL(req.url);
    const businessIdParam = searchParams.get('businessId');
    const authz = await authorizeBusinessAccess(userId, businessIdParam, 'read');
    if (!authz.ok) return authz.response;

    const business = await Business().findOne({
      where: { id: authz.businessId },
      attributes: ['businessName', 'taxId', 'cnssCode', 'website', 'currency', 'size', 'industry', 'logoFile']
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found for this user' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        businessName: business.get('businessName'),
        taxId: business.get('taxId'),
        cnssCode: business.get('cnssCode'),
        website: business.get('website'),
        currency: business.get('currency'),
        size: business.get('size'),
        industry: business.get('industry'),
        logoFile: business.get('logoFile')
      }
    });

  } catch (error: any) {
    console.error('Error fetching company information:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch company information',
        message: 'An internal server error occurred. Please try again later.'
      },
      { status: 500 }
    );
  }
}
