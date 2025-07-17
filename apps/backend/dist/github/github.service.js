"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubService = void 0;
const common_1 = require("@nestjs/common");
const octokit_1 = require("octokit");
const axios_1 = require("axios");
let GitHubService = class GitHubService {
    constructor() {
        console.log(process.env.GITHUB_APP_ID, process.env.GITHUB_PRIVATE_KEY);
        this.app = new octokit_1.App({
            appId: process.env.GITHUB_APP_ID,
            privateKey: process.env.GITHUB_PRIVATE_KEY,
        });
    }
    async getInstallationOctokit(installationId) {
        return await this.app.getInstallationOctokit(installationId);
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
    async getInstallationRepositories(installationId) {
        const octokit = await this.getInstallationOctokit(installationId);
        const response = await octokit.request('GET /installation/repositories');
        return response.data.repositories || [];
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
};
exports.GitHubService = GitHubService;
exports.GitHubService = GitHubService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GitHubService);
//# sourceMappingURL=github.service.js.map