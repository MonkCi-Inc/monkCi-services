import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Portal Theme Test
          </h1>
          <p className="text-muted-foreground text-lg">
            Testing shadcn/ui components and theme setup
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Primary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Primary Theme</CardTitle>
              <CardDescription>
                Testing primary colors and styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </CardContent>
          </Card>

          {/* Color Palette Card */}
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>
                Testing all theme colors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-8 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs">
                  Primary
                </div>
                <div className="h-8 bg-secondary rounded flex items-center justify-center text-secondary-foreground text-xs">
                  Secondary
                </div>
                <div className="h-8 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                  Muted
                </div>
                <div className="h-8 bg-accent rounded flex items-center justify-center text-accent-foreground text-xs">
                  Accent
                </div>
                <div className="h-8 bg-destructive rounded flex items-center justify-center text-destructive-foreground text-xs">
                  Destructive
                </div>
                <div className="h-8 bg-card rounded border flex items-center justify-center text-card-foreground text-xs">
                  Card
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography Card */}
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Testing text styles and colors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Heading 1</h1>
              <h2 className="text-xl font-semibold text-foreground">Heading 2</h2>
              <p className="text-foreground">Regular text with foreground color</p>
              <p className="text-muted-foreground">Muted text for secondary information</p>
              <p className="text-sm text-muted-foreground">Small muted text</p>
            </CardContent>
          </Card>

          {/* Border Test Card */}
          <Card>
            <CardHeader>
              <CardTitle>Borders & Spacing</CardTitle>
              <CardDescription>
                Testing border radius and spacing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm">Card with border and padding</p>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm">Muted background with rounded corners</p>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Elements</CardTitle>
              <CardDescription>
                Testing hover and focus states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" size="lg">
                Large Button
              </Button>
              <Button variant="outline" className="w-full">
                Full Width Outline
              </Button>
              <Button variant="ghost" size="sm" className="w-full">
                Small Ghost Button
              </Button>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Status</CardTitle>
              <CardDescription>
                Current theme configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Background:</span>
                  <span className="text-foreground">✓ Configured</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Colors:</span>
                  <span className="text-foreground">✓ HSL Variables</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Components:</span>
                  <span className="text-foreground">✓ shadcn/ui</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dark Mode:</span>
                  <span className="text-foreground">✓ Ready</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Theme setup complete! All components are using the configured design system.
          </p>
        </div>
      </div>
    </div>
  );
}
