#!/bin/bash

# Docker management script for Monk CI

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if .env file exists
check_env() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        cat > .env << EOF
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
EOF
        print_status ".env file created. Please update it with your actual values."
    fi
}

# Development setup
dev() {
    print_status "Starting development environment..."
    check_docker
    check_env
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
}

# Production setup
prod() {
    print_status "Starting production environment..."
    check_docker
    check_env
    docker-compose up --build -d
}

# Stop all services
stop() {
    print_status "Stopping all services..."
    docker-compose down
}

# Stop and remove volumes
clean() {
    print_status "Stopping services and removing volumes..."
    docker-compose down -v
}

# View logs
logs() {
    if [ -z "$1" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$1"
    fi
}

# Rebuild specific service
rebuild() {
    if [ -z "$1" ]; then
        print_error "Please specify a service to rebuild (backend, frontend, mongodb)"
        exit 1
    fi
    print_status "Rebuilding $1..."
    docker-compose build "$1"
    docker-compose up -d "$1"
}

# Access container shell
shell() {
    if [ -z "$1" ]; then
        print_error "Please specify a service (backend, frontend, mongodb)"
        exit 1
    fi
    docker-compose exec "$1" sh
}

# Show status
status() {
    print_status "Container status:"
    docker-compose ps
}

# Show usage
usage() {
    echo "Usage: $0 {dev|prod|stop|clean|logs|rebuild|shell|status}"
    echo ""
    echo "Commands:"
    echo "  dev     - Start development environment with hot reloading"
    echo "  prod    - Start production environment"
    echo "  stop    - Stop all services"
    echo "  clean   - Stop services and remove volumes"
    echo "  logs    - View logs (optionally specify service name)"
    echo "  rebuild - Rebuild specific service (backend|frontend|mongodb)"
    echo "  shell   - Access container shell (specify service name)"
    echo "  status  - Show container status"
    echo ""
    echo "Examples:"
    echo "  $0 dev"
    echo "  $0 logs backend"
    echo "  $0 rebuild frontend"
    echo "  $0 shell backend"
}

# Main script logic
case "$1" in
    dev)
        dev
        ;;
    prod)
        prod
        ;;
    stop)
        stop
        ;;
    clean)
        clean
        ;;
    logs)
        logs "$2"
        ;;
    rebuild)
        rebuild "$2"
        ;;
    shell)
        shell "$2"
        ;;
    status)
        status
        ;;
    *)
        usage
        exit 1
        ;;
esac 