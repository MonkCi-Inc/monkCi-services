import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/auth/github/callback`;

export async function GET(request: NextRequest) {
  try {
    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(2, 15);

    console.log(GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI); 
    
    // Store state in session/cookie for verification in callback
    const response = NextResponse.redirect(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=repo,workflow&state=${state}`
    );
    
    // Set state cookie for verification
    response.cookies.set('github_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error('GitHub OAuth initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate GitHub OAuth' },
      { status: 500 }
    );
  }
} 