export declare class CreateRepositoryDto {
    repositoryId: number;
    installationId: string;
    name: string;
    fullName: string;
    private: boolean;
    description?: string;
    defaultBranch: string;
    language?: string;
    topics?: string[];
    archived: boolean;
    disabled: boolean;
    fork: boolean;
    size: number;
    stargazersCount: number;
    watchersCount: number;
    forksCount: number;
    openIssuesCount: number;
    createdAt: string;
    updatedAt: string;
    pushedAt: string;
}
