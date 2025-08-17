import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to check if an error is an API error with a specific status
export function isApiError(error: unknown, status?: number): error is { response: { status: number; data?: any } } {
  if (!error || typeof error !== 'object') return false;
  
  if (!('response' in error)) return false;
  
  const response = (error as any).response;
  if (!response || typeof response !== 'object') return false;
  
  if (!('status' in response)) return false;
  
  if (status !== undefined && response.status !== status) return false;
  
  return true;
}
