'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  GitBranch, 
  Settings, 
  Play,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiService, Repository, Installation } from "@/lib/api";

export default function InstallationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [installation, setInstallation] = useState<Installation | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstallationData = async () => {
      try {
        // Get installation details
        const installationData = await apiService.getInstallation(params.id);
        setInstallation(installationData);
        
        // Get repositories for this installation
        const reposData = await apiService.getRepositories(params.id);
        setRepositories(reposData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInstallationData();
  }, [params.id]);

  const handleBack = () => {
    router.push('/dashboard');
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await apiService.syncRepositories(params.id);
      
      // Refresh repositories after sync
      const reposData = await apiService.getRepositories(params.id);
      setRepositories(reposData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading installation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-destructive rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive-foreground" />
            </div>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBack} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!installation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">
                {installation.accountLogin} Installation
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {installation.accountType}
              </Badge>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleSync}
                disabled={syncing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync'}
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Repositories</h2>
          <p className="text-muted-foreground">
            Manage CI/CD pipelines for your repositories
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
                This installation doesn't have access to any repositories yet.
              </p>
              <Button onClick={handleSync} disabled={syncing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Repositories'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map((repo) => (
              <Card key={repo._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{repo.name}</CardTitle>
                      <CardDescription>{repo.fullName}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant={repo.private ? "secondary" : "outline"}>
                        {repo.private ? "Private" : "Public"}
                      </Badge>
                      {repo.archived && (
                        <Badge variant="outline" className="text-xs">
                          Archived
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {repo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Language:</span>
                      <span className="font-medium">{repo.language || 'Unknown'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Stars:</span>
                      <span className="font-medium">{repo.stargazersCount}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Forks:</span>
                      <span className="font-medium">{repo.forksCount}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last updated:</span>
                      <span className="font-medium">
                        {new Date(repo.updatedAt).toLocaleDateString()}
                      </span>
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
      </main>
    </div>
  );
} 