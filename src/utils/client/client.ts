import { handleTokenRefresh, handleExpiredTokenResponse } from '../help/accessTokenExpired';

export interface ApiResponse<T = any> {
  data?: T;
  success: boolean;
  message?: string;
  error?: string;
  code?: string;
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  retryOnTokenExpiry?: boolean;
  timeout?: number;
}

export interface ChainableConfig extends RequestConfig {
  endpoint?: string;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private config: ChainableConfig;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    this.defaultTimeout = 10000; // 10 seconds
    this.config = {};
  }

  /**
   * Creates a timeout promise for request cancellation
   * This prevents requests from hanging indefinitely
   */
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeout);
    });
  }

  /**
   * Handles request timeout and cancellation
   * Uses Promise.race to compete between the actual request and timeout
   */
  private async withTimeout<T>(
    promise: Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      promise,
      this.createTimeoutPromise(timeout)
    ]);
  }

  /**
   * Prepares headers for the request
   */
  private prepareHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    return headers;
  }

  /**
   * Makes an API request with automatic token refresh and retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      retryOnTokenExpiry = true,
      timeout = this.defaultTimeout
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders = this.prepareHeaders(headers);

    try {
      const requestConfig: RequestInit = {
        method,
        headers: requestHeaders,
        credentials: 'include', // Always include cookies for auth
      };

      if (body && method !== 'GET') {
        requestConfig.body = JSON.stringify(body);
      }

      const response = await this.withTimeout(
        fetch(url, requestConfig),
        timeout
      );

      // Handle token expiry
      if (retryOnTokenExpiry && response.status === 401) {
        const expiredTokenResult = await handleExpiredTokenResponse(response);
        
        if (expiredTokenResult.shouldRetry) {
          // Retry the request once after token refresh
          const retryResponse = await this.withTimeout(
            fetch(url, requestConfig),
            timeout
          );
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            return { data, success: true };
          }
        }
        
        return {
          success: false,
          error: expiredTokenResult.error || 'Authentication failed',
          code: 'AUTH_ERROR'
        };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          code: errorData.code || 'REQUEST_ERROR',
          message: errorData.message,
          errors: errorData.errors,
          data: errorData
        };
      }

      const data = await response.json();
      return { data, success: true };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred',
        code: 'NETWORK_ERROR'
      };
    }
  }

  // Chainable method builders
  get(endpoint?: string) {
    return new RequestBuilder(this, 'GET', endpoint);
  }

  post(endpoint?: string) {
    return new RequestBuilder(this, 'POST', endpoint);
  }

  put(endpoint?: string) {
    return new RequestBuilder(this, 'PUT', endpoint);
  }

  patch(endpoint?: string) {
    return new RequestBuilder(this, 'PATCH', endpoint);
  }

  delete(endpoint?: string) {
    return new RequestBuilder(this, 'DELETE', endpoint);
  }

  // Configuration methods
  timeout(ms: number) {
    this.config.timeout = ms;
    return this;
  }

  headers(customHeaders: Record<string, string>) {
    this.config.headers = { ...this.config.headers, ...customHeaders };
    return this;
  }

  noRetry() {
    this.config.retryOnTokenExpiry = false;
    return this;
  }


  /**
   * Upload file with progress tracking
   */
  async uploadFile(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || 'Upload failed',
          code: 'UPLOAD_ERROR'
        };
      }

      const data = await response.json();
      return { data, success: true };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Upload failed',
        code: 'UPLOAD_ERROR'
      };
    }
  }

  // Internal method to execute requests
  async executeRequest<T>(endpoint: string, config: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...this.config, ...config });
  }
}

class RequestBuilder {
  private client: ApiClient;
  private method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  private endpoint: string;
  private config: RequestConfig;

  constructor(client: ApiClient, method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', endpoint?: string) {
    this.client = client;
    this.method = method;
    this.endpoint = endpoint || '';
    this.config = { method };
  }

  // Endpoint building
  to(path: string) {
    this.endpoint = path.startsWith('/') ? path : `/${path}`;
    return this;
  }

  withId(id: string | number) {
    this.endpoint = `${this.endpoint}/${id}`;
    return this;
  }

  // Configuration methods
  timeout(ms: number) {
    this.config.timeout = ms;
    return this;
  }

  headers(customHeaders: Record<string, string>) {
    this.config.headers = { ...this.config.headers, ...customHeaders };
    return this;
  }

  noRetry() {
    this.config.retryOnTokenExpiry = false;
    return this;
  }

  // Body methods
  withBody(body: any) {
    this.config.body = body;
    return this;
  }

  withData(data: any) {
    this.config.body = data;
    return this;
  }

  // Query parameters
  withQuery(params: Record<string, any>) {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryString.append(key, String(value));
      }
    });
    
    const separator = this.endpoint.includes('?') ? '&' : '?';
    this.endpoint += `${separator}${queryString.toString()}`;
    return this;
  }

  // Execute the request
  async execute<T = any>(): Promise<ApiResponse<T>> {
    return this.client.executeRequest<T>(this.endpoint, this.config);
  }

  // Convenience methods for common patterns
  async send<T = any>(body?: any): Promise<ApiResponse<T>> {
    if (body) {
      this.config.body = body;
    }
    return this.execute<T>();
  }

  async fetch<T = any>(): Promise<ApiResponse<T>> {
    return this.execute<T>();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
