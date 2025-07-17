const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Repository {
  _id: string;
  repositoryId: number;
  name: string;
  fullName: string;
  private: boolean;
  description?: string;
  defaultBranch: string;
  language?: string;
  topics: string[];
  archived: boolean;
  disabled: boolean;
  fork: boolean;
  size: number;
  stargazersCount: number;
  watchersCount: number;
  forksCount: number;
  openIssuesCount: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  lastSyncAt: string;
}

export interface Installation {
  _id: string;
  installationId: number;
  accountLogin: string;
  accountType: 'User' | 'Organization';
  permissions: Record<string, string>;
  repositorySelection: 'all' | 'selected';
  createdAt: string;
  updatedAt: string;
}

class ApiService {
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

  // Installations
  async getInstallations(): Promise<Installation[]> {
    return this.request<Installation[]>('/installations');
  }

  async getInstallation(id: string): Promise<Installation> {
    return this.request<Installation>(`/installations/${id}`);
  }

  // Repositories
  async getRepositories(installationId?: string): Promise<Repository[]> {
    const endpoint = installationId ? `/repositories?installationId=${installationId}` : '/repositories';
    return this.request<Repository[]>(endpoint);
  }

  async getRepository(id: string): Promise<Repository> {
    return this.request<Repository>(`/repositories/${id}`);
  }

  async syncRepositories(installationId: string): Promise<any> {
    return this.request(`/repositories/sync/${installationId}`, {
      method: 'POST',
    });
  }

  // GitHub API operations
  async getInstallationOctokit(installationId: number): Promise<any> {
    return this.request(`/auth/installation/${installationId}/octokit`);
  }

  async generateInstallationToken(installationId: number): Promise<any> {
    return this.request('/auth/installation', {
      method: 'POST',
      body: JSON.stringify({ installationId }),
    });
  }
}

export const apiService = new ApiService(); 