'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Github, CheckCircle2, ExternalLink } from "lucide-react";
import { authService, User } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnectGitHubPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [emailAuthId, setEmailAuthId] = useState<string | null>(null);

  useEffect(() => {
    // Load user data
    const loadUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        
        // Get emailAuthId from user object
        if (userData.emailAuthId) {
          setEmailAuthId(userData.emailAuthId);
        } else {
          // Fallback: Extract from JWT token
          const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('monkci_token='))
            ?.split('=')[1];
          
          if (token) {
            try {
              // Decode JWT to get emailAuthId
              const payload = JSON.parse(atob(token.split('.')[1]));
              if (payload.emailAuthId) {
                setEmailAuthId(payload.emailAuthId);
              }
            } catch (e) {
              console.error('Failed to decode token:', e);
            }
          }
        }
      } catch (error) {
        console.error('Failed to get user:', error);
        // If user is not authenticated, redirect to signin
        router.push('/auth/signin');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleConnectGitHub = () => {
    setConnecting(true);
    if (emailAuthId) {
      authService.initiateGitHubAuth(emailAuthId);
    } else {
      // Fallback: try without emailAuthId
      authService.initiateGitHubAuth();
    }
  };

  const isConnected = user?.githubId && user?.login;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {isConnected ? 'GitHub Account Connected' : 'Connect Your GitHub Account'}
        </h2>
        <p className="text-muted-foreground">
          {isConnected 
            ? 'Your GitHub account is successfully linked to MonkCI'
            : 'Link your GitHub account to access CI/CD pipelines and repositories'
          }
        </p>
      </div>

     
    {isConnected && (
        <Card>
          <CardContent className="p-6">
            {/* GitHub Account Details */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatarUrl} alt={user.login || 'GitHub User'} />
                  <AvatarFallback>
                    <Github className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold">
                      {user.name || user.login}
                    </h3>
                    <Badge variant="secondary">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">@{user.login}</p>
                  {user.email && (
                    <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                  )}
                </div>
              </div>
              
              {user.githubId && (
                <div className="mt-4 pt-4 border-t">
                  <a
                    href={`https://github.com/${user.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View GitHub Profile
                  </a>
                </div>
              )}
            </div>

            {/* Installations Info */}
            {user.installations && user.installations.length > 0 && (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium mb-2">
                  GitHub App Installations
                </p>
                <p className="text-sm text-muted-foreground">
                  You have {user.installations.length} installation{user.installations.length !== 1 ? 's' : ''} connected.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isConnected && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-4">
                To use MonkCI, you need to connect your GitHub account. This allows us to:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Access your repositories</li>
                <li>Set up CI/CD pipelines</li>
                <li>Manage installations</li>
              </ul>
            </div>

            <Button 
              onClick={handleConnectGitHub}
              disabled={connecting}
            
            >
              <Github className="mr-2 h-4 w-4" />
              {connecting ? 'Connecting...' : 'Connect GitHub'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

