# Docker Setup for Monk CI

This guide explains how to run Monk CI using Docker and Docker Compose.

## Prerequisites

- Docker
- Docker Compose
- GitHub App credentials

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://admin:password@localhost:27017/monkci?authSource=admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# GitHub App Configuration
GITHUB_APP_ID=your-github-app-id
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\nYour GitHub App Private Key\n-----END RSA PRIVATE KEY-----
GITHUB_REDIRECT_URI=http://localhost:3000/auth/github/callback

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/v1
NEXT_PUBLIC_GITHUB_APP_SLUG=your-github-app-slug
```

## Development Setup

For development with hot reloading:

```bash
# Build and start all services in development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Or start specific services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build backend frontend mongodb
```

## Production Setup

For production deployment:

```bash
# Build and start all services
docker-compose up --build -d

# Start specific services
docker-compose up --build -d mongodb backend frontend
```

## Services

### MongoDB (Port 27017)
- Database for storing user data, installations, and repositories
- Persistent volume for data storage
- Authentication enabled

### Backend API (Port 3001)
- NestJS application
- Handles GitHub OAuth and API interactions
- JWT authentication
- RESTful API endpoints

### Frontend (Port 3000)
- Next.js application
- React-based user interface
- Communicates with backend API

### Nginx (Ports 80/443) - Optional
- Reverse proxy for production
- SSL termination
- Load balancing

## Useful Commands

```bash
# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild a specific service
docker-compose build [service-name]

# Access container shell
docker-compose exec [service-name] sh

# View running containers
docker-compose ps
```

## Development Workflow

1. **Start services**: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build`
2. **Make code changes**: Files are mounted as volumes, so changes are reflected immediately
3. **View logs**: `docker-compose logs -f [service-name]`
4. **Stop services**: `docker-compose down`

## Production Deployment

1. **Set environment variables**: Create `.env` file with production values
2. **Build and start**: `docker-compose up --build -d`
3. **Monitor logs**: `docker-compose logs -f`
4. **Scale services**: `docker-compose up --scale backend=3 -d`

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 3001, and 27017 are available
2. **Environment variables**: Check that all required variables are set in `.env`
3. **MongoDB connection**: Verify MongoDB is running and accessible
4. **GitHub credentials**: Ensure GitHub App credentials are correct

### Debug Commands

```bash
# Check container status
docker-compose ps

# View detailed logs
docker-compose logs [service-name]

# Access container for debugging
docker-compose exec [service-name] sh

# Check network connectivity
docker-compose exec backend ping mongodb
```

## Security Considerations

1. **Change default passwords**: Update MongoDB credentials
2. **Use strong JWT secret**: Generate a secure random string
3. **Secure GitHub credentials**: Keep private keys secure
4. **Enable SSL**: Use HTTPS in production
5. **Regular updates**: Keep Docker images updated

## Performance Optimization

1. **Use multi-stage builds**: Optimize image sizes
2. **Enable caching**: Use Docker layer caching
3. **Resource limits**: Set appropriate memory and CPU limits
4. **Database optimization**: Configure MongoDB for production use 