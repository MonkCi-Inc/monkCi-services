import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1');

console.log('API_BASE_URL in src/lib/auth.ts', API_BASE_URL);
export interface User {
  userId?: string;
  githubId?: number;
  login?: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string;
  emailAuthId?: string;
  installations?: Installation[];
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
  user: User | null;
  emailAuth?: {
    id: string;
    email: string;
    name?: string;
  };
  hasGitHubLinked: boolean;
  installations?: Installation[];
}

class AuthService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('url in src/lib/auth.ts', url);
    console.log('API_BASE_URL in src/lib/auth.ts', API_BASE_URL);
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

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // Redirect to GitHub OAuth
  initiateGitHubAuth(emailAuthId?: string): void {
    const authUrl = `${API_BASE_URL}/auth/github${emailAuthId ? `?emailAuthId=${emailAuthId}` : ''}`;
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

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-jwt-secret-for-development-only';

export interface UserSession {
  userId?: string; // MongoDB ObjectId as string (optional for email-only users)
  githubId?: number; // Optional for email-only users
  login?: string; // Optional for email-only users
  name: string;
  email: string;
  avatarUrl?: string; // Optional for email-only users
  emailAuthId?: string; // Optional for GitHub-only users
  installations?: Array<{
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

/**
 * Determines the appropriate redirect path based on user authentication state
 * @param user - The current user object from the API
 * @returns The redirect path or null if no redirect is needed
 */
export function getRedirectPath(user: User | null): string | null {
  if (!user) {
    return '/auth/signin';
  }

  // Check if both emailAuthId and userId are null or empty
  const hasEmailAuth = user.emailAuthId && user.emailAuthId.trim() !== '';
  const hasUserId = user.userId && user.userId.trim() !== '';

  // If both are null/empty, redirect to signin
  if (!hasEmailAuth && !hasUserId) {
    return '/auth/signin';
  }
  // If emailAuth exists but no GitHub connection (no userId or githubId)
  if (hasEmailAuth && (!hasUserId || !user.githubId)) {
    return '/auth/connect-github';
  }
  // If both IDs exist but no installations
  if (hasEmailAuth && hasUserId && user.githubId) {
    const hasInstallations = user.installations && user.installations.length > 0;
    if (!hasInstallations) {
      // Redirect to GitHub App installation
      const appSlug = process.env.NEXT_PUBLIC_GITHUB_APP_SLUG;
      if (appSlug) {
       
         return `https://github.com/apps/${appSlug}/installations/new`;
      }
      // If app slug is not configured, still redirect to connect-github
      return '/auth/connect-github';
    }
  }

  // If all are present (emailAuthId, userId, githubId, and installations), 
  // ensure user does NOT stay on /auth/signin or /auth/connect-github,
  // and should be redirected to /dashboard
  if (hasEmailAuth && hasUserId && user.githubId && user.installations && user.installations.length > 0) {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath === '/auth/signin' || currentPath === '/auth/connect-github') {
        return '/dashboard';
      }
    }
  }

  return null;
}

/**
 * Hook-like function to handle user redirect logic in client components
 * @param user - The current user object
 * @param router - Next.js router instance
 * @param currentPath - The current pathname to avoid redirecting to the same page
 * @returns true if redirect was performed, false otherwise
 */
export function handleUserRedirect(
  user: User | null,
  router: any,
  currentPath?: string
): boolean {
  const redirectPath = getRedirectPath(user);
  
  if (redirectPath && redirectPath !== currentPath) {
    // Check if it's an external URL (GitHub App installation)
    if (redirectPath.startsWith('http://') || redirectPath.startsWith('https://')) {
      window.location.href = redirectPath;
      return true;
    }
    
    router.push(redirectPath);
    return true;
  }
  
  return false;
} 