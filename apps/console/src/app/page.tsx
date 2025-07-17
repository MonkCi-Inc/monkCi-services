import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Zap, Shield, Clock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">M</span>
              </div>
              <h1 className="text-xl font-semibold">Monk CI</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button>
                  <Github className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Faster CI/CD with{' '}
            <span className="text-primary">Monk CI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Stop waiting for builds. Get 3× faster CPUs and 20× faster NVMe cache. 
            Ship up to 8× sooner and slash cloud costs by 75%.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" className="text-lg px-8">
                <Github className="h-5 w-5 mr-2" />
                Get Started with GitHub
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Monk CI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3× Faster CPUs</CardTitle>
              <CardDescription>
                  Get 2500 single-core performance vs 1403 on GitHub Actions
              </CardDescription>
            </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our runners provide significantly more computing power, 
                  reducing build times dramatically.
                </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle>20× Faster Cache</CardTitle>
              <CardDescription>
                  NVMe storage with 20 Gbps vs 1 Gbps on GitHub Actions
              </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                  Lightning-fast dependency caching means your builds start 
                  instantly, not after minutes of downloading.
                </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                  Built on Google Cloud with enterprise-grade security
              </CardDescription>
            </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your code and secrets are protected with the same security 
                  standards as Google's own infrastructure.
                </p>
            </CardContent>
          </Card>
          </div>
        </div>
      </section>

      {/* Performance Comparison */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Real Performance Numbers
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
                <CardTitle>Build Time Comparison</CardTitle>
              <CardDescription>
                  Real-world build times on large repositories
              </CardDescription>
            </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Yarn workspaces (4k packages)</span>
                    <div className="text-right">
                      <span className="text-muted-foreground line-through">5m 50s</span>
                      <span className="text-green-600 font-bold ml-2">22s</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">PIP (350MB wheels)</span>
                    <div className="text-right">
                      <span className="text-muted-foreground line-through">3m 20s</span>
                      <span className="text-green-600 font-bold ml-2">14s</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Gradle multi-project (220 mods)</span>
                    <div className="text-right">
                      <span className="text-muted-foreground line-through">7m 05s</span>
                      <span className="text-green-600 font-bold ml-2">40s</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Docker image (1.5GB, 10 layers)</span>
                    <div className="text-right">
                      <span className="text-muted-foreground line-through">9m 30s</span>
                      <span className="text-green-600 font-bold ml-2">45s</span>
                    </div>
              </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Cost Savings</CardTitle>
              <CardDescription>
                  How much you can save with Monk CI
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Build time reduction</span>
                    <span className="text-green-600 font-bold">Up to 8× faster</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cloud cost savings</span>
                    <span className="text-green-600 font-bold">Up to 75% less</span>
                </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Developer time saved</span>
                    <span className="text-green-600 font-bold">57 min/day</span>
                </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Concurrent jobs</span>
                    <span className="text-green-600 font-bold">Unlimited</span>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Speed Up Your CI/CD?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who've already made the switch to Monk CI
          </p>
          <Link href="/auth/signin">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              <Github className="h-5 w-5 mr-2" />
              Start Building Faster Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
