'use client';

import { Loader2, CheckCircle2, Upload, Database, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UpdateStep {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  icon: 'upload' | 'image' | 'database';
}

interface UpdateProgressOverlayProps {
  isVisible: boolean;
  steps: UpdateStep[];
  currentStep: number;
  error?: string;
}

const iconMap = {
  upload: Upload,
  image: Image,
  database: Database,
};

export function UpdateProgressOverlay({
  isVisible,
  steps,
  currentStep,
  error,
}: UpdateProgressOverlayProps) {
  if (!isVisible) return null;

  const completedSteps = steps.filter((s) => s.status === 'completed').length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Đang cập nhật Property
          </h2>
          <p className="text-gray-500 mt-1">
            Vui lòng đợi trong khi hệ thống xử lý...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Tiến trình</span>
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const IconComponent = iconMap[step.icon];
            const isActive = step.status === 'in-progress';
            const isCompleted = step.status === 'completed';
            const isError = step.status === 'error';

            return (
              <div
                key={step.id}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-xl transition-all duration-300',
                  isActive && 'bg-blue-50 ring-2 ring-blue-200',
                  isCompleted && 'bg-green-50',
                  isError && 'bg-red-50'
                )}
              >
                {/* Step Icon */}
                <div
                  className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                    step.status === 'pending' && 'bg-gray-100',
                    isActive && 'bg-blue-500',
                    isCompleted && 'bg-green-500',
                    isError && 'bg-red-500'
                  )}
                >
                  {isActive ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <IconComponent
                      className={cn(
                        'w-5 h-5',
                        step.status === 'pending' ? 'text-gray-400' : 'text-white'
                      )}
                    />
                  )}
                </div>

                {/* Step Label */}
                <div className="flex-1">
                  <p
                    className={cn(
                      'font-medium transition-colors duration-300',
                      step.status === 'pending' && 'text-gray-400',
                      isActive && 'text-blue-700',
                      isCompleted && 'text-green-700',
                      isError && 'text-red-700'
                    )}
                  >
                    {step.label}
                  </p>
                  {isActive && (
                    <p className="text-xs text-blue-500 mt-0.5 animate-pulse">
                      Đang xử lý...
                    </p>
                  )}
                  {isCompleted && (
                    <p className="text-xs text-green-500 mt-0.5">Hoàn thành</p>
                  )}
                  {isError && (
                    <p className="text-xs text-red-500 mt-0.5">Có lỗi xảy ra</p>
                  )}
                </div>

                {/* Step Number */}
                <span
                  className={cn(
                    'text-xs font-bold px-2 py-1 rounded-full',
                    step.status === 'pending' && 'bg-gray-100 text-gray-400',
                    isActive && 'bg-blue-100 text-blue-600',
                    isCompleted && 'bg-green-100 text-green-600',
                    isError && 'bg-red-100 text-red-600'
                  )}
                >
                  {index + 1}/{steps.length}
                </span>
              </div>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Không đóng hoặc refresh trang khi đang cập nhật
        </p>
      </div>
    </div>
  );
}
