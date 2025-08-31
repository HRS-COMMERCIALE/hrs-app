import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Upload a file to Cloudinary and return the upload result
 * @param file - The file to upload (File object from FormData)
 * @param folder - Optional folder path in Cloudinary (default: 'hrs-app')
 * @returns Promise<CloudinaryUploadResult>
 */
export async function uploadToCloudinary(
  file: File, 
  folder: string = 'hrs-app'
): Promise<CloudinaryUploadResult> {
  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Convert buffer to base64 string
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;
    
    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: folder,
          resource_type: 'auto',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          transformation: [
            { quality: 'auto:good' }, // Optimize quality
            { fetch_format: 'auto' }  // Auto-format based on browser support
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              secure_url: result.secure_url,
              format: result.format,
              width: result.width,
              height: result.height,
              bytes: result.bytes
            });
          } else {
            reject(new Error('Upload failed with no result'));
          }
        }
      );
    });
    
    console.log('✅ File uploaded to Cloudinary:', {
      filename: file.name,
      size: file.size,
      url: result.url,
      public_id: result.public_id
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ Error uploading to Cloudinary:', error);
    throw new Error(`Failed to upload file to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete a file from Cloudinary using public_id
 * @param publicId - The public_id from upload result
 * @returns Promise<boolean>
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await new Promise<{ result: string }>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
    
    console.log('✅ File deleted from Cloudinary:', publicId, result);
    return true;
    
  } catch (error) {
    console.error('❌ Error deleting from Cloudinary:', error);
    return false;
  }
}

/**
 * Get Cloudinary configuration status
 * @returns boolean indicating if Cloudinary is properly configured
 */
export function isCloudinaryConfigured(): boolean {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && 
            process.env.CLOUDINARY_API_KEY && 
            process.env.CLOUDINARY_API_SECRET);
}
