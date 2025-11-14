'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from "lucide-react";
import { authService } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnectGitHubPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailAuthId, setEmailAuthId] = useState<string | null>(null);

  useEffect(() => {
    // Get emailAuthId from user object or JWT token
    const getEmailAuthId = async () => {
      try {
        const user = await authService.getCurrentUser();
        // Try to get emailAuthId from user object first
        if (user.emailAuthId) {
          setEmailAuthId(user.emailAuthId);
          return;
        }
        
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
      } catch (error) {
        console.error('Failed to get emailAuthId:', error);
        // If user is not authenticated, redirect to signin
        router.push('/auth/signin');
      }
    };

    getEmailAuthId();
  }, [router]);

  const handleConnectGitHub = () => {
    setLoading(true);
    if (emailAuthId) {
      authService.initiateGitHubAuth(emailAuthId);
    } else {
      // Fallback: try without emailAuthId
      authService.initiateGitHubAuth();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#fef3c7] via-[#fbbf24] to-[#f97316]">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Connect Your GitHub Account
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Link your GitHub account to access CI/CD pipelines and repositories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                To use MonkCI, you need to connect your GitHub account. This allows us to:
              </p>
              <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>Access your repositories</li>
                <li>Set up CI/CD pipelines</li>
                <li>Manage installations</li>
              </ul>
            </div>

            <Button 
              onClick={handleConnectGitHub}
              disabled={loading}
              className="w-full h-14 text-base font-semibold bg-gradient-to-r from-[#fbbf24] to-[#f97316] hover:from-[#f59e0b] hover:to-[#ea580c] text-white shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <Github className="mr-3 h-5 w-5" />
              {loading ? 'Connecting...' : 'Connect GitHub'}
            </Button>

            <div className="text-center">
              <button
                onClick={() => router.push('/auth/signin')}
                className="text-sm text-gray-600 hover:text-[#f97316] hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

