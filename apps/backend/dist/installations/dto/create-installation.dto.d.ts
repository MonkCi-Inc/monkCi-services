export declare class CreateInstallationDto {
    installationId: number;
    userId: string;
    accountLogin: string;
    accountType: 'User' | 'Organization';
    permissions: Record<string, string>;
    repositorySelection: 'all' | 'selected';
}
