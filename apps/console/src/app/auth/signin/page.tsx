'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from "lucide-react";
import { authService } from "@/lib/auth";

export default function SignInPage() {
  const handleGitHubSignIn = () => {
    authService.initiateGitHubAuth();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">M</span>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to Monk CI</CardTitle>
            <CardDescription className="text-lg">
              Sign in to access your CI/CD pipelines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button 
                onClick={handleGitHubSignIn}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                <Github className="mr-3 h-5 w-5" />
                Continue with GitHub
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>
                By signing in, you agree to our{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Monk CI provides faster, more reliable CI/CD with{' '}
            <span className="font-medium">3× faster CPUs</span> and{' '}
            <span className="font-medium">20× faster NVMe cache</span>
          </p>
        </div>
      </div>
    </div>
  );
} 