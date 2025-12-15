'use client';

import { useEffect, useState } from 'react';
import { Loader2, Check, Upload, Save, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpdateLoadingOverlayProps {
  isVisible: boolean;
  uploadProgress?: number; // 0-100 for image upload progress
  currentStep?: 'uploading' | 'updating' | 'saving' | 'complete';
}

const STEPS = [
  { id: 'uploading', label: 'Đang upload ảnh', icon: Upload },
  { id: 'updating', label: 'Đang cập nhật thông tin', icon: Save },
  { id: 'saving', label: 'Lưu thay đổi', icon: ImageIcon },
];

export function UpdateLoadingOverlay({ 
  isVisible, 
  uploadProgress = 0,
  currentStep = 'uploading'
}: UpdateLoadingOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  // Animate progress based on current step
  useEffect(() => {
    if (!isVisible) {
      setVisible(false);
      setProgress(0);
      return;
    }
    
    setVisible(true);
    
    // Calculate overall progress based on step
    let baseProgress = 0;
    switch (currentStep) {
      case 'uploading':
        baseProgress = Math.min(33, (uploadProgress / 100) * 33);
        break;
      case 'updating':
        baseProgress = 33 + 33;
        break;
      case 'saving':
        baseProgress = 66 + 17;
        break;
      case 'complete':
        baseProgress = 100;
        break;
    }
    
    setProgress(baseProgress);
  }, [isVisible, currentStep, uploadProgress]);

  if (!visible) return null;

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />
      
      {/* Modal Content */}
      <div 
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Đang cập nhật Property</h3>
          <p className="text-gray-500 mt-1">Vui lòng chờ trong giây lát...</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Tiến trình</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isComplete = index < currentStepIndex;
            const isCurrent = step.id === currentStep;
            const isPending = index > currentStepIndex;

            return (
              <div 
                key={step.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
                  isComplete && "bg-green-50",
                  isCurrent && "bg-cyan-50 ring-2 ring-cyan-200",
                  isPending && "bg-gray-50 opacity-50"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  isComplete && "bg-green-500 text-white",
                  isCurrent && "bg-cyan-500 text-white",
                  isPending && "bg-gray-300 text-gray-500"
                )}>
                  {isComplete ? (
                    <Check className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span className={cn(
                  "font-medium",
                  isComplete && "text-green-700",
                  isCurrent && "text-cyan-700",
                  isPending && "text-gray-500"
                )}>
                  {step.label}
                </span>
                {isCurrent && (
                  <span className="ml-auto text-xs text-cyan-600 animate-pulse">
                    Đang xử lý...
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Warning */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Không đóng trang này trong khi đang cập nhật
        </p>
      </div>
    </div>
  );
}
