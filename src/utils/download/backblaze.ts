import { env } from '../../libs/Env';

export interface DownloadInfo {
  fileName: string;
  fileSize: number;
  downloadUrl: string;
  expiresAt: Date;
}

export interface BackblazeConfig {
  applicationKeyId: string;
  applicationKey: string;
  bucketName: string;
  bucketId: string;
  endpoint: string;
}

export class BackblazeDownloadService {
  private config: BackblazeConfig;
  private authToken: string | null = null;
  private apiUrl: string | null = null;
  private downloadUrl: string | null = null;

  constructor() {
    this.config = {
      applicationKeyId: env.BACKBLAZE_APPLICATION_KEY_ID || '',
      applicationKey: env.BACKBLAZE_APPLICATION_KEY || '',
      bucketName: env.BACKBLAZE_BUCKET_NAME || 'HRSCommerciale-Desktop',
      bucketId: env.BACKBLAZE_BUCKET_ID || '',
      endpoint: env.BACKBLAZE_ENDPOINT || '',
    };
  }

  /**
   * Authenticate with Backblaze B2 API
   */
  private async authenticate(): Promise<void> {
    if (this.authToken && this.apiUrl && this.downloadUrl) {
      return; // Already authenticated
    }

    try {
      const response = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.config.applicationKeyId}:${this.config.applicationKey}`).toString('base64')}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        console.error('Backblaze auth failed body:', errorBody);
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
      }

      const authData = await response.json();
      this.authToken = authData.authorizationToken;
      this.apiUrl = authData.apiUrl;
      this.downloadUrl = authData.downloadUrl;
    } catch (error) {
      console.error('Backblaze authentication error:', error);
      throw new Error('Failed to authenticate with Backblaze B2');
    }
  }

  /**
   * Get file information from Backblaze B2
   */
  async getFileInfo(fileName: string): Promise<DownloadInfo | null> {
    await this.authenticate();

    try {
      const response = await fetch(`${this.apiUrl}/b2api/v2/b2_list_file_names`, {
        method: 'POST',
        headers: {
          'Authorization': this.authToken!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucketId: this.config.bucketId,
          startFileName: fileName,
          maxFileCount: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get file info: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const file = data.files?.find((f: any) => f.fileName === fileName);

      if (!file) {
        return null;
      }

      return {
        fileName: file.fileName,
        fileSize: file.size,
        downloadUrl: `${this.downloadUrl}/file/${this.config.bucketName}/${fileName}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      throw new Error('Failed to get file information');
    }
  }

  /**
   * Generate a secure download URL with authentication
   */
  async generateDownloadUrl(fileName: string): Promise<string> {
    await this.authenticate();

    try {
      const response = await fetch(`${this.apiUrl}/b2api/v2/b2_get_download_authorization`, {
        method: 'POST',
        headers: {
          'Authorization': this.authToken!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucketId: this.config.bucketId,
          fileNamePrefix: fileName,
          validDurationInSeconds: 3600, // 1 hour
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate download URL: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return `${this.downloadUrl}/file/${this.config.bucketName}/${fileName}?Authorization=${data.authorizationToken}`;
    } catch (error) {
      console.error('Error generating download URL:', error);
      throw new Error('Failed to generate download URL');
    }
  }

  /**
   * Get the public download URL (if bucket is public)
   */
  getPublicDownloadUrl(fileName: string): string {
    const base = this.downloadUrl || 'https://f003.backblazeb2.com';
    return `${base}/file/${this.config.bucketName}/${fileName}`;
  }

  /**
   * Verify file exists and get basic info
   */
  async verifyFile(fileName: string): Promise<boolean> {
    try {
      const fileInfo = await this.getFileInfo(fileName);
      return fileInfo !== null;
    } catch (error) {
      console.error('Error verifying file:', error);
      return false;
    }
  }
}

// Export singleton instance
export const backblazeService = new BackblazeDownloadService();

// Export utility functions
export async function getDownloadInfo(fileName: string): Promise<DownloadInfo | null> {
  return await backblazeService.getFileInfo(fileName);
}

export async function generateSecureDownloadUrl(fileName: string): Promise<string> {
  return await backblazeService.generateDownloadUrl(fileName);
}

export function getPublicDownloadUrl(fileName: string): string {
  return backblazeService.getPublicDownloadUrl(fileName);
}

export async function verifyFileExists(fileName: string): Promise<boolean> {
  return await backblazeService.verifyFile(fileName);
}



