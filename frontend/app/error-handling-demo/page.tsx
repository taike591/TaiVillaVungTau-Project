'use client';

import { useState } from 'react';
import { ErrorState, InlineError, PropertyError } from '@/components/shared/ErrorState';
import { EmptyState, NoProperties, NoSearchResults, NoLocationResults } from '@/components/shared/EmptyState';
import { PropertyCardSkeleton, PageLoading, LoadingSpinner } from '@/components/shared/LoadingState';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorHandlingDemoPage() {
  const [activeDemo, setActiveDemo] = useState<string>('error-states');

  return (
    <div className="min-h-screen bg-[var(--warm-gray-50)] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--warm-gray-900)] mb-4">
            Error Handling Demo
          </h1>
          <p className="text-[var(--warm-gray-600)] text-lg">
            Tropical-themed error handling components
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Button
            variant={activeDemo === 'error-states' ? 'sunset' : 'outline'}
            onClick={() => setActiveDemo('error-states')}
          >
            Error States
          </Button>
          <Button
            variant={activeDemo === 'empty-states' ? 'sunset' : 'outline'}
            onClick={() => setActiveDemo('empty-states')}
          >
            Empty States
          </Button>
          <Button
            variant={activeDemo === 'loading-states' ? 'sunset' : 'outline'}
            onClick={() => setActiveDemo('loading-states')}
          >
            Loading States
          </Button>
          <Button
            variant={activeDemo === 'alerts' ? 'sunset' : 'outline'}
            onClick={() => setActiveDemo('alerts')}
          >
            Alerts
          </Button>
          <Button
            variant={activeDemo === 'property-errors' ? 'sunset' : 'outline'}
            onClick={() => setActiveDemo('property-errors')}
          >
            Property Errors
          </Button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-warm-lg p-8">
          {activeDemo === 'error-states' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Full Page Error</h2>
                <ErrorState
                  title="Không thể tải dữ liệu"
                  message="Đã xảy ra lỗi khi tải danh sách villa. Vui lòng thử lại sau."
                  onRetry={() => alert('Retry clicked')}
                  onGoHome={() => alert('Go home clicked')}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Inline Error</h2>
                <div className="max-w-md">
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded-lg px-4 py-2 mb-2"
                    placeholder="example@email.com"
                  />
                  <InlineError message="Email không hợp lệ. Vui lòng kiểm tra lại." />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Warning Error</h2>
                <ErrorState
                  title="Cảnh báo"
                  message="Một số tính năng có thể không hoạt động đúng."
                  variant="warning"
                  onRetry={() => alert('Retry clicked')}
                />
              </div>
            </div>
          )}

          {activeDemo === 'empty-states' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">No Properties (with filters)</h2>
                <NoProperties
                  hasFilters={true}
                  onClearFilters={() => alert('Clear filters')}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">No Search Results</h2>
                <NoSearchResults
                  searchQuery="villa biển vip"
                  onClearSearch={() => alert('Clear search')}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">No Location Results</h2>
                <NoLocationResults
                  location="Bãi Trước"
                  onClearLocation={() => alert('Clear location')}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Custom Empty State</h2>
                <EmptyState
                  title="Chưa có đánh giá"
                  message="Villa này chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!"
                  icon="building"
                  actionLabel="Viết đánh giá"
                  onAction={() => alert('Write review')}
                />
              </div>
            </div>
          )}

          {activeDemo === 'loading-states' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Page Loading</h2>
                <PageLoading message="Đang tải danh sách villa..." />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Loading Spinners</h2>
                <div className="flex gap-8 items-center justify-center">
                  <div className="text-center">
                    <LoadingSpinner size="sm" variant="tropical" />
                    <p className="text-sm mt-2">Small</p>
                  </div>
                  <div className="text-center">
                    <LoadingSpinner size="md" variant="tropical" />
                    <p className="text-sm mt-2">Medium</p>
                  </div>
                  <div className="text-center">
                    <LoadingSpinner size="lg" variant="tropical" />
                    <p className="text-sm mt-2">Large</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Property Card Skeleton</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <PropertyCardSkeleton count={3} />
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'alerts' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Alert Variants</h2>
                
                <div className="space-y-4">
                  <Alert variant="tropical">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Tropical Alert</AlertTitle>
                    <AlertDescription>
                      This is a tropical-themed alert with warm orange gradient.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="info">
                    <Info className="h-5 w-5" />
                    <AlertTitle>Info Alert</AlertTitle>
                    <AlertDescription>
                      This is an info alert with tropical cyan colors.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="warning">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Warning Alert</AlertTitle>
                    <AlertDescription>
                      This is a warning alert with tropical yellow colors.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="success">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Success Alert</AlertTitle>
                    <AlertDescription>
                      This is a success alert with green colors.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="destructive">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Error Alert</AlertTitle>
                    <AlertDescription>
                      This is an error alert with red colors.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'property-errors' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Property-Specific Errors</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Missing Price</h3>
                    <PropertyError type="missing-price" />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Missing Amenities</h3>
                    <PropertyError type="missing-amenities" />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Missing Images</h3>
                    <PropertyError type="missing-images" />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Missing Code</h3>
                    <div className="inline-block">
                      <span className="text-sm text-[var(--warm-gray-600)]">
                        Code fallback: <strong>MS:---</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 mt-8">Missing Data Examples</h2>
                <div className="bg-gradient-warm-glow rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Missing Price Display</h3>
                    <div className="bg-gradient-warm-glow rounded-lg p-4 text-center border-2 border-[var(--tropical-orange-200)]">
                      <p className="text-[var(--tropical-orange-600)] font-bold text-lg">
                        Liên hệ để biết giá
                      </p>
                      <p className="text-xs text-[var(--warm-gray-600)] mt-1">
                        Vui lòng liên hệ 0868947734 (Thanh Tài)
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Missing Images Placeholder</h3>
                    <div className="w-full h-56 bg-gradient-sunset flex items-center justify-center rounded-lg">
                      <div className="text-center text-white">
                        <svg className="h-16 w-16 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="text-sm opacity-75">Đang cập nhật hình ảnh</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-[var(--warm-gray-600)]">
          <p>All components use tropical-themed styling with warm colors and gradients</p>
        </div>
      </div>
    </div>
  );
}
