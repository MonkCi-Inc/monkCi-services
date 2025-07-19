# Self-Hosted Runners

Monk CI supports self-hosted runners that allow you to run CI/CD jobs on your own infrastructure. This provides better performance, security, and cost control compared to cloud-based runners.

## Architecture

The runner system consists of:

1. **Runner Management API** - Backend endpoints for registering and managing runners
2. **Runner Client** - Node.js application that runs on your infrastructure
3. **Job Distribution** - System for assigning jobs to available runners
4. **Status Monitoring** - Real-time status updates and health checks

## Setting Up a Self-Hosted Runner

### 1. Generate a Registration Token

First, generate a registration token from the Monk CI dashboard:

1. Go to your Monk CI dashboard
2. Click on "Runners" in the header
3. Click "Add Runner"
4. Copy the registration token

### 2. Install the Runner Client

The runner client is a Node.js application. You can run it directly or use Docker.

#### Option A: Direct Installation

```bash
# Clone the repository or download the runner client
git clone <your-repo>
cd apps/backend/src/runners

# Install dependencies
npm install

# Run the runner client
node runner-client.js <api-url> <registration-token> <runner-name> [description] [labels...]
```

Example:
```bash
node runner-client.js http://localhost:3001 reg_abc123 "My Linux Runner" "High-performance build server" linux x86_64 docker
```

#### Option B: Docker (Recommended)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  monkci-runner:
    image: node:18-alpine
    container_name: monkci-runner
    restart: unless-stopped
    environment:
      - API_URL=http://your-monkci-server:3001
      - REGISTRATION_TOKEN=your_registration_token
      - RUNNER_NAME=My Docker Runner
      - RUNNER_DESCRIPTION=High-performance Docker runner
      - RUNNER_LABELS=linux,docker,x86_64
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp:/tmp
    working_dir: /app
    command: >
      sh -c "
        npm install axios &&
        node runner-client.js $API_URL $REGISTRATION_TOKEN $RUNNER_NAME $RUNNER_DESCRIPTION $RUNNER_LABELS
      "
```

### 3. Runner Configuration

The runner client supports various configuration options:

- **Labels**: Tags that help match jobs to runners (e.g., `linux`, `docker`, `gpu`)
- **Capabilities**: System capabilities (Node.js, Git, Docker versions)
- **Environment**: Environment variables available to jobs
- **System Info**: CPU, memory, disk space information

### 4. Runner Status

Runners can be in the following states:

- **Offline**: Runner is not connected
- **Idle**: Runner is connected and ready for jobs
- **Busy**: Runner is currently executing a job
- **Error**: Runner encountered an error

## Job Execution

When a job is assigned to a runner:

1. The runner downloads the job configuration
2. Creates a workspace directory
3. Clones the repository
4. Executes each step in the workflow
5. Reports results back to the server

## Security Considerations

- Runners communicate with the server using secure tokens
- Jobs run in isolated workspaces
- Environment variables can be restricted
- Network access can be controlled

## Monitoring and Management

### Dashboard Features

- View all runners and their status
- Monitor job completion rates
- View system resource usage
- Manage runner labels and capabilities

### API Endpoints

- `GET /runners` - List all runners
- `POST /runners` - Create a new runner
- `POST /runners/register` - Register a runner with token
- `POST /runners/:id/status` - Update runner status
- `POST /runners/:id/heartbeat` - Send heartbeat
- `POST /runners/:id/assign-job` - Assign job to runner
- `POST /runners/:id/complete-job` - Report job completion

## Troubleshooting

### Common Issues

1. **Runner not connecting**
   - Check network connectivity
   - Verify registration token
   - Check API URL

2. **Jobs not being assigned**
   - Ensure runner is in "idle" status
   - Check job labels match runner labels
   - Verify runner is active

3. **Job execution failures**
   - Check required tools are installed (Git, Docker, etc.)
   - Verify workspace permissions
   - Check environment variables

### Logs

The runner client provides detailed logging:

```bash
# Enable debug logging
DEBUG=* node runner-client.js ...
```

## Scaling

To scale your runner infrastructure:

1. **Horizontal Scaling**: Add more runners
2. **Vertical Scaling**: Use more powerful machines
3. **Specialized Runners**: Create runners with specific capabilities (GPU, ARM, etc.)
4. **Geographic Distribution**: Place runners closer to your users

## Best Practices

1. **Use Labels**: Tag runners with relevant capabilities
2. **Monitor Resources**: Keep track of CPU, memory, and disk usage
3. **Regular Updates**: Keep runner software updated
4. **Backup Configuration**: Store runner configuration securely
5. **Network Security**: Use firewalls and VPNs as needed

## Example Workflows

### Basic Node.js Project

```yaml
name: Node.js CI
on: [push, pull_request]

jobs:
  test:
    runs-on: [self-hosted, linux, node]
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test
```

### Docker Build

```yaml
name: Docker Build
on: [push]

jobs:
  build:
    runs-on: [self-hosted, linux, docker]
    steps:
      - uses: actions/checkout@v3
      - run: docker build -t myapp .
      - run: docker push myapp
```

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review the API documentation
3. Check the logs for error messages
4. Contact support with detailed information 