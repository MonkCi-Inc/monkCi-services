#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonkCIRunner = void 0;
const axios_1 = require("axios");
const child_process_1 = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");
class MonkCIRunner {
    constructor(config) {
        this.isRunning = false;
        this.currentJob = null;
        this.config = config;
    }
    async register() {
        try {
            console.log('Registering runner...');
            const systemInfo = this.getSystemInfo();
            const response = await axios_1.default.post(`${this.config.apiUrl}/runners/register`, {
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
        }
        catch (error) {
            console.error('Failed to register runner:', error.response?.data || error.message);
            throw error;
        }
    }
    async start() {
        if (!this.runnerId || !this.accessToken) {
            throw new Error('Runner must be registered before starting');
        }
        this.isRunning = true;
        console.log('Starting runner...');
        this.startHeartbeat();
        this.startJobPolling();
    }
    async stop() {
        this.isRunning = false;
        console.log('Stopping runner...');
    }
    async startHeartbeat() {
        const heartbeat = async () => {
            if (!this.isRunning)
                return;
            try {
                await axios_1.default.post(`${this.config.apiUrl}/runners/${this.runnerId}/heartbeat`, {
                    systemInfo: this.getSystemInfo(),
                });
            }
            catch (error) {
                console.error('Heartbeat failed:', error.message);
            }
            setTimeout(heartbeat, 30000);
        };
        heartbeat();
    }
    async startJobPolling() {
        const pollForJobs = async () => {
            if (!this.isRunning || this.currentJob)
                return;
            try {
                const response = await axios_1.default.get(`${this.config.apiUrl}/runners/available`);
                const availableRunners = response.data;
                const runner = availableRunners.find((r) => r.runnerId === this.runnerId);
                if (runner) {
                    await this.requestJob();
                }
            }
            catch (error) {
                console.error('Job polling failed:', error.message);
            }
            setTimeout(pollForJobs, 10000);
        };
        pollForJobs();
    }
    async requestJob() {
        try {
            console.log('Requesting job assignment...');
        }
        catch (error) {
            console.error('Job request failed:', error.message);
        }
    }
    async executeJob(job) {
        this.currentJob = job;
        const startTime = Date.now();
        try {
            console.log(`Starting job ${job.jobId} for ${job.repository}`);
            const workspace = path.join(os.tmpdir(), `monkci-${job.jobId}`);
            if (!fs.existsSync(workspace)) {
                fs.mkdirSync(workspace, { recursive: true });
            }
            const env = { ...process.env, ...job.environment };
            for (const step of job.steps) {
                await this.executeStep(step, workspace, env);
            }
            const duration = Math.floor((Date.now() - startTime) / 1000);
            await this.completeJob(job.jobId, 'success', duration);
            console.log(`Job ${job.jobId} completed successfully`);
        }
        catch (error) {
            const duration = Math.floor((Date.now() - startTime) / 1000);
            await this.completeJob(job.jobId, 'failed', duration);
            console.error(`Job ${job.jobId} failed:`, error.message);
        }
        finally {
            this.currentJob = null;
        }
    }
    async executeStep(step, workspace, env) {
        console.log(`Executing step: ${step.name}`);
        return new Promise((resolve, reject) => {
            const process = (0, child_process_1.spawn)(step.command, step.args || [], {
                cwd: workspace,
                env,
                stdio: 'inherit',
            });
            process.on('close', (code) => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error(`Step failed with exit code ${code}`));
                }
            });
            process.on('error', (error) => {
                reject(error);
            });
        });
    }
    async completeJob(jobId, status, duration) {
        try {
            await axios_1.default.post(`${this.config.apiUrl}/runners/${this.runnerId}/complete-job`, {
                jobId,
                status,
                duration,
            });
        }
        catch (error) {
            console.error('Failed to report job completion:', error.message);
        }
    }
    getSystemInfo() {
        const platform = os.platform();
        const arch = os.arch();
        return {
            cpuCount: os.cpus().length,
            memoryGB: Math.round(os.totalmem() / (1024 * 1024 * 1024)),
            diskSpaceGB: 0,
            hostname: os.hostname(),
            ipAddress: this.getLocalIP(),
            architecture: arch === 'x64' ? 'x86_64' : arch,
            operatingSystem: platform === 'win32' ? 'windows' : platform === 'darwin' ? 'macos' : 'linux',
        };
    }
    getLocalIP() {
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
    getCapabilities() {
        return {
            node: process.version,
            npm: this.getNpmVersion(),
            git: this.getGitVersion(),
            docker: this.getDockerVersion(),
        };
    }
    getNpmVersion() {
        try {
            const { execSync } = require('child_process');
            const result = execSync('npm --version', { encoding: 'utf8' });
            return result.trim();
        }
        catch {
            return 'not available';
        }
    }
    getGitVersion() {
        try {
            const { execSync } = require('child_process');
            const result = execSync('git --version', { encoding: 'utf8' });
            return result.trim();
        }
        catch {
            return 'not available';
        }
    }
    getDockerVersion() {
        try {
            const { execSync } = require('child_process');
            const result = execSync('docker --version', { encoding: 'utf8' });
            return result.trim();
        }
        catch {
            return 'not available';
        }
    }
}
exports.MonkCIRunner = MonkCIRunner;
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.log('Usage: node runner-client.js <api-url> <registration-token> <runner-name> [description] [labels...]');
        process.exit(1);
    }
    const config = {
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
            process.on('SIGINT', async () => {
                console.log('\nShutting down...');
                await runner.stop();
                process.exit(0);
            });
        }
        catch (error) {
            console.error('Runner failed:', error.message);
            process.exit(1);
        }
    }
    main();
}
//# sourceMappingURL=runner-client.js.map