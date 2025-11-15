import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
  HttpStatus,
  UnauthorizedException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto, RegisterDto } from '../users/dto/create-email-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Req } from '@nestjs/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.loginWithEmailPassword(loginDto.email, loginDto.password);
      
      // Set JWT token as httpOnly cookie
      res.cookie('monkci_token', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
      });

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register with email and password' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      const result = await this.authService.registerWithEmailPassword(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );
      
      // Set JWT token as httpOnly cookie
      res.cookie('monkci_token', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
      });

      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res.status(HttpStatus.CONFLICT).json({ message: error.message });
    }
  }

  @Get('github')
  @ApiOperation({ summary: 'Initiate GitHub OAuth flow' })
  @ApiQuery({ name: 'state', required: false, description: 'OAuth state parameter' })
  async githubAuth(
    @Query('state') state?: string,
    @Res() res?: Response,
  ) {
    const stateParam = state || '';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=repo,user:email&state=${stateParam}`;
    if (res) {
      console.log('redirecting to', githubAuthUrl);
      return res.redirect(githubAuthUrl);
    }
    
    return { url: githubAuthUrl };
  }

  @Get('github/callback')
  @ApiOperation({ summary: 'Handle GitHub OAuth callback' })
  @ApiQuery({ name: 'code', required: true, description: 'OAuth authorization code' })
  @ApiQuery({ name: 'state', required: false, description: 'OAuth state parameter' })
  async githubCallback(
    @Query('code') code: string,
    @Query('state') state?: string,
    @Req() req?: Request,
    @Res() res?: Response,
  ) {
    try {
      // Extract mode from state parameter
      let mode: 'login' | 'connect' = 'login';
      let emailAuthId: string | undefined;
      
      if (state && state.startsWith('mode:')) {
        mode = state.replace('mode:', '') as 'login' | 'connect';
      }

      // If mode is "connect", extract emailAuthId from current session cookie
      if (mode === 'connect' && req) {
        const token = req.cookies?.monkci_token;
        if (token) {
          try {
            const decoded = this.jwtService.decode(token) as any;
            if (decoded && decoded.emailAuthId) {
              emailAuthId = decoded.emailAuthId;
            }
          } catch (e) {
            console.error('Failed to decode token for connect mode:', e);
          }
        }
        
        if (!emailAuthId) {
          throw new UnauthorizedException('No email authentication session found. Please log in with email first.');
        }
      }

      const result = await this.authService.validateGithubCode(code, mode, emailAuthId);
      
      if (res) {
        // Set JWT token as httpOnly cookie
        res.cookie('monkci_token', result.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
        });

        const redirect_url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;        
        // Redirect to frontend dashboard
        return res.redirect(redirect_url);
      }
      
      return result;
    } catch (error) {
      if (res) {
        console.log('error', error);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/error?error=${encodeURIComponent(error.message)}`);
      }
      throw error;
    }
  }

  @Post('installation')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate installation access token' })
  @ApiResponse({ status: 200, description: 'Installation token generated successfully.' })
  async generateInstallationToken(
    @Body() body: { installationId: number },
    @CurrentUser() user: any,
  ) {
    return this.authService.generateInstallationToken(body.installationId, user.userId);
  }

  @Get('installation/:installationId/octokit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated Octokit instance for installation' })
  @ApiResponse({ status: 200, description: 'Octokit instance authenticated successfully.' })
  async getInstallationOctokit(
    @Param('installationId') installationId: string,
    @CurrentUser() user: any,
  ) {
    const octokit = await this.authService.getInstallationOctokit(parseInt(installationId), user.userId);
    return {
      installation_id: parseInt(installationId),
      authenticated: true,
      message: 'Octokit instance is ready for GitHub API calls',
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  async logout(@Res() res: Response) {
    res.clearCookie('monkci_token');
    return res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'Return current user information.' })
  async getCurrentUser(@CurrentUser() user: any) {
    console.log('Auth Controller - getCurrentUser called with user:', user ? 'User exists' : 'No user');
    
    // Installations are now included in JWT token from login, no need to fetch from database
    // If installations are not in token, fetch from GitHub API
    if (user?.userId && (!user.installations || user.installations.length === 0)) {
      try {
        const installations = await this.authService.getUserInstallations(user.userId);
        console.log('Auth Controller - fetched installations from GitHub:', installations);
        user.installations = installations;
      } catch (error) {
        console.warn('Auth Controller - Failed to fetch installations:', error);
        user.installations = [];
      }
    }
    return user;
  }

  @Get('test/organizations')
  @ApiOperation({ summary: 'Test organization access with a code parameter' })
  @ApiQuery({ name: 'code', required: true, description: 'OAuth code' })
  async testOrganizations(@Query('code') code: string) {
    try {
      // Exchange code for token
      const accessToken = await this.authService.githubServiceAccess.exchangeCodeForToken(code);
      
      // Get user info
      const userInfo = await this.authService.githubServiceAccess.getUserInfo(accessToken);
      
      // Get organizations
      const organizations = await this.authService.githubServiceAccess.getUserOrganizations(accessToken, userInfo.organizations_url);
      
      // Get all installations
      const allInstallations = await this.authService.githubServiceAccess.getAllInstallations(accessToken);
      
      return {
        user: {
          login: userInfo.login,
          id: userInfo.id,
          name: userInfo.name
        },
        organizations: organizations.map(org => ({
          login: org.login,
          id: org.id,
          type: org.type
        })),
        installations: allInstallations.map(inst => ({
          id: inst.id,
          accountLogin: inst.account.login,
          accountType: inst.account.type,
          appSlug: inst.app_slug
        })),
        summary: {
          totalOrganizations: organizations.length,
          totalInstallations: allInstallations.length,
          personalInstallations: allInstallations.filter(inst => inst.account.type === 'User').length,
          organizationInstallations: allInstallations.filter(inst => inst.account.type === 'Organization').length
        }
      };
    } catch (error) {
      console.error('Auth Controller - Error in testOrganizations:', error);
      return { error: error.message };
    }
  }
} 