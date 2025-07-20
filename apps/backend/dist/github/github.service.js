"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const jwt = __importStar(require("jsonwebtoken"));
let GitHubService = class GitHubService {
    constructor() {
        this.appId = process.env.GITHUB_APP_ID;
        this.privateKey = process.env.GITHUB_PRIVATE_KEY;
    }
    generateJWT() {
        const now = Math.floor(Date.now() / 1000);
        const payload = {
            iat: now,
            exp: now + 600,
            iss: this.appId,
        };
        return jwt.sign(payload, this.privateKey, { algorithm: 'RS256' });
    }
    async getInstallationOctokit(installationId) {
        const jwt = this.generateJWT();
        const response = await axios_1.default.post(`https://api.github.com/app/installations/${installationId}/access_tokens`, {}, {
            headers: {
                Authorization: `Bearer ${jwt}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });
        const accessToken = response.data.token;
        const { Octokit } = await Promise.resolve().then(() => __importStar(require('@octokit/rest')));
        return new Octokit({
            auth: accessToken,
        });
    }
    async getUserInstallations(accessToken) {
        const response = await axios_1.default.get('https://api.github.com/user/installations', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });
        return response.data.installations || [];
    }
    async getOrganizationInstallations(accessToken, orgLogin) {
        try {
            const response = await axios_1.default.get(`https://api.github.com/orgs/${orgLogin}/installations`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });
            return response.data.installations || [];
        }
        catch (error) {
            console.log(`GitHub Service - No installations found for organization ${orgLogin}:`, error.message);
            return [];
        }
    }
    async getAllInstallations(accessToken) {
        console.log('GitHub Service - Getting all installations for user');
        const userInstallations = await this.getUserInstallations(accessToken);
        console.log(`GitHub Service - Found ${userInstallations.length} personal installations`);
        const organizations = await this.getUserOrganizations(accessToken, 'https://api.github.com/user/orgs');
        console.log(`GitHub Service - Found ${organizations.length} organizations:`, organizations.map(org => org.login));
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
            }
            catch (error) {
                console.log(`GitHub Service - Error getting installations for organization ${org.login}:`, error.message);
                console.log(`GitHub Service - This might mean the GitHub App is not installed on organization ${org.login}`);
            }
        }
        const allInstallations = [...userInstallations, ...orgInstallations];
        console.log(`GitHub Service - Total installations found: ${allInstallations.length}`);
        console.log(`GitHub Service - Personal installations: ${userInstallations.length}`);
        console.log(`GitHub Service - Organization installations: ${orgInstallations.length}`);
        return allInstallations;
    }
    async getInstallationRepositories(installationId) {
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
        }
        catch (error) {
            console.error(`GitHub Service - Error getting repositories for installation ${installationId}:`, error);
            throw error;
        }
    }
    async getUserInfo(accessToken) {
        const response = await axios_1.default.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });
        return response.data;
    }
    async getUserOrganizations(accessToken, orgUrl) {
        console.log('orgUrl', orgUrl);
        const response = await axios_1.default.get(orgUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });
        console.log('response.data', response.data);
        return response.data || [];
    }
    async getUserRepositories(accessToken, reposUrl) {
        console.log('GitHub Service - Getting user repositories from:', reposUrl);
        const response = await axios_1.default.get(reposUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });
        console.log(`GitHub Service - Found ${response.data.length} user repositories`);
        return response.data || [];
    }
    async exchangeCodeForToken(code) {
        const response = await axios_1.default.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: process.env.GITHUB_REDIRECT_URI,
        }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        if (response.data.error) {
            throw new Error(`GitHub token exchange failed: ${response.data.error_description || response.data.error}`);
        }
        return response.data.access_token;
    }
    async getRepositoryDetails(installationId, owner, repo) {
        const octokit = await this.getInstallationOctokit(installationId);
        const response = await octokit.request('GET /repos/{owner}/{repo}', {
            owner,
            repo,
        });
        return response.data;
    }
    async createCheckRun(installationId, owner, repo, sha, checkRunData) {
        const octokit = await this.getInstallationOctokit(installationId);
        const response = await octokit.request('POST /repos/{owner}/{repo}/check-runs', {
            owner,
            repo,
            head_sha: sha,
            ...checkRunData,
        });
        return response.data;
    }
    async updateCheckRun(installationId, owner, repo, checkRunId, updateData) {
        const octokit = await this.getInstallationOctokit(installationId);
        const response = await octokit.request('PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}', {
            owner,
            repo,
            check_run_id: checkRunId,
            ...updateData,
        });
        return response.data;
    }
    async getRepositoryRunners(installationId, owner, repo) {
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
        }
        catch (error) {
            console.error(`GitHub Service - Error getting runners for repository ${owner}/${repo}:`, error);
            throw error;
        }
    }
    async getRepositoryRunner(installationId, owner, repo, runnerId) {
        try {
            console.log(`GitHub Service - Getting runner ${runnerId} for repository ${owner}/${repo}`);
            const octokit = await this.getInstallationOctokit(installationId);
            const response = await octokit.request('GET /repos/{owner}/{repo}/actions/runners/{runner_id}', {
                owner,
                repo,
                runner_id: runnerId,
            });
            return response.data;
        }
        catch (error) {
            console.error(`GitHub Service - Error getting runner ${runnerId} for repository ${owner}/${repo}:`, error);
            throw error;
        }
    }
    async getRepositoryWorkflows(installationId, owner, repo) {
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
        }
        catch (error) {
            console.error(`GitHub Service - Error getting workflows for repository ${owner}/${repo}:`, error);
            throw error;
        }
    }
    async getWorkflowRuns(installationId, owner, repo, workflowId) {
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
        }
        catch (error) {
            console.error(`GitHub Service - Error getting runs for workflow ${workflowId}:`, error);
            throw error;
        }
    }
    async getWorkflowRunLogs(installationId, owner, repo, runId) {
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
        }
        catch (error) {
            console.error(`GitHub Service - Error getting logs for run ${runId}:`, error);
            throw error;
        }
    }
};
exports.GitHubService = GitHubService;
exports.GitHubService = GitHubService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GitHubService);
//# sourceMappingURL=github.service.js.map