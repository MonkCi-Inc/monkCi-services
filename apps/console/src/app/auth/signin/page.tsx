'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail, Lock, Eye, EyeOff, Info } from "lucide-react";
import { authService, User, handleUserRedirect } from "@/lib/auth";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already authenticated and redirect if needed
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        // If user is fully authenticated (has both IDs and installations), redirect to dashboard
        if (user.userId && user.emailAuthId && user.githubId && user.installations && user.installations.length > 0) {
          router.push('/dashboard');
        }
      } catch (error) {
        // User is not authenticated, stay on signin page
        console.log('User not authenticated, staying on signin page');
      }
    };

    checkAuth();
  }, [router]);

  const handleGitHubSignIn = () => {
    authService.initiateGitHubAuth();
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await authService.login(email, password);
      } else {
        result = await authService.register(email, password, name);
      }

      // Always redirect to dashboard after successful login/register
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Abstract Geometric Design with Yellowish Theme */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#fef3c7] via-[#fbbf24] to-[#f97316]">
        {/* Abstract Geometric Shapes */}
        <div className="absolute inset-0">
          {/* Large semi-circles */}
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#fbbf24] opacity-30 rounded-full blur-3xl -ml-48 -mb-48"></div>
          <div className="absolute top-20 left-20 w-80 h-80 bg-[#f97316] opacity-25 rounded-full blur-2xl"></div>
          <div className="absolute bottom-40 right-20 w-72 h-72 bg-[#f59e0b] opacity-20 rounded-full blur-2xl"></div>
          
          {/* Triangles */}
          <div className="absolute top-32 left-32 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-[#f59e0b] opacity-40 rotate-12"></div>
          <div className="absolute bottom-32 left-48 w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[70px] border-b-[#f97316] opacity-30 -rotate-45"></div>
          <div className="absolute top-64 right-32 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[85px] border-b-[#fbbf24] opacity-35 rotate-90"></div>
          
          {/* Rectangles and squares */}
          <div className="absolute top-48 left-64 w-32 h-32 bg-[#f59e0b] opacity-20 rotate-45"></div>
          <div className="absolute bottom-64 right-48 w-24 h-24 bg-[#f97316] opacity-25 -rotate-12"></div>
          <div className="absolute top-96 left-96 w-40 h-40 bg-[#fbbf24] opacity-15 rotate-12 border-2 border-[#f59e0b]"></div>
          
          {/* Yellow/Orange accents */}
          <div className="absolute top-40 right-40 w-24 h-24 bg-[#fef3c7] opacity-60 rounded-full blur-xl"></div>
          <div className="absolute bottom-56 left-80 w-20 h-20 bg-[#fef3c7] opacity-50 rounded-full blur-lg"></div>
          
          {/* Starburst shape */}
          <div className="absolute top-1/3 left-1/4 w-16 h-16">
            <div className="absolute inset-0 bg-[#fef3c7] opacity-70 rotate-45"></div>
            <div className="absolute inset-0 bg-[#fef3c7] opacity-70 -rotate-45"></div>
          </div>
          
          {/* Wavy lines pattern */}
          <svg className="absolute bottom-0 left-0 w-full h-64 opacity-10" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path d="M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z" fill="#fbbf24"></path>
            <path d="M0,150 Q300,100 600,150 T1200,150 L1200,200 L0,200 Z" fill="#f97316"></path>
          </svg>
          
          {/* Dotted pattern */}
          <div className="absolute top-1/2 right-1/4 w-48 h-48 opacity-20">
            <div className="grid grid-cols-8 gap-2 w-full h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-[#f59e0b] rounded-full"></div>
              ))}
            </div>
          </div>
          
          {/* Small star shapes */}
          <div className="absolute top-32 right-64 w-3 h-3 bg-white opacity-60 rotate-45"></div>
          <div className="absolute bottom-48 left-32 w-2 h-2 bg-white opacity-50 rotate-45"></div>
          <div className="absolute top-80 right-96 w-2.5 h-2.5 bg-white opacity-55 rotate-45"></div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#fbbf24] to-[#f97316] rounded-2xl flex items-center justify-center shadow-lg relative">
              <span className="text-3xl font-bold text-white">M</span>
              {/* Crown-like accent */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-white opacity-80"></div>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-none">
            <CardHeader className="text-center space-y-2 pb-6">
              <CardTitle className="text-3xl font-bold text-gray-900">
                {isLogin ? 'Welcome back!' : 'Create an account'}
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                {isLogin 
                  ? 'Sign in to get unlimited access to your CI/CD pipelines'
                  : 'Sign up to start using MonkCI'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email/Password Form */}
              <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin}
                        className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-[#fbbf24] to-[#f97316] hover:from-[#f59e0b] hover:to-[#ea580c] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or {isLogin ? 'Login' : 'Sign Up'} with</span>
                </div>
              </div>

              <Button 
                onClick={handleGitHubSignIn}
                variant="outline"
                className="w-full h-14 text-base font-medium border-2 hover:bg-gray-50"
                size="lg"
              >
                <Github className="mr-3 h-5 w-5" />
                Continue with GitHub
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setEmail('');
                  setPassword('');
                  setName('');
                }}
                className="text-[#f97316] hover:text-[#ea580c] font-medium hover:underline"
              >
                {isLogin ? 'Register here' : 'Sign in here'}
              </button>
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              By signing in, you agree to our{' '}
              <a href="#" className="text-[#f97316] hover:text-[#ea580c] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#f97316] hover:text-[#ea580c] hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
