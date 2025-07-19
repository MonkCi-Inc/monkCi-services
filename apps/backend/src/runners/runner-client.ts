#!/usr/bin/env node

import axios from 'axios';
import { spawn, exec } from 'child_process';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

interface RunnerConfig {
  apiUrl: string;
  registrationToken: string;
  name: string;
  description?: string;
  labels?: string[];
}

interface Job {
  jobId: string;
  repository: string;
  workflow: string;
  steps: any[];
  environment: Record<string, string>;
}

class MonkCIRunner {
  private config: RunnerConfig;
  private runnerId: string;
  private accessToken: string;
  private isRunning: boolean = false;
  private currentJob: Job | null = null;

  constructor(config: RunnerConfig) {
    this.config = config;
  }

  async register(): Promise<void> {
    try {
      console.log('Registering runner...');
      
      const systemInfo = this.getSystemInfo();
      const response = await axios.post(`${this.config.apiUrl}/runners/register`, {
        registrationToken: this.config.registrationToken,
        name: this.config.name,
        description: this.config.description,
        architecture: systemInfo.architecture,
        operatingSystem: systemInfo.operatingSystem,
        labels: this.config.labels || [],
        systemInfo: systemInfo,
        capabilities: this.getCapabilities(),
        environment: process.env,
      });

      this.runnerId = response.data.runnerId;
      this.accessToken = response.data.accessToken;
      
      console.log(`Runner registered successfully with ID: ${this.runnerId}`);
    } catch (error) {
      console.error('Failed to register runner:', error.response?.data || error.message);
      throw error;
    }
  }

  async start(): Promise<void> {
    if (!this.runnerId || !this.accessToken) {
      throw new Error('Runner must be registered before starting');
    }

    this.isRunning = true;
    console.log('Starting runner...');

    // Start heartbeat loop
    this.startHeartbeat();
    
    // Start job polling loop
    this.startJobPolling();
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    console.log('Stopping runner...');
  }

  private async startHeartbeat(): Promise<void> {
    const heartbeat = async () => {
      if (!this.isRunning) return;

      try {
        await axios.post(`${this.config.apiUrl}/runners/${this.runnerId}/heartbeat`, {
          systemInfo: this.getSystemInfo(),
        });
      } catch (error) {
        console.error('Heartbeat failed:', error.message);
      }

      // Send heartbeat every 30 seconds
      setTimeout(heartbeat, 30000);
    };

    heartbeat();
  }

  private async startJobPolling(): Promise<void> {
    const pollForJobs = async () => {
      if (!this.isRunning || this.currentJob) return;

      try {
        // Check for available jobs
        const response = await axios.get(`${this.config.apiUrl}/runners/available`);
        const availableRunners = response.data;
        
        // Find this runner in the available list
        const runner = availableRunners.find((r: any) => r.runnerId === this.runnerId);
        
        if (runner) {
          // Try to get a job assignment
          await this.requestJob();
        }
      } catch (error) {
        console.error('Job polling failed:', error.message);
      }

      // Poll every 10 seconds
      setTimeout(pollForJobs, 10000);
    };

    pollForJobs();
  }

  private async requestJob(): Promise<void> {
    try {
      // This would be implemented based on your job queue system
      // For now, we'll simulate job assignment
      console.log('Requesting job assignment...');
      
      // In a real implementation, you would:
      // 1. Check for available jobs in the queue
      // 2. Assign a job to this runner
      // 3. Execute the job
      // 4. Report completion
    } catch (error) {
      console.error('Job request failed:', error.message);
    }
  }

  private async executeJob(job: Job): Promise<void> {
    this.currentJob = job;
    const startTime = Date.now();

    try {
      console.log(`Starting job ${job.jobId} for ${job.repository}`);
      
      // Create workspace directory
      const workspace = path.join(os.tmpdir(), `monkci-${job.jobId}`);
      if (!fs.existsSync(workspace)) {
        fs.mkdirSync(workspace, { recursive: true });
      }

      // Set up environment
      const env = { ...process.env, ...job.environment };

      // Execute job steps
      for (const step of job.steps) {
        await this.executeStep(step, workspace, env);
      }

      const duration = Math.floor((Date.now() - startTime) / 1000);
      await this.completeJob(job.jobId, 'success', duration);
      
      console.log(`Job ${job.jobId} completed successfully`);
    } catch (error) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      await this.completeJob(job.jobId, 'failed', duration);
      console.error(`Job ${job.jobId} failed:`, error.message);
    } finally {
      this.currentJob = null;
    }
  }

  private async executeStep(step: any, workspace: string, env: Record<string, string>): Promise<void> {
    console.log(`Executing step: ${step.name}`);
    
    return new Promise((resolve, reject) => {
      const process = spawn(step.command, step.args || [], {
        cwd: workspace,
        env,
        stdio: 'inherit',
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Step failed with exit code ${code}`));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }

  private async completeJob(jobId: string, status: string, duration: number): Promise<void> {
    try {
      await axios.post(`${this.config.apiUrl}/runners/${this.runnerId}/complete-job`, {
        jobId,
        status,
        duration,
      });
    } catch (error) {
      console.error('Failed to report job completion:', error.message);
    }
  }

  private getSystemInfo(): any {
    const platform = os.platform();
    const arch = os.arch();
    
    return {
      cpuCount: os.cpus().length,
      memoryGB: Math.round(os.totalmem() / (1024 * 1024 * 1024)),
      diskSpaceGB: 0, // Would need to implement disk space checking
      hostname: os.hostname(),
      ipAddress: this.getLocalIP(),
      architecture: arch === 'x64' ? 'x86_64' : arch,
      operatingSystem: platform === 'win32' ? 'windows' : platform === 'darwin' ? 'macos' : 'linux',
    };
  }

  private getLocalIP(): string {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const interface_ of interfaces[name] || []) {
        if (interface_.family === 'IPv4' && !interface_.internal) {
          return interface_.address;
        }
      }
    }
    return '127.0.0.1';
  }

  private getCapabilities(): Record<string, any> {
    return {
      node: process.version,
      npm: this.getNpmVersion(),
      git: this.getGitVersion(),
      docker: this.getDockerVersion(),
    };
  }

  private getNpmVersion(): string {
    try {
      const { execSync } = require('child_process');
      const result = execSync('npm --version', { encoding: 'utf8' });
      return result.trim();
    } catch {
      return 'not available';
    }
  }

  private getGitVersion(): string {
    try {
      const { execSync } = require('child_process');
      const result = execSync('git --version', { encoding: 'utf8' });
      return result.trim();
    } catch {
      return 'not available';
    }
  }

  private getDockerVersion(): string {
    try {
      const { execSync } = require('child_process');
      const result = execSync('docker --version', { encoding: 'utf8' });
      return result.trim();
    } catch {
      return 'not available';
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('Usage: node runner-client.js <api-url> <registration-token> <runner-name> [description] [labels...]');
    process.exit(1);
  }

  const config: RunnerConfig = {
    apiUrl: args[0],
    registrationToken: args[1],
    name: args[2],
    description: args[3],
    labels: args.slice(4),
  };

  const runner = new MonkCIRunner(config);

  async function main() {
    try {
      await runner.register();
      await runner.start();
      
      // Keep the process running
      process.on('SIGINT', async () => {
        console.log('\nShutting down...');
        await runner.stop();
        process.exit(0);
      });
    } catch (error) {
      console.error('Runner failed:', error.message);
      process.exit(1);
    }
  }

  main();
}

export { MonkCIRunner }; 