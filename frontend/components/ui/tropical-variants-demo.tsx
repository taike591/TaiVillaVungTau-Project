/**
 * Tropical Variants Demo Component
 * 
 * This component demonstrates all the tropical variants added to shadcn components.
 * Requirements: 6.1, 6.2, 6.3, 6.4
 * 
 * Usage: Import this component to see examples of all tropical styling options.
 */

import { Button } from './button';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Badge } from './badge';
import { Skeleton, TropicalSpinner, TropicalLoadingDots } from './skeleton';

export function TropicalVariantsDemo() {
  return (
    <div className="container-custom py-8 space-y-8">
      <h1 className="text-4xl font-bold text-gradient-sunset mb-8">
        Tropical Component Variants
      </h1>

      {/* Button Variants - Requirements 6.2 */}
      <Card shadow="warm">
        <CardHeader>
          <CardTitle>Button Tropical Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default Button</Button>
            <Button variant="sunset">Sunset Gradient</Button>
            <Button variant="ocean">Ocean Gradient</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </CardContent>
      </Card>

      {/* Card Shadow Variants - Requirements 6.1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card shadow="default">
          <CardHeader>
            <CardTitle>Default Shadow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--warm-gray-600)]">
              Standard card with default shadow
            </p>
          </CardContent>
        </Card>

        <Card shadow="warm">
          <CardHeader>
            <CardTitle>Warm Shadow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--warm-gray-600)]">
              Card with warm orange-tinted shadow
            </p>
          </CardContent>
        </Card>

        <Card shadow="warm-lg">
          <CardHeader>
            <CardTitle>Warm Large Shadow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--warm-gray-600)]">
              Card with larger warm shadow
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Badge Variants - Requirements 6.3 */}
      <Card shadow="warm">
        <CardHeader>
          <CardTitle>Badge Tropical Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="coral">Coral</Badge>
            <Badge variant="turquoise">Turquoise</Badge>
            <Badge variant="sunset">Sunset Gradient</Badge>
            <Badge variant="ocean">Ocean Gradient</Badge>
            <Badge variant="yellow">Yellow</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Loading Components - Requirements 6.4 */}
      <Card shadow="warm">
        <CardHeader>
          <CardTitle>Tropical Loading Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Skeleton Variants</h3>
              <div className="space-y-2">
                <Skeleton variant="default" className="h-10 w-full" />
                <Skeleton variant="tropical" className="h-10 w-full" />
                <Skeleton variant="warm" className="h-10 w-full" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Tropical Spinner</h3>
              <TropicalSpinner />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Tropical Loading Dots</h3>
              <TropicalLoadingDots />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hover Effects Demo */}
      <Card shadow="warm" className="hover-lift">
        <CardHeader>
          <CardTitle>Hover Effects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[var(--warm-gray-600)]">
            This card has the hover-lift effect. Try hovering over it!
          </p>
          <div className="mt-4 flex gap-4">
            <Button variant="sunset" className="hover-glow-orange">
              Hover for Glow
            </Button>
            <Button variant="ocean" className="hover-glow-cyan">
              Hover for Glow
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
