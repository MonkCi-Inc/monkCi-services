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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const current_user_decorator_1 = require("./decorators/current-user.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async githubAuth(state, res) {
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=repo,user:email&state=${state || ''}`;
        if (res) {
            console.log('redirecting to', githubAuthUrl);
            return res.redirect(githubAuthUrl);
        }
        return { url: githubAuthUrl };
    }
    async githubCallback(code, state, res) {
        try {
            console.log('code is getting here');
            const result = await this.authService.validateGithubCode(code);
            console.log('result', result);
            if (res) {
                res.cookie('monkci_token', result.access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7 * 1000,
                });
                return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`);
            }
            return result;
        }
        catch (error) {
            if (res) {
                console.log('error', error);
                return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/error?error=${encodeURIComponent(error.message)}`);
            }
            throw error;
        }
    }
    async generateInstallationToken(body, user) {
        return this.authService.generateInstallationToken(body.installationId, user.userId);
    }
    async getInstallationOctokit(installationId, user) {
        const octokit = await this.authService.getInstallationOctokit(parseInt(installationId), user.userId);
        return {
            installation_id: parseInt(installationId),
            authenticated: true,
            message: 'Octokit instance is ready for GitHub API calls',
        };
    }
    async logout(res) {
        res.clearCookie('monkci_token');
        return res.status(common_1.HttpStatus.OK).json({ message: 'Logged out successfully' });
    }
    async getCurrentUser(user) {
        return user;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('github'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate GitHub OAuth flow' }),
    (0, swagger_1.ApiQuery)({ name: 'state', required: false, description: 'OAuth state parameter' }),
    __param(0, (0, common_1.Query)('state')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubAuth", null);
__decorate([
    (0, common_1.Get)('github/callback'),
    (0, swagger_1.ApiOperation)({ summary: 'Handle GitHub OAuth callback' }),
    (0, swagger_1.ApiQuery)({ name: 'code', required: true, description: 'OAuth authorization code' }),
    (0, swagger_1.ApiQuery)({ name: 'state', required: false, description: 'OAuth state parameter' }),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubCallback", null);
__decorate([
    (0, common_1.Post)('installation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate installation access token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Installation token generated successfully.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateInstallationToken", null);
__decorate([
    (0, common_1.Get)('installation/:installationId/octokit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get authenticated Octokit instance for installation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Octokit instance authenticated successfully.' }),
    __param(0, (0, common_1.Param)('installationId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getInstallationOctokit", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiOperation)({ summary: 'Logout user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User logged out successfully.' }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return current user information.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map