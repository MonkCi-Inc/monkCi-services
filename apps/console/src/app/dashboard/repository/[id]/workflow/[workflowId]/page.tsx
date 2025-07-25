'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Play,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  User,
  GitBranch,
  Calendar,
  ExternalLink,
  Loader2,
  FileText,
  X,
  Timer
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiService, Repository } from "@/lib/api";

interface GitHubWorkflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: string;
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  badge_url: string;
  deleted_at?: string;
}

interface GitHubWorkflowRun {
  id: number;
  name: string;
  node_id: string;
  head_branch: string;
  head_sha: string;
  run_number: number;
  event: string;
  status: string;
  conclusion: string;
  workflow_id: number;
  check_suite_id: number;
  check_suite_node_id: string;
  url: string;
  html_url: string;
  pull_requests: any[];
  created_at: string;
  updated_at: string;
  actor: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  run_attempt: number;
  referenced_workflows: any[];
  run_started_at: string;
  triggering_actor: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  jobs_url: string;
  logs_url: string;
  check_suite_url: string;
  artifacts_url: string;
  cancel_url: string;
  rerun_url: string;
  previous_attempt_url: string;
  workflow_url: string;
  head_commit: {
    id: string;
    tree_id: string;
    message: string;
    timestamp: string;
    author: {
      name: string;
      email: string;
    };
    committer: {
      name: string;
      email: string;
    };
  };
  repository: any;
  head_repository: any;
}

