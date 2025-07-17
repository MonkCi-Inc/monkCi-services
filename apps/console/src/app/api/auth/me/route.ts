import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, verifyToken } from '@/lib/auth';
import { findUserById, findInstallationsByUserId } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user data from database
    const dbUser = await findUserById(user.userId);
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch installations from database
    const installations = await findInstallationsByUserId(dbUser._id!);

    // Return user data without sensitive information
    const { accessToken, ...userData } = dbUser;
    
    return NextResponse.json({
      ...userData,
      installations: installations.map(inst => ({
        id: inst.installationId,
        accountLogin: inst.accountLogin,
        accountType: inst.accountType,
        permissions: inst.permissions,
        repositorySelection: inst.repositorySelection,
      })),
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 