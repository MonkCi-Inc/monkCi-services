'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Zap, TrendingDown, CheckCircle2, Sparkles, Clock, Shield, ArrowRight, Rocket, Layers, Cpu, Infinity, GitBranch, Code, Server, Cloud } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef3c7] via-[#fbbf24] to-[#f97316] overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-200/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-yellow-300/50 shadow-lg">
                <span className="text-xl font-bold text-gray-900">M</span>
              </div>
              <h1 className="text-xl font-semibold text-black">MonkCI</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-black hover:text-yellow-100 transition-colors font-medium">Features</a>
              <a href="#performance" className="text-black hover:text-yellow-100 transition-colors font-medium">Performance</a>
              <a href="#pricing" className="text-black hover:text-yellow-100 transition-colors font-medium">Pricing</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost" className="text-black hover:bg-white/10">
                  Log In
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button className="bg-yellow-200/80 backdrop-blur-sm text-gray-900 border border-yellow-300/50 hover:bg-yellow-300/80 shadow-lg font-semibold">
                  <Github className="h-4 w-4 mr-2" />
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Split Layout */}
      <div className="min-h-screen flex items-center pt-20 pb-12">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content Area */}
          <div className="space-y-8 z-10">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Unlock Blazing-Fast CI/CD You Thought Was Out of Reach –{' '}
                <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
                  Now Just One Click Away!
                </span>
              </h1>
              <p className="text-xl text-gray-800 leading-relaxed">
                AI-accelerated Continuous Integration built for high-performance engineering teams. 
                Get 10× faster builds and 75% lower costs with intelligent caching.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signin">
                <Button 
                  size="lg" 
                  className="bg-gray-900 text-white hover:bg-gray-800 text-lg font-semibold px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all"
                >
                  Start Project <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Stats Pills */}
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full border-2 border-white/50 shadow-lg">
                <span className="text-sm font-medium text-gray-900">10× Faster</span>
              </div>
              <div className="bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full border-2 border-white/50 shadow-lg">
                <span className="text-sm font-medium text-gray-900">75% Savings</span>
              </div>
              <div className="bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full border-2 border-white/50 shadow-lg">
                <span className="text-sm font-medium text-gray-900">AI-Powered</span>
              </div>
            </div>
          </div>

          {/* Right Visual Area - Abstract Network */}
          <div className="relative h-[600px] lg:h-[700px] flex items-center justify-center">
            {/* Glowing Background Circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
              <div className="absolute w-80 h-80 bg-yellow-300/30 rounded-full blur-2xl"></div>
              <div className="absolute w-64 h-64 bg-orange-300/30 rounded-full blur-xl"></div>
            </div>

            {/* Central Statistic */}
            <div className="absolute z-20 text-center">
              <div className="text-8xl md:text-9xl font-bold text-gray-900 drop-shadow-lg mb-2">
                10×
              </div>
              <div className="text-2xl text-gray-800 font-medium">Faster Builds</div>
            </div>

            {/* Concentric Circles/Arcs */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="150" fill="none" stroke="gray" strokeWidth="2" opacity="0.4" />
              <circle cx="200" cy="200" r="120" fill="none" stroke="gray" strokeWidth="2" opacity="0.4" />
              <circle cx="200" cy="200" r="90" fill="none" stroke="gray" strokeWidth="2" opacity="0.4" />
              <circle cx="200" cy="200" r="60" fill="none" stroke="gray" strokeWidth="2" opacity="0.4" />
            </svg>

            {/* Floating Icons - Positioned around circles */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2">
              <div className="w-16 h-16 bg-gray-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-gray-700/50 shadow-xl">
                <Cloud className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="absolute top-1/2 -left-8 -translate-y-1/2">
              <div className="w-16 h-16 bg-gray-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-gray-700/50 shadow-xl">
                <Server className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="absolute top-1/2 -right-8 -translate-y-1/2">
              <div className="w-16 h-16 bg-gray-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-gray-700/50 shadow-xl">
                <Code className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="absolute bottom-20 left-1/4 -translate-x-1/2">
              <div className="w-16 h-16 bg-gray-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-gray-700/50 shadow-xl">
                <GitBranch className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="absolute bottom-20 right-1/4 translate-x-1/2">
              <div className="w-16 h-16 bg-gray-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-gray-700/50 shadow-xl">
                <Rocket className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="absolute top-1/4 left-1/4">
              <div className="w-14 h-14 bg-gray-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-gray-700/50 shadow-xl">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="absolute top-1/4 right-1/4">
              <div className="w-14 h-14 bg-gray-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-gray-700/50 shadow-xl">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="absolute bottom-1/4 left-1/3">
              <div className="w-14 h-14 bg-gray-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-gray-700/50 shadow-xl">
                <Shield className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="absolute bottom-1/4 right-1/3">
              <div className="w-14 h-14 bg-gray-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-gray-700/50 shadow-xl">
                <Infinity className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 400 400">
              <line x1="200" y1="50" x2="200" y2="200" stroke="gray" strokeWidth="1" />
              <line x1="50" y1="200" x2="200" y2="200" stroke="gray" strokeWidth="1" />
              <line x1="350" y1="200" x2="200" y2="200" stroke="gray" strokeWidth="1" />
              <line x1="200" y1="350" x2="200" y2="200" stroke="gray" strokeWidth="1" />
              <line x1="100" y1="100" x2="200" y2="200" stroke="gray" strokeWidth="1" />
              <line x1="300" y1="100" x2="200" y2="200" stroke="gray" strokeWidth="1" />
              <line x1="100" y1="300" x2="200" y2="200" stroke="gray" strokeWidth="1" />
              <line x1="300" y1="300" x2="200" y2="200" stroke="gray" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/40 backdrop-blur-sm relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose MonkCI?</h2>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto">
              Built for the AI era with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/20 backdrop-blur-xl border-2 border-white/50 text-gray-900 shadow-lg rounded-[2rem] hover:bg-white/25 transition-all">
              <CardHeader className="pb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-gray-900">10× Faster</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800">
                  Optimized caching and autoscaling deliver blazing-fast build times
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/20 backdrop-blur-xl border-2 border-white/50 text-gray-900 shadow-lg rounded-[2rem] hover:bg-white/25 transition-all">
              <CardHeader className="pb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <TrendingDown className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-gray-900">75% Lower Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800">
                  Intelligent resource management reduces CI spending significantly
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/20 backdrop-blur-xl border-2 border-white/50 text-gray-900 shadow-lg rounded-[2rem] hover:bg-white/25 transition-all">
              <CardHeader className="pb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <CheckCircle2 className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-gray-900">Drop-in Replacement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800">
                  Seamlessly replace GitHub Actions with zero configuration
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/20 backdrop-blur-xl border-2 border-white/50 text-gray-900 shadow-lg rounded-[2rem] hover:bg-white/25 transition-all">
              <CardHeader className="pb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#fbbf24] to-[#f97316] rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <Rocket className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-gray-900">AI-Accelerated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800">
                  Intelligent caching and predictive builds for maximum efficiency
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section id="performance" className="py-20 px-4 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real Performance Numbers</h2>
            <p className="text-xl text-gray-800">See the difference in real-world scenarios</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white/20 backdrop-blur-xl border-2 border-white/50 text-gray-900 shadow-lg rounded-[2rem] hover:bg-white/25 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl text-gray-900">
                  <Clock className="w-6 h-6 text-[#6366f1]" />
                  <span>Build Time Comparison</span>
                </CardTitle>
                <CardDescription className="text-gray-700">Real-world performance on large repositories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/30">
                    <span className="font-medium text-gray-900">Yarn workspaces (4k packages)</span>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 line-through mr-2">5m 50s</span>
                      <span className="font-bold text-[#f97316]">22s</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/30">
                    <span className="font-medium text-gray-900">PIP (350MB wheels)</span>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 line-through mr-2">3m 20s</span>
                      <span className="font-bold text-[#f97316]">14s</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/30">
                    <span className="font-medium text-gray-900">Gradle multi-project (220 mods)</span>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 line-through mr-2">7m 05s</span>
                      <span className="font-bold text-[#f97316]">40s</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-medium text-gray-900">Docker image (1.5GB, 10 layers)</span>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 line-through mr-2">9m 30s</span>
                      <span className="font-bold text-[#f97316]">45s</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/20 backdrop-blur-xl border-2 border-white/50 text-gray-900 shadow-lg rounded-[2rem] hover:bg-white/25 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl text-gray-900">
                  <Infinity className="w-6 h-6 text-[#8b5cf6]" />
                  <span>Technical Excellence</span>
                </CardTitle>
                <CardDescription className="text-gray-700">Superior infrastructure and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">3× Faster CPUs</h3>
                      <p className="text-sm text-gray-800">2500 single-core performance vs 1403 on GitHub Actions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <Layers className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">20× Faster Cache</h3>
                      <p className="text-sm text-gray-800">NVMe storage with 20 Gbps vs 1 Gbps on GitHub Actions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Enterprise Security</h3>
                      <p className="text-sm text-gray-800">Built on Google Cloud with enterprise-grade security</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white/20 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Speed Up Your CI/CD?
          </h2>
          <p className="text-xl text-gray-800 mb-10 max-w-2xl mx-auto">
            Join thousands of developers who've already made the switch to MonkCI
          </p>
          <Link href="/auth/signin">
            <Button 
              size="lg" 
              className="bg-gray-900 text-white hover:bg-gray-800 text-lg font-semibold px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all"
            >
              <Github className="h-5 w-5 mr-2" />
              Start Building Faster Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - Partnership Logos */}
      <footer className="py-12 px-4 border-t border-white/30">
        <div className="container mx-auto">
          <p className="text-center text-gray-700 text-sm mb-6 font-medium">Trusted by engineering teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="text-gray-800 font-semibold">GitHub</div>
            <div className="text-gray-800 font-semibold">Google Cloud</div>
            <div className="text-gray-800 font-semibold">Kubernetes</div>
            <div className="text-gray-800 font-semibold">Docker</div>
            <div className="text-gray-800 font-semibold">CI/CD</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