export default function WorkflowRunsPage({ params }: { params: { id: string; workflowId: string } }) {
  const router = useRouter();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [workflow, setWorkflow] = useState<GitHubWorkflow | null>(null);
  const [runs, setRuns] = useState<GitHubWorkflowRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<GitHubWorkflowRun | null>(null);
  const [runLogs, setRunLogs] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFailureSummary, setShowFailureSummary] = useState(false);

  useEffect(() => {
    const fetchWorkflowData = async () => {
      try {
        // Get repository details
        const repositoryData = await apiService.getRepository(params.id);
        setRepository(repositoryData);
        
        // Get workflows to find the specific workflow
        const workflowsData = await apiService.getRepositoryWorkflows(params.id);
        const targetWorkflow = workflowsData.workflows.find(w => w.id.toString() === params.workflowId);
        setWorkflow(targetWorkflow || null);

        // Get workflow runs
        const runsData = await apiService.getWorkflowRuns(params.id, params.workflowId);
        setRuns(runsData.runs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflowData();
  }, [params.id, params.workflowId]);

  const handleBack = () => {
    router.push(`/dashboard/repository/${params.id}`);
  };

  const handleViewLogs = async (run: GitHubWorkflowRun) => {
    setSelectedRun(run);
    setLoadingLogs(true);
    setRunLogs(null);
    
    try {
      const logsData = await apiService.getWorkflowRunLogs(params.id, run.id.toString());
      setRunLogs(logsData.logs);
    } catch (err) {
      console.error('Error fetching run logs:', err);
      setRunLogs('Error loading logs');
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleCloseLogs = () => {
    setSelectedRun(null);
    setRunLogs(null);
  };

  const handleViewFailureSummary = () => {
    setShowFailureSummary(true);
  };

  const handleCloseFailureSummary = () => {
    setShowFailureSummary(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'queued':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConclusionColor = (conclusion: string) => {
    switch (conclusion) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failure':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'skipped':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateExecutionTime = (createdAt: string, updatedAt: string) => {
    const start = new Date(createdAt);
    const end = new Date(updatedAt);
    const diffMs = end.getTime() - start.getTime();
    
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading workflow runs...</p>
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
              Back to Repository
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!workflow || !repository) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>Workflow Not Found</CardTitle>
            <CardDescription>The requested workflow could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBack} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Repository
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
              <div>
                <h1 className="text-xl font-semibold">
                  {workflow.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {repository.fullName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={workflow.state === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {workflow.state}
              </Badge>
              <Button size="sm" variant="outline" onClick={() => window.open(workflow.html_url, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Workflow Info */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Play className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <CardDescription>
                      {workflow.path}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={workflow.state === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {workflow.state}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(workflow.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(workflow.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Runs:</span>
                  <span className="font-medium">{runs.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Runs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Workflow Runs</h2>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {runs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Runs Found</h3>
                <p className="text-muted-foreground mb-4">
                  This workflow hasn't run yet or there are no runs to display.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {runs.map((run) => (
                <Card key={run.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(run.status)}
                        <div>
                          <h3 className="font-semibold">Run #{run.run_number}</h3>
                          <p className="text-sm text-muted-foreground">
                            {run.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(run.status)}>
                          {run.status}
                        </Badge>
                        {run.conclusion && (
                          <Badge className={getConclusionColor(run.conclusion)}>
                            {run.conclusion}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Actor:</span>
                        <span className="font-medium">{run.actor.login}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Branch:</span>
                        <span className="font-medium">{run.head_branch}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Started:</span>
                        <span className="font-medium">
                          {formatDateTime(run.run_started_at)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Timer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">
                          {run.status === 'completed' || run.status === 'failed' 
                            ? calculateExecutionTime(run.created_at, run.updated_at)
                            : 'Running...'
                          }
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-medium">
                          {formatDateTime(run.created_at)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Updated:</span>
                        <span className="font-medium">
                          {formatDateTime(run.updated_at)}
                        </span>
                      </div>
                    </div>

                    {run.head_commit && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Commit Message:</p>
                        <p className="text-sm text-muted-foreground">
                          {run.head_commit.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {run.head_commit.id.substring(0, 8)} • {run.head_commit.author.name}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Event: {run.event}</span>
                        <span>•</span>
                        <span>Attempt: {run.run_attempt}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(run.html_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on GitHub
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewLogs(run)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Logs
                        </Button>
                        {run.conclusion === 'failure' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={handleViewFailureSummary}
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            View Failure Summary
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Logs Modal */}
      {selectedRun && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
            <CardHeader className="flex justify-between items-center border-b">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-lg">Run #{selectedRun.run_number} Logs</CardTitle>
                  <CardDescription>
                    {selectedRun.name} • {selectedRun.head_branch}
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCloseLogs}>
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              {loadingLogs ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading logs...</p>
                  </div>
                </div>
              ) : runLogs ? (
                <div className="h-full overflow-auto">
                  <pre className="p-4 text-sm font-mono bg-muted h-full overflow-auto whitespace-pre-wrap">
                    {runLogs}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Logs Available</h3>
                    <p className="text-muted-foreground">
                      Logs are not available for this run or have been deleted.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Failure Summary Modal */}
      {showFailureSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
            <CardHeader className="flex justify-between items-center border-b">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <CardTitle className="text-lg">Failure Summary</CardTitle>
                  <CardDescription>
                    Analysis of the failed workflow run
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCloseFailureSummary}>
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Failure Analysis</h3>
                  <p className="text-red-700">
                    This workflow run failed due to a rate limiting error (HTTP 429) when trying to access Hugging Face Hub resources.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Error Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Error Type:</span>
                        <span className="text-sm text-gray-700">HTTP 429 - Too Many Requests</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Component:</span>
                        <span className="text-sm text-gray-700">Hugging Face Hub API</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Endpoint:</span>
                        <span className="text-sm text-gray-700">https://huggingface.co/bert-base-cased/resolve/main/config.json</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Library:</span>
                        <span className="text-sm text-gray-700">transformers (huggingface_hub)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Error Stack Trace</h4>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
{`.venv/lib/python3.11/site-packages/transformers/utils/hub.py:445: OSError
________________ HarnessTestCase.test_load_text_classification _________________

response = <Response [429]>, endpoint_name = None

    def hf_raise_for_status(response: Response, endpoint_name: Optional[str] = None) -> None:
        """
        Internal version of \`response.raise_for_status()\` that will refine a
        potential HTTPError. Raised exception will be an instance of \`HfHubHTTPError\`.
    
        This helper is meant to be the unique method to raise_for_status when making a call
        to the Hugging Face Hub.
    
        Example:
        \`\`\`py
            import requests
            from huggingface_hub.utils import get_session, hf_raise_for_status, HfHubHTTPError
    
            response = get_session().post(...)
            try:
                hf_raise_for_status(response)
            except HfHubHTTPError as e:
                print(str(e)) # formatted message
                e.request_id, e.server_message # details returned by server
    
                # Complete the error message with additional information once it's raised
                e.append_to_message("\\n\`create_commit\` expects the repository to exist.")
                raise
        \`\`\`
    
        Args:
            response (\`Response\`):
                Response from the server.
            endpoint_name (\`str\`, *optional*):
                Name of the endpoint that has been called. If provided, the error message
                will be more complete.
    
        <Tip warning={true}>
    
        Raises when the request has failed:
    
            - [\`~utils.RepositoryNotFoundError\`]
                If the repository to download from cannot be found. This may be because it
                doesn't exist, because \`repo_type\` is not set correctly, or because the repo
                is \`private\` and you do not have access.
            - [\`~utils.GatedRepoError\`]
                If the repository exists but is gated and the user is not on the authorized
                list.
            - [\`~utils.RevisionNotFoundError\`]
                If the repository exists but the revision couldn't be find.
            - [\`~utils.EntryNotFoundError\`]
                If the repository exists but the entry (e.g. the requested file) couldn't be
                find.
            - [\`~utils.BadRequestError\`]
                If request failed with a HTTP 400 BadRequest error.
            - [\`~utils.HfHubHTTPError\`]
                If request failed for a reason not listed above.
    
        </Tip>
        """
        try:
>           response.raise_for_status()

.venv/lib/python3.11/site-packages/huggingface_hub/utils/_errors.py:304: 
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

self = <Response [429]>

    def raise_for_status(self):
        """Raises :class:\`HTTPError\`, if one occurred."""

        http_error_msg = ""
        if isinstance(self.reason, bytes):
            # We attempt to decode utf-8 first because some servers
            # choose to localize their reason strings. If the string
            # isn't utf-8, we fall back to iso-8859-1 for all other
            # encodings. (See PR #3538)
            try:
                reason = self.reason.decode("utf-8")
            except UnicodeDecodeError:
                reason = self.reason.decode("iso-8859-1")
        else:
            reason = self.reason

        if 400 <= self.status_code < 500:
            http_error_msg = (
                f"{self.status_code} Client Error: {reason} for url: {self.url}"
            )

        elif 500 <= self.status_code < 600:
            http_error_msg = (
                f"{self.status_code} Server Error: {reason} for url: {self.url}"
            )

        if http_error_msg:
>           raise HTTPError(http_error_msg, response=self)
E           requests.exceptions.HTTPError: 429 Client Error: Too Many Requests for url: https://huggingface.co/bert-base-cased/resolve/main/config.json`}
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Root Cause</h4>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <ul className="text-sm text-orange-700 space-y-2">
                        <li>• Rate limiting from Hugging Face Hub API</li>
                        <li>• Too many requests to the same endpoint</li>
                        <li>• Missing or invalid authentication token</li>
                        <li>• CI environment hitting API limits</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Solutions</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <ul className="text-sm text-blue-700 space-y-2">
                        <li>• Add HF_TOKEN environment variable to CI</li>
                        <li>• Implement request caching in CI</li>
                        <li>• Use local model caching</li>
                        <li>• Add retry logic with exponential backoff</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Next Steps</h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      1. Add HF_TOKEN to your CI environment variables<br/>
                      2. Configure model caching to avoid repeated downloads<br/>
                      3. Implement proper error handling for rate limits<br/>
                      4. Consider using a different model or local alternatives
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 