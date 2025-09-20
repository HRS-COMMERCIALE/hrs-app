import { useState } from 'react';

export interface DownloadState {
  isDownloading: boolean;
  progress: number;
  error: string | null;
  downloadUrl: string | null;
  fileInfo: {
    fileName: string;
    fileSize: number;
    expiresAt: string;
  } | null;
}

export interface DownloadOptions {
  fileName?: string;
  onProgress?: (progress: number) => void;
  onSuccess?: (downloadUrl: string) => void;
  onError?: (error: string) => void;
}

export function useDownload() {
  const [state, setState] = useState<DownloadState>({
    isDownloading: false,
    progress: 0,
    error: null,
    downloadUrl: null,
    fileInfo: null,
  });

  const download = async (options: DownloadOptions = {}) => {
    const { fileName = 'WX240PACKHFSQLCS.exe', onProgress, onSuccess, onError } = options;

    setState(prev => ({
      ...prev,
      isDownloading: true,
      progress: 0,
      error: null,
      downloadUrl: null,
      fileInfo: null,
    }));

    try {
      // Step 1: Request download URL
      onProgress?.(10);
      const response = await fetch('/api/download', {
        method: 'GET',
      });

      onProgress?.(30);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get download URL');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Download failed');
      }

      onProgress?.(50);

      // Step 2: Set download information
      setState(prev => ({
        ...prev,
        downloadUrl: data.downloadUrl,
        fileInfo: data.fileInfo,
        progress: 50,
      }));

      onProgress?.(70);

      // Step 3: Create download link and trigger download
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = data.fileInfo.fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onProgress?.(100);

      setState(prev => ({
        ...prev,
        isDownloading: false,
        progress: 100,
      }));

      onSuccess?.(data.downloadUrl);

    } catch (error: any) {
      const errorMessage = error.message || 'Download failed';
      
      setState(prev => ({
        ...prev,
        isDownloading: false,
        error: errorMessage,
        progress: 0,
      }));

      onError?.(errorMessage);
    }
  };

  const reset = () => {
    setState({
      isDownloading: false,
      progress: 0,
      error: null,
      downloadUrl: null,
      fileInfo: null,
    });
  };

  return {
    ...state,
    download,
    reset,
  };
}



