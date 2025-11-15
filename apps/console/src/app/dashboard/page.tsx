'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  User as UserIcon, 
  GitBranch, 
  Settings, 
  Plus,
  Play,
  GitFork,
  Star,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiService, Installation, Repository } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load dashboard data
    const loadDashboardData = async () => {
      try {
        // Load installations from the API
        console.log('Dashboard - Loading installations...');
        const installationsData = await apiService.getInstallations();
        console.log('Dashboard - Installations loaded:', installationsData);
        setInstallations(installationsData);

        // Load repositories from the API
        console.log('Dashboard - Loading repositories...');
        const repositoriesData = await apiService.getRepositories();
        console.log('Dashboard - Repositories loaded:', repositoriesData);
        setRepositories(repositoriesData);
      } catch (error) {
        console.error('Dashboard data load failed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleInstallationClick = (installation: Installation) => {
    router.push(`/dashboard/installation/${installation._id}`);
  };

  const handleRepositoryClick = (repository: Repository) => {
    router.push(`/dashboard/repository/${repository._id}`);
  };

  const handleInstallMonkCI = () => {
    // Check if GitHub App slug is configured
    const appSlug = process.env.NEXT_PUBLIC_GITHUB_APP_SLUG;
    if (!appSlug) {
      alert('GitHub App slug not configured. Please set NEXT_PUBLIC_GITHUB_APP_SLUG in your environment variables.');
      return;
    }
    
    // Redirect to GitHub App installation
    const githubAppUrl = `https://github.com/apps/${appSlug}/installations/new`;
    console.log('Redirecting to GitHub App installation:', githubAppUrl);
    window.open(githubAppUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Your GitHub Installations</h2>
          <p className="text-muted-foreground">
            Select an installation to manage your CI/CD pipelines
          </p>
        </div>

        {installations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Installations Found</h3>
              <p className="text-muted-foreground mb-4">
                You haven't installed Monk CI on any repositories yet.
              </p>
              <Button onClick={handleInstallMonkCI}>
                <Plus className="h-4 w-4 mr-2" />
                Install Monk CI
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {installations.map((installation) => (
              <Card 
                key={installation._id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleInstallationClick(installation)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {installation.accountType === 'Organization' ? (
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <CardTitle className="text-lg">{installation.accountLogin}</CardTitle>
                        <CardDescription>
                          {installation.accountType === 'Organization' ? 'Organization' : 'Personal Account'}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {installation.repositorySelection === 'all' ? 'All Repos' : 'Selected'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Repositories:</span>
                      <span className="font-medium">
                        {installation.repositorySelection === 'all' ? 'All' : 'Selected'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Permissions:</span>
                      <div className="flex space-x-1">
                        {Object.keys(installation.permissions).slice(0, 2).map((perm) => (
                          <Badge key={perm} variant="outline" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                        {Object.keys(installation.permissions).length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{Object.keys(installation.permissions).length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Repositories Section */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-2">Your Repositories</h2>
          <p className="text-muted-foreground">
            All repositories available for CI/CD pipelines
          </p>
        </div>

        {repositories.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <GitBranch className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Repositories Found</h3>
              <p className="text-muted-foreground mb-4">
                No repositories have been synced yet. Check your installations to sync repositories.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {repositories.map((repository) => (
              <Card 
                key={repository._id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleRepositoryClick(repository)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <GitBranch className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <CardTitle className="text-lg">{repository.name}</CardTitle>
                        <CardDescription>
                          {repository.fullName}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {repository.private && (
                        <Badge variant="secondary" className="text-xs">Private</Badge>
                      )}
                      {repository.fork && (
                        <Badge variant="outline" className="text-xs">Fork</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {repository.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {repository.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Language:</span>
                      <span className="font-medium">
                        {repository.language || 'Unknown'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>{repository.stargazersCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GitFork className="h-3 w-3" />
                        <span>{repository.forksCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{repository.watchersCount}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Updated:</span>
                      <span>{new Date(repository.updatedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Play className="h-4 w-4 mr-2" />
                        View Pipelines
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-6">Quick Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <GitBranch className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{installations.length}</p>
                    <p className="text-sm text-muted-foreground">Installations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Play className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Active Pipelines</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Settings className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{repositories.length}</p>
                    <p className="text-sm text-muted-foreground">Repositories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
} 