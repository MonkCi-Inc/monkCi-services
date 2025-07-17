import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface User {
  id: string;
  githubId: number;
  login: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Installation {
  id: number;
  accountLogin: string;
  accountType: 'User' | 'Organization';
  permissions: Record<string, string>;
  repositorySelection: 'all' | 'selected';
}

export interface AuthResponse {
  access_token: string;
  user: User;
  installations: Installation[];
}

class AuthService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for JWT
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
  }

  async generateInstallationToken(installationId: number): Promise<any> {
    return this.request('/auth/installation', {
      method: 'POST',
      body: JSON.stringify({ installationId }),
    });
  }

  async getInstallationOctokit(installationId: number): Promise<any> {
    return this.request(`/auth/installation/${installationId}/octokit`);
  }

  // Redirect to GitHub OAuth
  initiateGitHubAuth(state?: string): void {
    const authUrl = `${API_BASE_URL}/auth/github${state ? `?state=${state}` : ''}`;
    window.location.href = authUrl;
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface UserSession {
  userId: string; // MongoDB ObjectId as string
  githubId: number;
  login: string;
  name: string;
  email: string;
  avatarUrl: string;
  installations: Array<{
    id: number;
    accountLogin: string;
    accountType: 'User' | 'Organization';
    permissions: Record<string, string>;
    repositorySelection: 'all' | 'selected';
  }>;
}

export interface InstallationToken {
  token: string;
  expiresAt: string;
  permissions: Record<string, string>;
  repositories: Array<{
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    description?: string;
    language?: string;
    archived: boolean;
    disabled: boolean;
    fork: boolean;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    open_issues_count: number;
    created_at: string;
    updated_at: string;
    pushed_at: string;
  }>;
}

export function verifyToken(token: string): UserSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserSession;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function getUserFromRequest(request: NextRequest): UserSession | null {
  const token = request.cookies.get('monkci_token')?.value;
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return true;
    }
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}

export async function refreshUserSession(userSession: UserSession): Promise<UserSession | null> {
  try {
    // For now, we'll return the existing session
    // In a real implementation, you might want to refresh the GitHub token
    // and update the installations list
    return userSession;
  } catch (error) {
    console.error('Failed to refresh user session:', error);
    return null;
  }
} 