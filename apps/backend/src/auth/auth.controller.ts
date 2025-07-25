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
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  @ApiOperation({ summary: 'Initiate GitHub OAuth flow' })
  @ApiQuery({ name: 'state', required: false, description: 'OAuth state parameter' })
  async githubAuth(@Query('state') state?: string, @Res() res?: Response) {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=repo,user:email&state=${state || ''}`;
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
    @Res() res?: Response,
  ) {
    try {
      const result = await this.authService.validateGithubCode(code);
      
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