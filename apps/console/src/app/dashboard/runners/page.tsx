'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Settings, 
  Play,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Cpu,
  HardDrive,
  Monitor,
  Server
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiService, Runner } from "@/lib/api";

export default function RunnersPage() {
  const router = useRouter();
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRunners = async () => {
      try {
        const runnersData = await apiService.getRunners();
        setRunners(runnersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRunners();
  }, []);

  const handleBack = () => {
    router.push('/dashboard');
  };

  const handleCreateRunner = () => {
    router.push('/dashboard/runners/new');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-blue-100 text-blue-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOSIcon = (os: string) => {
    switch (os) {
      case 'linux':
        return <Server className="h-4 w-4" />;
      case 'windows':
        return <Monitor className="h-4 w-4" />;
      case 'macos':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading runners...</p>
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
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">M</span>
              </div>
              <h1 className="text-xl font-semibold">Self-Hosted Runners</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button onClick={handleCreateRunner}>
                <Plus className="h-4 w-4 mr-2" />
                Add Runner
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Your Runners</h2>
          <p className="text-muted-foreground">
            Manage your self-hosted CI/CD runners
          </p>
        </div>

        {runners.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Server className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Runners Found</h3>
              <p className="text-muted-foreground mb-4">
                You haven't set up any self-hosted runners yet.
              </p>
              <Button onClick={handleCreateRunner}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Runner
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {runners.map((runner) => (
              <Card key={runner._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getOSIcon(runner.operatingSystem)}
                      <div>
                        <CardTitle className="text-lg">{runner.name}</CardTitle>
                        <CardDescription>
                          {runner.operatingSystem} • {runner.architecture}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(runner.status)}
                      <Badge className={getStatusColor(runner.status)}>
                        {runner.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {runner.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {runner.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Cpu className="h-3 w-3" />
                        <span>{runner.systemInfo.cpuCount || '?'} cores</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HardDrive className="h-3 w-3" />
                        <span>{runner.systemInfo.memoryGB || '?'} GB</span>
                      </div>
                    </div>

                    {runner.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {runner.labels.slice(0, 3).map((label) => (
                          <Badge key={label} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                        {runner.labels.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{runner.labels.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Jobs completed:</span>
                      <span>{runner.totalJobsCompleted}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Success rate:</span>
                      <span>
                        {runner.totalJobsCompleted > 0
                          ? Math.round(
                              ((runner.totalJobsCompleted - runner.totalJobsFailed) /
                                runner.totalJobsCompleted) *
                                100
                            )
                          : 0}%
                      </span>
                    </div>

                    {runner.lastSeenAt && (
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Last seen:</span>
                        <span>{new Date(runner.lastSeenAt).toLocaleDateString()}</span>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1" disabled={!runner.isActive}>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4" />
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
          <h3 className="text-xl font-semibold mb-6">Runner Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{runners.length}</p>
                    <p className="text-sm text-muted-foreground">Total Runners</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {runners.filter(r => r.status === 'idle').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Play className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {runners.filter(r => r.status === 'busy').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Running Jobs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {runners.reduce((total, r) => total + r.totalJobsCompleted, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Jobs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 