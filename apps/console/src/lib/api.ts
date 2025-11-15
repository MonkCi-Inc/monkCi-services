const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1');


console.log('API_BASE_URL in api', API_BASE_URL);
export interface Repository {
  id: number; // GitHub repository ID (no _id from database)
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
  installationId?: number; // GitHub installation ID this repo belongs to
}

export interface Installation {
  id: number; // GitHub installation ID (no _id from database)
  accountLogin: string;
  accountType: 'User' | 'Organization';
  permissions: Record<string, string>;
  repositorySelection: 'all' | 'selected';
  appSlug?: string;
}

export interface Runner {
  _id: string;
  runnerId: string;
  userId: string;
  installations: string[];
  name: string;
  description?: string;
  status: 'idle' | 'busy' | 'offline' | 'error';
  architecture: 'x86_64' | 'arm64' | 'arm32';
  operatingSystem: 'linux' | 'windows' | 'macos';
  labels: string[];
  capabilities: Record<string, any>;
  environment: Record<string, string>;
  version?: string;
  lastSeenAt?: string;
  lastHeartbeatAt?: string;
  systemInfo: {
    cpuCount?: number;
    memoryGB?: number;
    diskSpaceGB?: number;
    hostname?: string;
    ipAddress?: string;
  };
  currentJob?: {
    jobId: string;
    repository: string;
    workflow: string;
    startedAt: string;
  };
  jobHistory: Array<{
    jobId: string;
    repository: string;
    workflow: string;
    status: string;
    startedAt: string;
    completedAt?: string;
    duration?: number;
  }>;
  totalJobsCompleted: number;
  totalJobsFailed: number;
  totalRuntimeSeconds: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
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
    return this.request<Installation[]>('installations');
  }

  async getInstallation(id: string): Promise<Installation> {
    return this.request<Installation>(`installations/${id}`);
  }

  // Removed syncInstallations - installations are now fetched directly from GitHub API

  // Repositories
  async getRepositories(installationId?: string): Promise<Repository[]> {
    const endpoint = installationId ? `repositories?installationId=${installationId}` : 'repositories';
    return this.request<Repository[]>(endpoint);
  }

  async getRepository(id: string): Promise<Repository> {
    return this.request<Repository>(`repositories/${id}`);
  }

  async getRepositoryRunners(id: string): Promise<{ runners: any[] }> {
    return this.request<{ runners: any[] }>(`repositories/${id}/runners`);
  }

  async getRepositoryWorkflows(id: string): Promise<{ workflows: any[] }> {
    return this.request<{ workflows: any[] }>(`repositories/${id}/workflows`);
  }

  async getWorkflowRuns(repositoryId: string, workflowId: string): Promise<{ runs: any[] }> {
    return this.request<{ runs: any[] }>(`repositories/${repositoryId}/workflows/${workflowId}/runs`);
  }

  async getWorkflowRunLogs(repositoryId: string, runId: string): Promise<{ logs: any }> {
    return this.request<{ logs: any }>(`repositories/${repositoryId}/runs/${runId}/logs`);
  }

  async syncRepositories(installationId: string): Promise<any> {
    return this.request(`repositories/sync/${installationId}`, {
      method: 'POST',
    });
  }

  // GitHub API operations
  async getInstallationOctokit(installationId: number): Promise<any> {
    return this.request(`auth/installation/${installationId}/octokit`);
  }

  async generateInstallationToken(installationId: number): Promise<any> {
    return this.request('auth/installation', {
      method: 'POST',
      body: JSON.stringify({ installationId }),
    });
  }

  // Runners
  async getRunners(): Promise<Runner[]> {
    return this.request<Runner[]>('runners');
  }

  async getRunner(id: string): Promise<Runner> {
    return this.request<Runner>(`runners/${id}`);
  }

  async createRunner(data: {
    name: string;
    description?: string;
    architecture: 'x86_64' | 'arm64' | 'arm32';
    operatingSystem: 'linux' | 'windows' | 'macos';
    labels?: string[];
    capabilities?: Record<string, any>;
    environment?: Record<string, string>;
    version?: string;
    systemInfo?: {
      cpuCount?: number;
      memoryGB?: number;
      diskSpaceGB?: number;
      hostname?: string;
      ipAddress?: string;
    };
  }): Promise<Runner> {
    return this.request<Runner>('runners', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRunner(id: string, data: {
    name?: string;
    description?: string;
    labels?: string[];
    capabilities?: Record<string, any>;
    environment?: Record<string, string>;
    isActive?: boolean;
  }): Promise<Runner> {
    return this.request<Runner>(`runners/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteRunner(id: string): Promise<void> {
    return this.request(`runners/${id}`, {
      method: 'DELETE',
    });
  }

  async generateRegistrationToken(): Promise<{ registrationToken: string }> {
    return this.request<{ registrationToken: string }>('runners/generate-token', {
      method: 'POST',
    });
  }

  async getAvailableRunners(): Promise<Runner[]> {
    return this.request<Runner[]>('runners/available');
  }
}

export const apiService = new ApiService(); 