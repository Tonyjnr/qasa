import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';

export const ErrorType = {
  NETWORK: 'NETWORK',
  API: 'API',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  RATE_LIMIT: 'RATE_LIMIT',
  UNKNOWN: 'UNKNOWN',
  SERVER_UNAVAILABLE: 'SERVER_UNAVAILABLE',
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

export interface AppErrorOptions {
  type: ErrorType;
  message: string;
  originalError?: unknown;
  statusCode?: number;
  retryable: boolean;
  details?: unknown;
}

export class AppError extends Error {
  public type: ErrorType;
  public originalError?: unknown;
  public statusCode?: number;
  public retryable: boolean;
  public details?: unknown;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = 'AppError';
    this.type = options.type;
    this.originalError = options.originalError;
    this.statusCode = options.statusCode;
    this.retryable = options.retryable;
    this.details = options.details;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function handleError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (!axiosError.response) {
      return new AppError({
        type: ErrorType.NETWORK,
        message: 'Network connection failed or server is unreachable.',
        originalError: error,
        retryable: true,
      });
    }

    const status = axiosError.response.status;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = axiosError.response.data as any;

    switch (status) {
      case 400:
        return new AppError({
          type: ErrorType.VALIDATION,
          message: data?.message || 'Invalid request.',
          statusCode: status,
          originalError: error,
          retryable: false,
          details: data?.errors,
        });
      case 401:
      case 403:
        return new AppError({
          type: ErrorType.AUTHENTICATION,
          message: data?.message || 'Authentication failed.',
          statusCode: status,
          originalError: error,
          retryable: false,
        });
      case 404:
        return new AppError({
          type: ErrorType.API,
          message: data?.message || 'Resource not found.',
          statusCode: status,
          originalError: error,
          retryable: false,
        });
      case 429:
        return new AppError({
          type: ErrorType.RATE_LIMIT,
          message: data?.message || 'Rate limit exceeded.',
          statusCode: status,
          originalError: error,
          retryable: true,
        });
      case 500:
      case 502:
      case 503:
      case 504:
        return new AppError({
          type: ErrorType.SERVER_UNAVAILABLE,
          message: 'Server error. Please try again later.',
          statusCode: status,
          originalError: error,
          retryable: true,
        });
      default:
        return new AppError({
          type: ErrorType.API,
          message: data?.message || `Unexpected error: ${status}`,
          statusCode: status,
          originalError: error,
          retryable: status >= 500,
        });
    }
  }

  if (error instanceof Error) {
    return new AppError({
      type: ErrorType.UNKNOWN,
      message: error.message,
      originalError: error,
      retryable: false,
    });
  }

  return new AppError({
    type: ErrorType.UNKNOWN,
    message: 'An unknown error occurred',
    originalError: error,
    retryable: false,
  });
}

export function displayError(error: AppError): void {
  const toastOptions = {
    duration: error.retryable ? 5000 : 4000,
  };

  switch (error.type) {
    case ErrorType.NETWORK:
    case ErrorType.SERVER_UNAVAILABLE:
      toast.error('Connection Issue', { description: error.message, ...toastOptions });
      break;
    case ErrorType.AUTHENTICATION:
      toast.error('Auth Error', { description: error.message, ...toastOptions });
      break;
    case ErrorType.RATE_LIMIT:
      toast.warning('Rate Limit', { description: error.message, ...toastOptions });
      break;
    default:
      toast.error('Error', { description: error.message, ...toastOptions });
  }
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: AppError | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = handleError(error);
      if (!lastError.retryable || i === maxRetries - 1) {
        throw lastError;
      }
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError || new Error("Retry failed");
}
