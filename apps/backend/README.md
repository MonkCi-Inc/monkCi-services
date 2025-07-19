# Monk CI Backend

A NestJS backend for Monk CI that provides GitHub App authentication, installation management, and repository synchronization.

## Features

- **GitHub App Authentication**: OAuth flow with JWT token management
- **Installation Management**: Store and manage GitHub App installations
- **Repository Synchronization**: Sync repositories from GitHub installations
- **MongoDB Integration**: Persistent storage for users, installations, and repositories
- **Octokit.js Integration**: Proper GitHub App authentication using installation tokens
- **Swagger Documentation**: Auto-generated API documentation
- **JWT Authentication**: Secure session management with cookies

## Prerequisites

- Node.js 18+ 
- MongoDB 5.0+
- GitHub App (with private key and app ID)

## Environment Variables

Create a `.env` file in the `apps/backend` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/monkci

# GitHub App Configuration
GITHUB_APP_ID=your-github-app-id
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
GITHUB_REDIRECT_URI=http://localhost:3001/auth/github/callback
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
your-github-app-private-key-here
-----END RSA PRIVATE KEY-----"
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB (if running locally):
```bash
mongod
```

3. Run the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3001` and Swagger documentation at `http://localhost:3001/api`.

## API Endpoints

### Authentication

- `GET /auth/github` - Initiate GitHub OAuth flow
- `GET /auth/github/callback` - Handle OAuth callback
- `GET /auth/me` - Get current user information
- `POST /auth/logout` - Logout user
- `POST /auth/installation` - Generate installation access token
- `GET /auth/installation/:installationId/octokit` - Get authenticated Octokit instance

### Users

- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Installations

- `GET /installations` - Get user's installations
- `GET /installations/:id` - Get installation by ID
- `POST /installations` - Create new installation
- `PATCH /installations/:id` - Update installation
- `DELETE /installations/:id` - Delete installation

### Repositories

- `GET /repositories` - Get all repositories
- `GET /repositories?installationId=:id` - Get repositories for installation
- `GET /repositories/:id` - Get repository by ID
- `POST /repositories` - Create new repository
- `PATCH /repositories/:id` - Update repository
- `DELETE /repositories/:id` - Delete repository
- `POST /repositories/sync/:installationId` - Sync repositories for installation

## Database Schema

### User
```typescript
{
  githubId: number;        // GitHub user ID
  login: string;           // GitHub username
  name?: string;           // Full name
  email?: string;          // Email address
  avatarUrl?: string;      // Profile picture URL
  accessToken: string;     // GitHub OAuth token
  createdAt: Date;
  updatedAt: Date;
}
```

### Installation
```typescript
{
  installationId: number;  // GitHub installation ID
  userId: ObjectId;        // Reference to User
  accountLogin: string;    // Account username/org name
  accountType: 'User' | 'Organization';
  permissions: Record<string, string>;
  repositorySelection: 'all' | 'selected';
  suspendedAt?: Date;
  suspendedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Repository
```typescript
{
  repositoryId: number;    // GitHub repository ID
  installationId: ObjectId; // Reference to Installation
  name: string;            // Repository name
  fullName: string;        // owner/repo
  private: boolean;        // Is private repository
  description?: string;    // Repository description
  defaultBranch: string;   // Default branch name
  language?: string;       // Primary language
  topics: string[];        // Repository topics
  archived: boolean;       // Is archived
  disabled: boolean;       // Is disabled
  fork: boolean;           // Is fork
  size: number;            // Repository size
  stargazersCount: number; // Star count
  watchersCount: number;   // Watcher count
  forksCount: number;      // Fork count
  openIssuesCount: number; // Open issues count
  createdAt: Date;         // GitHub creation date
  updatedAt: Date;         // GitHub update date
  pushedAt: Date;          // Last push date
  lastSyncAt: Date;        // Last sync with GitHub
}
```

## GitHub App Setup

1. Create a GitHub App at https://github.com/settings/apps/new
2. Set the following permissions:
   - **Repository permissions**: Contents (Read), Metadata (Read)
   - **User permissions**: Email addresses (Read)
   - **Organization permissions**: Members (Read) - to access organization installations
3. Set the callback URL to: `http://localhost:3001/auth/github/callback`
4. Generate a private key and download it
5. Note your App ID and Client ID

**Important**: To access organization repositories, the GitHub App must be installed on the organization by an organization owner or admin. Users can only see installations for organizations where they have admin access.

## Development

### Running Tests
```bash
npm run test
npm run test:watch
npm run test:e2e
```

### Building for Production
```bash
npm run build
npm run start:prod
```

### Code Formatting
```bash
npm run format
npm run lint
```

## Architecture

The backend follows NestJS best practices with:

- **Modules**: Organized by feature (auth, users, installations, repositories)
- **Services**: Business logic and external API calls
- **Controllers**: HTTP request handling
- **Guards**: Authentication and authorization
- **DTOs**: Data transfer objects for validation
- **Schemas**: MongoDB/Mongoose schemas

## Security

- JWT tokens stored as httpOnly cookies
- CORS configured for frontend domain
- Input validation using class-validator
- GitHub App authentication using installation tokens
- User access control for installations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT 