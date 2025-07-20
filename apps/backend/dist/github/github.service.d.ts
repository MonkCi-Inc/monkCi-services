export declare class GitHubService {
    private appId;
    private privateKey;
    constructor();
    private generateJWT;
    getInstallationOctokit(installationId: number): Promise<any>;
    getUserInstallations(accessToken: string): Promise<any>;
    getOrganizationInstallations(accessToken: string, orgLogin: string): Promise<any>;
    getAllInstallations(accessToken: string): Promise<any[]>;
    getInstallationRepositories(installationId: number): Promise<any>;
    getUserInfo(accessToken: string): Promise<any>;
    getUserOrganizations(accessToken: string, orgUrl: string): Promise<any>;
    getUserRepositories(accessToken: string, reposUrl: string): Promise<any>;
    exchangeCodeForToken(code: string): Promise<any>;
    getRepositoryDetails(installationId: number, owner: string, repo: string): Promise<any>;
    createCheckRun(installationId: number, owner: string, repo: string, sha: string, checkRunData: any): Promise<any>;
    updateCheckRun(installationId: number, owner: string, repo: string, checkRunId: number, updateData: any): Promise<any>;
    getRepositoryRunners(installationId: number, owner: string, repo: string): Promise<any>;
    getRepositoryRunner(installationId: number, owner: string, repo: string, runnerId: number): Promise<any>;
    getRepositoryWorkflows(installationId: number, owner: string, repo: string): Promise<any>;
    getWorkflowRuns(installationId: number, owner: string, repo: string, workflowId: number): Promise<any>;
    getWorkflowRunLogs(installationId: number, owner: string, repo: string, runId: number): Promise<any>;
}
