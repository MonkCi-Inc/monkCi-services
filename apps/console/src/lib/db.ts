import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  githubId: number;
  login: string;
  name: string;
  email: string;
  avatarUrl: string;
  accessToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Installation {
  _id?: ObjectId;
  installationId: number;
  userId: ObjectId;
  accountLogin: string;
  accountType: 'User' | 'Organization';
  permissions: Record<string, string>;
  repositorySelection: 'all' | 'selected';
  suspendedAt?: Date;
  suspendedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Repository {
  _id?: ObjectId;
  repositoryId: number;
  installationId: ObjectId;
  name: string;
  fullName: string;
  private: boolean;
  description?: string;
  defaultBranch: string;
  language?: string;
  topics: string[];
  archived: boolean;
  disabled: boolean;
  fork: boolean;
  size: number;
  stargazersCount: number;
  watchersCount: number;
  forksCount: number;
  openIssuesCount: number;
  createdAt: Date;
  updatedAt: Date;
  pushedAt: Date;
  lastSyncAt: Date;
}

export interface Pipeline {
  _id?: ObjectId;
  repositoryId: ObjectId;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'error';
  config: any;
  lastRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  _id?: ObjectId;
  pipelineId: ObjectId;
  repositoryId: ObjectId;
  status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  logs: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Database helper functions
export async function getDb() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || 'monkci');
}

export async function getUsersCollection() {
  const db = await getDb();
  return db.collection<User>('users');
}

export async function getInstallationsCollection() {
  const db = await getDb();
  return db.collection<Installation>('installations');
}

export async function getRepositoriesCollection() {
  const db = await getDb();
  return db.collection<Repository>('repositories');
}

export async function getPipelinesCollection() {
  const db = await getDb();
  return db.collection<Pipeline>('pipelines');
}

export async function getJobsCollection() {
  const db = await getDb();
  return db.collection<Job>('jobs');
}

// User operations
export async function createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const users = await getUsersCollection();
  const now = new Date();
  const user: User = {
    ...userData,
    createdAt: now,
    updatedAt: now,
  };
  
  const result = await users.insertOne(user);
  return { ...user, _id: result.insertedId };
}

export async function updateUser(githubId: number, updates: Partial<User>): Promise<User | null> {
  const users = await getUsersCollection();
  const result = await users.findOneAndUpdate(
    { githubId },
    { 
      $set: { 
        ...updates, 
        updatedAt: new Date() 
      } 
    },
    { returnDocument: 'after' }
  );
  return result;
}

export async function findUserByGithubId(githubId: number): Promise<User | null> {
  const users = await getUsersCollection();
  return users.findOne({ githubId });
}

export async function findUserById(id: string): Promise<User | null> {
  const users = await getUsersCollection();
  return users.findOne({ _id: new ObjectId(id) });
}

// Installation operations
export async function createInstallation(installationData: Omit<Installation, '_id' | 'createdAt' | 'updatedAt'>): Promise<Installation> {
  const installations = await getInstallationsCollection();
  const now = new Date();
  const installation: Installation = {
    ...installationData,
    createdAt: now,
    updatedAt: now,
  };
  
  const result = await installations.insertOne(installation);
  return { ...installation, _id: result.insertedId };
}

export async function findInstallationsByUserId(userId: ObjectId): Promise<Installation[]> {
  const installations = await getInstallationsCollection();
  return installations.find({ userId }).toArray();
}

export async function findInstallationById(installationId: number): Promise<Installation | null> {
  const installations = await getInstallationsCollection();
  return installations.findOne({ installationId });
}

export async function updateInstallation(installationId: number, updates: Partial<Installation>): Promise<Installation | null> {
  const installations = await getInstallationsCollection();
  const result = await installations.findOneAndUpdate(
    { installationId },
    { 
      $set: { 
        ...updates, 
        updatedAt: new Date() 
      } 
    },
    { returnDocument: 'after' }
  );
  return result;
}

// Repository operations
export async function createRepository(repositoryData: Omit<Repository, '_id' | 'createdAt' | 'updatedAt' | 'lastSyncAt'>): Promise<Repository> {
  const repositories = await getRepositoriesCollection();
  const now = new Date();
  const repository: Repository = {
    ...repositoryData,
    createdAt: now,
    updatedAt: now,
    lastSyncAt: now,
  };
  
  const result = await repositories.insertOne(repository);
  return { ...repository, _id: result.insertedId };
}

export async function upsertRepository(repositoryData: Omit<Repository, '_id' | 'createdAt' | 'updatedAt' | 'lastSyncAt'>): Promise<Repository> {
  const repositories = await getRepositoriesCollection();
  const now = new Date();
  
  const result = await repositories.findOneAndUpdate(
    { repositoryId: repositoryData.repositoryId },
    {
      $set: {
        ...repositoryData,
        updatedAt: now,
        lastSyncAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { 
      upsert: true, 
      returnDocument: 'after' 
    }
  );
  
  return result!;
}

export async function findRepositoriesByInstallationId(installationId: ObjectId): Promise<Repository[]> {
  const repositories = await getRepositoriesCollection();
  return repositories.find({ installationId }).toArray();
}

export async function findRepositoryById(repositoryId: number): Promise<Repository | null> {
  const repositories = await getRepositoriesCollection();
  return repositories.findOne({ repositoryId });
}

// Pipeline operations
export async function createPipeline(pipelineData: Omit<Pipeline, '_id' | 'createdAt' | 'updatedAt'>): Promise<Pipeline> {
  const pipelines = await getPipelinesCollection();
  const now = new Date();
  const pipeline: Pipeline = {
    ...pipelineData,
    createdAt: now,
    updatedAt: now,
  };
  
  const result = await pipelines.insertOne(pipeline);
  return { ...pipeline, _id: result.insertedId };
}

export async function findPipelinesByRepositoryId(repositoryId: ObjectId): Promise<Pipeline[]> {
  const pipelines = await getPipelinesCollection();
  return pipelines.find({ repositoryId }).toArray();
}

// Job operations
export async function createJob(jobData: Omit<Job, '_id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
  const jobs = await getJobsCollection();
  const now = new Date();
  const job: Job = {
    ...jobData,
    createdAt: now,
    updatedAt: now,
  };
  
  const result = await jobs.insertOne(job);
  return { ...job, _id: result.insertedId };
}

export async function findJobsByPipelineId(pipelineId: ObjectId, limit = 50): Promise<Job[]> {
  const jobs = await getJobsCollection();
  return jobs.find({ pipelineId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
} 