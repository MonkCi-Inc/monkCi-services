import { Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    githubAuth(state?: string, res?: Response): Promise<void | {
        url: string;
    }>;
    githubCallback(code: string, state?: string, res?: Response): Promise<void | {
        access_token: string;
        user: {
            id: any;
            githubId: number;
            login: string;
            name: string;
            email: string;
            avatarUrl: string;
        };
        installations: any[];
    }>;
    generateInstallationToken(body: {
        installationId: number;
    }, user: any): Promise<{
        installation_id: number;
        octokit_authenticated: boolean;
        permissions: Record<string, string>;
    }>;
    getInstallationOctokit(installationId: string, user: any): Promise<{
        installation_id: number;
        authenticated: boolean;
        message: string;
    }>;
    logout(res: Response): Promise<Response<any, Record<string, any>>>;
    getCurrentUser(user: any): Promise<any>;
    testOrganizations(code: string): Promise<{
        user: {
            login: any;
            id: any;
            name: any;
        };
        organizations: any;
        installations: {
            id: any;
            accountLogin: any;
            accountType: any;
            appSlug: any;
        }[];
        summary: {
            totalOrganizations: any;
            totalInstallations: number;
            personalInstallations: number;
            organizationInstallations: number;
        };
        error?: undefined;
    } | {
        error: any;
        user?: undefined;
        organizations?: undefined;
        installations?: undefined;
        summary?: undefined;
    }>;
}
