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
  // Normalize ID to string for consistent cache keys
  const normalizedId = String(id);
  return useQuery({
    queryKey: queryKeys.repository(normalizedId),
    queryFn: () => apiService.getRepository(normalizedId),
    enabled: !!id,
    // Use default refetchOnMount behavior (only refetch if stale)
    // This respects staleTime - won't refetch if data is fresh
  });
}

export function useRepositoryRunners(id: string | number) {
  // Normalize ID to string for consistent cache keys
  const normalizedId = String(id);
  return useQuery({
    queryKey: queryKeys.repositoryRunners(normalizedId),
    queryFn: () => apiService.getRepositoryRunners(normalizedId),
    enabled: !!id,
    // Use default refetchOnMount behavior (only refetch if stale)
    // This respects staleTime - won't refetch if data is fresh
  });
}

export function useRepositoryWorkflows(id: string | number) {
  // Normalize ID to string for consistent cache keys
  const normalizedId = String(id);
  return useQuery({
    queryKey: queryKeys.repositoryWorkflows(normalizedId),
    queryFn: () => apiService.getRepositoryWorkflows(normalizedId),
    enabled: !!id,
    // Use default refetchOnMount behavior (only refetch if stale)
    // This respects staleTime - won't refetch if data is fresh
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

