import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, Installation, Repository } from './api';

// Query keys for consistent cache management
export const queryKeys = {
  installations: ['installations'] as const,
  installation: (id: string | number) => ['installations', id] as const,
  repositories: (installationId?: string | number) => 
    installationId ? ['repositories', installationId] as const : ['repositories'] as const,
  repository: (id: string | number) => ['repositories', id] as const,
  repositoryRunners: (id: string | number) => ['repositories', id, 'runners'] as const,
  repositoryWorkflows: (id: string | number) => ['repositories', id, 'workflows'] as const,
  workflowRuns: (repositoryId: string | number, workflowId: string | number) => 
    ['repositories', repositoryId, 'workflows', workflowId, 'runs'] as const,
};

// Installations queries
export function useInstallations() {
  return useQuery({
    queryKey: queryKeys.installations,
    queryFn: () => apiService.getInstallations(),
  });
}

export function useInstallation(id: string | number) {
  return useQuery({
    queryKey: queryKeys.installation(id),
    queryFn: () => apiService.getInstallation(String(id)),
    enabled: !!id,
  });
}

// Repositories queries
export function useRepositories(installationId?: string | number) {
  return useQuery({
    queryKey: queryKeys.repositories(installationId),
    queryFn: () => apiService.getRepositories(installationId ? String(installationId) : undefined),
  });
}

export function useRepository(id: string | number) {
  return useQuery({
    queryKey: queryKeys.repository(id),
    queryFn: () => apiService.getRepository(String(id)),
    enabled: !!id,
  });
}

export function useRepositoryRunners(id: string | number) {
  return useQuery({
    queryKey: queryKeys.repositoryRunners(id),
    queryFn: () => apiService.getRepositoryRunners(String(id)),
    enabled: !!id,
  });
}

export function useRepositoryWorkflows(id: string | number) {
  return useQuery({
    queryKey: queryKeys.repositoryWorkflows(id),
    queryFn: () => apiService.getRepositoryWorkflows(String(id)),
    enabled: !!id,
  });
}

export function useWorkflowRuns(repositoryId: string | number, workflowId: string | number) {
  return useQuery({
    queryKey: queryKeys.workflowRuns(repositoryId, workflowId),
    queryFn: () => apiService.getWorkflowRuns(String(repositoryId), String(workflowId)),
    enabled: !!repositoryId && !!workflowId,
  });
}

export function useWorkflowRunLogs(repositoryId: string | number, runId: string | number) {
  return useQuery({
    queryKey: ['repositories', repositoryId, 'runs', runId, 'logs'] as const,
    queryFn: () => apiService.getWorkflowRunLogs(String(repositoryId), String(runId)),
    enabled: !!repositoryId && !!runId,
  });
}

// Mutations for refreshing data
export function useRefreshRepositories() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (installationId?: string | number) => {
      return apiService.getRepositories(installationId ? String(installationId) : undefined);
    },
    onSuccess: (data, installationId) => {
      // Invalidate and refetch repositories
      queryClient.setQueryData(queryKeys.repositories(installationId), data);
      // Also invalidate all repositories to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.repositories() });
    },
  });
}

export function useRefreshInstallations() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      return apiService.getInstallations();
    },
    onSuccess: (data) => {
      // Update installations cache
      queryClient.setQueryData(queryKeys.installations, data);
    },
  });
}

