// Simple auth utilities
import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Helper to handle auth errors
function handleAuthError(error: any): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Network error (backend not reachable)
    if (!axiosError.response) {
      throw new Error(`Cannot connect to backend at ${API_URL}. Please ensure the backend server is running.`);
    }

    // HTTP error with response
    const data = axiosError.response.data as any;
    const message = data?.detail || data?.message || axiosError.message;
    throw new Error(message);
  }

  throw error;
}

export async function login(email: string, password: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password }, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const { access_token } = response.data;
    localStorage.setItem('auth_token', access_token);
    return { token: access_token };
  } catch (error) {
    handleAuthError(error);
  }
}

export async function register(email: string, password: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password }, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const { access_token } = response.data;
    localStorage.setItem('auth_token', access_token);
    return { token: access_token };
  } catch (error) {
    handleAuthError(error);
  }
}

export function logout() {
  localStorage.removeItem('auth_token');
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
}

export function getCurrentUser() {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Phase III: JWT 'sub' claim contains user_id (string)
    return {
      id: payload.sub,      // User ID from JWT
      email: payload.email || payload.sub  // Email if available, fallback to sub
    };
  } catch {
    return null;
  }
}
