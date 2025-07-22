# Monk CI Console

A modern CI/CD platform that provides faster, more reliable builds with 3× faster CPUs and 20× faster NVMe cache.

## Features

- **GitHub App Authentication** - Secure OAuth flow with GitHub
- **Installation Management** - Handle GitHub App installations across organizations
- **Repository Sync** - Automatic synchronization of repositories from GitHub
- **MongoDB Integration** - Persistent storage for users, installations, and repositories
- **JWT Token Management** - Secure session handling
- **Modern UI** - Built with Next.js, TypeScript, and shadcn/ui
- **Responsive Design** - Works on desktop and mobile

## Quick Start

### 1. Clone and Install

```bash
cd apps/console
npm install
```

### 2. Set Up MongoDB

1. **Install MongoDB** (if not already installed):
   ```bash
   # macOS with Homebrew
   brew install mongodb-community
   
   # Ubuntu/Debian
   sudo apt-get install mongodb
   
   # Windows
   # Download from https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB**:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   
   # Windows
   # MongoDB runs as a service
   ```

3. **Create Database**:
   ```bash
   mongosh
   use monkci
   ```

### 3. Set Up GitHub App

1. Go to [GitHub Apps](https://github.com/settings/apps/new)
2. Create a new GitHub App with the following settings:
   - **App name**: Monk CI (or your preferred name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3001/v1/auth/github/callback`
   - **Webhook**: Disabled (for now)
   - **Permissions**:
     - Repository permissions:
       - Contents: Read
       - Metadata: Read
       - Pull requests: Read
       - Workflows: Write
     - User permissions:
       - Email addresses: Read
   - **Subscribe to events**: None

3. After creating the app, note down:
   - **Client ID**
   - **Client Secret**
   - **App ID**

4. Generate a private key:
   - Go to your app's settings
   - Click "Generate private key"
   - Download the `.pem` file

### 4. Environment Configuration

Copy `env.example` to `.env.local` and fill in your values:

```bash
cp env.example .env.local
```

Edit `.env.local`:

```env
# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/v1

# GitHub App Configuration (for backend)
GITHUB_CLIENT_ID=your_github_app_client_id
GITHUB_CLIENT_SECRET=your_github_app_client_secret
GITHUB_APP_ID=your_github_app_id
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nYour GitHub App private key here\n-----END RSA PRIVATE KEY-----"

# JWT Configuration (generate a secure random string)
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/monkci
MONGODB_DB=monkci
```

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  githubId: Number,
  login: String,
  name: String,
  email: String,
  avatarUrl: String,
  accessToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Installations Collection
```javascript
{
  _id: ObjectId,
  installationId: Number,
  userId: ObjectId,
  accountLogin: String,
  accountType: String, // 'User' | 'Organization'
  permissions: Object,
  repositorySelection: String, // 'all' | 'selected'
  suspendedAt: Date,
  suspendedBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Repositories Collection
```javascript
{
  _id: ObjectId,
  repositoryId: Number,
  installationId: ObjectId,
  name: String,
  fullName: String,
  private: Boolean,
  description: String,
  defaultBranch: String,
  language: String,
  topics: Array,
  archived: Boolean,
  disabled: Boolean,
  fork: Boolean,
  size: Number,
  stargazersCount: Number,
  watchersCount: Number,
  forksCount: Number,
  openIssuesCount: Number,
  createdAt: Date,
  updatedAt: Date,
  pushedAt: Date,
  lastSyncAt: Date
}
```

## Authentication Flow

### 1. User Signs In
- User clicks "Sign In with GitHub" on the landing page
- Redirected to `/auth/signin` page
- Clicks "Continue with GitHub" button

### 2. GitHub OAuth
- User is redirected to GitHub's OAuth authorization page
- User authorizes the GitHub App
- GitHub redirects back to `http://localhost:3001/v1/auth/github/callback` (NestJS backend)

### 3. Database Storage
- User data is stored/updated in MongoDB
- Installations are synced from GitHub
- Repositories are synced for each installation
- JWT token is created with user data

### 4. Dashboard Access
- User is redirected to `/dashboard` (frontend)
- Dashboard displays user's GitHub installations from database
- User can select installations to manage CI/CD

## API Endpoints

### Authentication (NestJS Backend - Port 3001)
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - Handle OAuth callback and sync data
- `GET /auth/me` - Get current user session from database
- `POST /auth/logout` - Logout user

### GitHub App (NestJS Backend - Port 3001)
- `POST /auth/installation` - Generate installation access token and sync repositories
- `POST /installations/:id/sync` - Manually sync repositories for an installation
- `GET /installations` - Get user's installations
- `GET /installations/:id` - Get installation details
- `GET /installations/:id/repositories` - Get repositories for an installation

## Database Operations

### User Management
- **Create User**: Automatically created during OAuth callback
- **Update User**: Updates user data on each login
- **Find User**: By GitHub ID or MongoDB ObjectId

### Installation Management
- **Create Installation**: Created during OAuth callback
- **Update Installation**: Updates installation data on each sync
- **Find Installations**: By user ID or installation ID

### Repository Management
- **Upsert Repository**: Creates or updates repository data
- **Sync Repositories**: Fetches fresh data from GitHub
- **Find Repositories**: By installation ID

## Security Features

- **JWT Tokens** - Secure session management
- **httpOnly Cookies** - XSS protection
- **CSRF Protection** - State parameter validation
- **Secure Redirects** - Validated callback URLs
- **Token Expiration** - Automatic session expiry
- **Database Validation** - MongoDB schema validation

## File Structure

### Frontend (Next.js - Port 3000)
```
apps/console/src/
├── app/
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Dashboard pages
│   └── page.tsx           # Landing page
├── components/             # UI components
├── lib/
│   ├── auth.ts            # Authentication utilities
│   └── api.ts             # API service for backend communication
└── middleware.ts          # Route protection
```

### Backend (NestJS - Port 3001)
```
apps/backend/src/
├── auth/                  # Authentication module
├── github/                # GitHub service
├── installations/         # Installations module
├── repositories/          # Repositories module
├── users/                 # Users module
├── database/              # Database schemas and models
└── main.ts               # Application entry point
```

## Development

### Adding New Features

1. **New API Endpoints**: Add to `src/app/api/`
2. **New Pages**: Add to `src/app/`
3. **New Components**: Add to `src/components/`
4. **New Database Models**: Add to `src/lib/db.ts`

### Environment Variables

All environment variables are documented in `env.example`. Make sure to:

1. Use strong, random values for secrets
2. Keep private keys secure
3. Use different values for development and production
4. Never commit `.env.local` to version control

### Database Operations

```bash
# Connect to MongoDB
mongosh

# Switch to database
use monkci

# View collections
show collections

# View users
db.users.find()

# View installations
db.installations.find()

# View repositories
db.repositories.find()
```

### Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Set up MongoDB Atlas for production database
4. Deploy automatically on push to main

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in production environment

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Troubleshooting

### Common Issues

1. **"Invalid state parameter"**
   - Clear browser cookies
   - Check that `NEXTAUTH_URL` is correct

2. **"GitHub App not found"**
   - Verify `GITHUB_APP_ID` is correct
   - Check that the private key is properly formatted

3. **"Installation not found"**
   - Ensure the GitHub App is installed on the repository
   - Check installation permissions

4. **MongoDB connection errors**
   - Verify `MONGODB_URI` is correct
   - Check that MongoDB is running
   - Ensure database exists

5. **JWT errors**
   - Verify `JWT_SECRET` is set
   - Check token expiration

### Debug Mode

Add to `.env.local`:

```env
DEBUG=true
NODE_ENV=development
```

### Database Debugging

```bash
# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Connect to database
mongosh monkci

# Check collections
show collections

# View recent documents
db.users.find().sort({createdAt: -1}).limit(5)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
