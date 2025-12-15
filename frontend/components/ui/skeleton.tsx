import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Skeleton variants with tropical styling - Requirements 6.4
const skeletonVariants = cva(
  "animate-pulse rounded-md",
  {
    variants: {
      variant: {
        default: "bg-accent",
        tropical: "bg-gradient-to-r from-[var(--tropical-orange-100)] via-[var(--tropical-yellow-100)] to-[var(--tropical-cyan-100)]",
        warm: "bg-[var(--warm-gray-200)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Skeleton({ 
  className, 
  variant,
  ...props 
}: React.ComponentProps<"div"> & VariantProps<typeof skeletonVariants>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  )
}

// Tropical loading spinner component - Requirements 6.4
function TropicalSpinner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      {...props}
    >
      <div className="absolute h-12 w-12 animate-spin rounded-full border-4 border-[var(--tropical-orange-200)] border-t-[var(--tropical-orange-500)]" />
      <div className="absolute h-8 w-8 animate-spin rounded-full border-4 border-[var(--tropical-cyan-200)] border-t-[var(--tropical-cyan-500)] [animation-direction:reverse] [animation-duration:1.5s]" />
    </div>
  )
}

// Tropical loading dots component - Requirements 6.4
function TropicalLoadingDots({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
    >
      <div className="h-3 w-3 animate-bounce rounded-full bg-[var(--tropical-orange-500)] [animation-delay:-0.3s]" />
      <div className="h-3 w-3 animate-bounce rounded-full bg-[var(--tropical-yellow-500)] [animation-delay:-0.15s]" />
      <div className="h-3 w-3 animate-bounce rounded-full bg-[var(--tropical-cyan-500)]" />
    </div>
  )
}

export { Skeleton, skeletonVariants, TropicalSpinner, TropicalLoadingDots }
