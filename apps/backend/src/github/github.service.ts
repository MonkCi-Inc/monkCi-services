import { Injectable } from '@nestjs/common';
import { App } from 'octokit';
import axios from 'axios';

@Injectable()
export class GitHubService {
  private app: App;

  constructor() {
    console.log(process.env.GITHUB_APP_ID, process.env.GITHUB_PRIVATE_KEY);
    this.app = new App({
      appId: process.env.GITHUB_APP_ID,
      privateKey: process.env.GITHUB_PRIVATE_KEY,
    });
  }

  async getInstallationOctokit(installationId: number) {
    return await this.app.getInstallationOctokit(installationId);
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

  async getInstallationRepositories(installationId: number) {
    const octokit = await this.getInstallationOctokit(installationId);
    const response = await octokit.request('GET /installation/repositories');
    return response.data.repositories || [];
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
} 