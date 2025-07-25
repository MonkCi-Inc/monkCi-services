import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GitHubService {
  private appId: string;
  private privateKey: string;

  constructor() {
    this.appId = process.env.GITHUB_APP_ID;
    this.privateKey = process.env.GITHUB_PRIVATE_KEY;
  }

  private generateJWT(): string {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iat: now,
      exp: now + 600, // 10 minutes
      iss: this.appId,
    };
    
    return jwt.sign(payload, this.privateKey, { algorithm: 'RS256' });
  }

  async getInstallationOctokit(installationId: number): Promise<any> {
    const jwt = this.generateJWT();
    
    // Get installation access token
    const response = await axios.post(
      `https://api.github.com/app/installations/${installationId}/access_tokens`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const accessToken = response.data.token;
    
    // Dynamic import to avoid ES module issues
    const { Octokit } = await import('@octokit/rest');
    
    return new Octokit({
      auth: accessToken,
    });
  }

  async getUserInstallations(accessToken: string) {
    const response = await axios.get('https://api.github.com/user/installations', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return response.data.installations || [];
  }

  async getOrganizationInstallations(accessToken: string, orgLogin: string) {
    try {
      const response = await axios.get(`https://api.github.com/orgs/${orgLogin}/installations`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      return response.data.installations || [];
    } catch (error) {
      console.log(`GitHub Service - No installations found for organization ${orgLogin}:`, error.message);
      return [];
    }
  }

  async getAllInstallations(accessToken: string) {
    console.log('GitHub Service - Getting all installations for user');
    
    // Get user's personal installations
    const userInstallations = await this.getUserInstallations(accessToken);
    console.log(`GitHub Service - Found ${userInstallations.length} personal installations`);
    
    // Get user's organizations
    const organizations = await this.getUserOrganizations(accessToken, 'https://api.github.com/user/orgs');
    console.log(`GitHub Service - Found ${organizations.length} organizations:`, organizations.map(org => org.login));
    
    // Get installations for each organization
    const orgInstallations = [];
    for (const org of organizations) {
      try {
        console.log(`GitHub Service - Checking installations for organization: ${org.login}`);
        const orgInstalls = await this.getOrganizationInstallations(accessToken, org.login);
        console.log(`GitHub Service - Found ${orgInstalls.length} installations for organization ${org.login}`);
        
        if (orgInstalls.length > 0) {
          console.log(`GitHub Service - Organization ${org.login} installations:`, orgInstalls.map(inst => ({
            id: inst.id,
            account: inst.account.login,
            app_slug: inst.app_slug
          })));
        }
        
        orgInstallations.push(...orgInstalls);
      } catch (error) {
        console.log(`GitHub Service - Error getting installations for organization ${org.login}:`, error.message);
        console.log(`GitHub Service - This might mean the GitHub App is not installed on organization ${org.login}`);
      }
    }
    
    // Combine all installations
    const allInstallations = [...userInstallations, ...orgInstallations];
    console.log(`GitHub Service - Total installations found: ${allInstallations.length}`);
    console.log(`GitHub Service - Personal installations: ${userInstallations.length}`);
    console.log(`GitHub Service - Organization installations: ${orgInstallations.length}`);
    
    return allInstallations;
  }

  async getInstallationRepositories(installationId: number) {
    try {
      console.log(`GitHub Service - Getting repositories for installation ${installationId}`);
      const octokit = await this.getInstallationOctokit(installationId);
      console.log(`GitHub Service - Got Octokit instance for installation ${installationId}`);
      
      const response = await octokit.request('GET /installation/repositories');
      console.log(`GitHub Service - API response for installation ${installationId}:`, {
        status: response.status,
        repositoriesCount: response.data.repositories?.length || 0
      });
      
      return response.data.repositories || [];
    } catch (error) {
      console.error(`GitHub Service - Error getting repositories for installation ${installationId}:`, error);
      throw error;
    }
  }

  async getUserInfo(accessToken: string) {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return response.data;
  }

  async getUserOrganizations(accessToken: string, orgUrl: string) {
    console.log('orgUrl', orgUrl);
    const response = await axios.get(orgUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    console.log('response.data', response.data);
    return response.data || [];
  }

  async getUserRepositories(accessToken: string, reposUrl: string) {
    console.log('GitHub Service - Getting user repositories from:', reposUrl);
    const response = await axios.get(reposUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    console.log(`GitHub Service - Found ${response.data.length} user repositories`);
    return response.data || [];
  }

  async exchangeCodeForToken(code: string) {

    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.data.error) {
      throw new Error(`GitHub token exchange failed: ${response.data.error_description || response.data.error}`);
    }

    return response.data.access_token;
  }

  async getRepositoryDetails(installationId: number, owner: string, repo: string) {
    const octokit = await this.getInstallationOctokit(installationId);
    const response = await octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo,
    });
    return response.data;
  }

  async createCheckRun(installationId: number, owner: string, repo: string, sha: string, checkRunData: any) {
    const octokit = await this.getInstallationOctokit(installationId);
    const response = await octokit.request('POST /repos/{owner}/{repo}/check-runs', {
      owner,
      repo,
      head_sha: sha,
      ...checkRunData,
    });
    return response.data;
  }

  async updateCheckRun(installationId: number, owner: string, repo: string, checkRunId: number, updateData: any) {
    const octokit = await this.getInstallationOctokit(installationId);
    const response = await octokit.request('PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}', {
      owner,
      repo,
      check_run_id: checkRunId,
      ...updateData,
    });
    return response.data;
  }

  async getRepositoryRunners(installationId: number, owner: string, repo: string) {
    try {
      console.log(`GitHub Service - Getting runners for repository ${owner}/${repo}`);
      const octokit = await this.getInstallationOctokit(installationId);
      console.log(`GitHub Service - Got Octokit instance for repository ${owner}/${repo}`);
      
      const response = await octokit.request('GET /repos/{owner}/{repo}/actions/runners', {
        owner,
        repo,
      });
      console.log(`GitHub Service - API response for repository ${owner}/${repo} runners:`, {
        status: response.status,
        runnersCount: response.data.runners?.length || 0
      });
      
      return response.data.runners || [];
    } catch (error) {
      console.error(`GitHub Service - Error getting runners for repository ${owner}/${repo}:`, error);
      throw error;
    }
  }

  async getRepositoryRunner(installationId: number, owner: string, repo: string, runnerId: number) {
    try {
      console.log(`GitHub Service - Getting runner ${runnerId} for repository ${owner}/${repo}`);
      const octokit = await this.getInstallationOctokit(installationId);
      
      const response = await octokit.request('GET /repos/{owner}/{repo}/actions/runners/{runner_id}', {
        owner,
        repo,
        runner_id: runnerId,
      });
      
      return response.data;
    } catch (error) {
      console.error(`GitHub Service - Error getting runner ${runnerId} for repository ${owner}/${repo}:`, error);
      throw error;
    }
  }

  async getRepositoryWorkflows(installationId: number, owner: string, repo: string) {
    try {
      console.log(`GitHub Service - Getting workflows for repository ${owner}/${repo}`);
      const octokit = await this.getInstallationOctokit(installationId);
      console.log(`GitHub Service - Got Octokit instance for repository ${owner}/${repo}`);
      
      const response = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows', {
        owner,
        repo,
      });
      console.log(`GitHub Service - API response for repository ${owner}/${repo} workflows:`, {
        status: response.status,
        workflowsCount: response.data.workflows?.length || 0
      });
      
      return response.data.workflows || [];
    } catch (error) {
      console.error(`GitHub Service - Error getting workflows for repository ${owner}/${repo}:`, error);
      throw error;
    }
  }

  async getWorkflowRuns(installationId: number, owner: string, repo: string, workflowId: number) {
    try {
      console.log(`GitHub Service - Getting runs for workflow ${workflowId} in repository ${owner}/${repo}`);
      const octokit = await this.getInstallationOctokit(installationId);
      console.log(`GitHub Service - Got Octokit instance for workflow ${workflowId}`);
      
      const response = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs', {
        owner,
        repo,
        workflow_id: workflowId,
      });
      console.log(`GitHub Service - API response for workflow ${workflowId} runs:`, {
        status: response.status,
        runsCount: response.data.workflow_runs?.length || 0
      });
      
      return response.data.workflow_runs || [];
    } catch (error) {
      console.error(`GitHub Service - Error getting runs for workflow ${workflowId}:`, error);
      throw error;
    }
  }

  async getWorkflowRunLogs(installationId: number, owner: string, repo: string, runId: number) {
    try {
      console.log(`GitHub Service - Getting logs for run ${runId} in repository ${owner}/${repo}`);
      const octokit = await this.getInstallationOctokit(installationId);
      console.log(`GitHub Service - Got Octokit instance for run ${runId}`);
      
      const response = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs', {
        owner,
        repo,
        run_id: runId,
      });
      console.log(`GitHub Service - API response for run ${runId} logs:`, {
        status: response.status,
        hasLogs: !!response.data
      });
      
      return response.data;
    } catch (error) {
      console.error(`GitHub Service - Error getting logs for run ${runId}:`, error);
      throw error;
    }
  }
} 