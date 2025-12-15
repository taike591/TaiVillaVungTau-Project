import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  className?: string;
  variant?: 'default' | 'tropical' | 'warning';
  showIcon?: boolean;
}

export function ErrorState({
  title = 'Đã xảy ra lỗi',
  message = 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
  onRetry,
  onGoHome,
  className,
  variant = 'tropical',
  showIcon = true,
}: ErrorStateProps) {
  return (
    <div className={cn('flex items-center justify-center min-h-[400px] p-4', className)}>
      <Alert variant={variant} className="max-w-md shadow-warm-md">
        {showIcon && <AlertCircle className="h-5 w-5" />}
        <AlertTitle className="text-lg font-bold mb-2">{title}</AlertTitle>
        <AlertDescription className="mb-4">
          <p className="text-[var(--warm-gray-700)]">{message}</p>
        </AlertDescription>
        
        <div className="flex gap-3 mt-4">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="sunset"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Thử lại
            </Button>
          )}
          {onGoHome && (
            <Button
              onClick={onGoHome}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Về trang chủ
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
}

interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className }: InlineErrorProps) {
  return (
    <Alert variant="destructive" className={cn('my-2', className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

interface PropertyErrorProps {
  type: 'missing-price' | 'missing-images' | 'missing-amenities' | 'missing-distance' | 'missing-code';
  className?: string;
}

export function PropertyError({ type, className }: PropertyErrorProps) {
  const errorMessages = {
    'missing-price': 'Liên hệ để biết giá',
    'missing-images': 'Đang cập nhật hình ảnh',
    'missing-amenities': 'Đang cập nhật tiện ích',
    'missing-distance': '',
    'missing-code': 'MS:---',
  };

  const message = errorMessages[type];
  
  if (!message) return null;

  return (
    <Alert variant="info" className={cn('text-sm', className)}>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
