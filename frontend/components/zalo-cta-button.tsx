"use client";

import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ZaloCTAButtonProps {
  className?: string;
  variant?: "default" | "compact" | "icon";
  size?: "sm" | "default" | "lg";
}

/**
 * Zalo CTA Button Component
 * 
 * A reusable button component for Zalo contact with tropical styling.
 * Can be used inline in various contexts (navbar, footer, property cards, etc.)
 * 
 * Requirements: 10.3, 10.5
 */
export function ZaloCTAButton({
  className,
  variant = "default",
  size = "default",
}: ZaloCTAButtonProps) {
  const handleClick = () => {
    window.open("https://zalo.me/0868947734", "_blank");
  };

  if (variant === "icon") {
    return (
      <Button
        onClick={handleClick}
        size={size === "sm" ? "icon-sm" : size === "lg" ? "icon-lg" : "icon"}
        variant="sunset"
        className={cn("hover:scale-110 transition-all", className)}
        aria-label="Liên hệ qua Zalo"
      >
        <Phone className="size-4" />
      </Button>
    );
  }

  if (variant === "compact") {
    return (
      <Button
        onClick={handleClick}
        size={size}
        variant="sunset"
        className={cn("hover:scale-105 transition-all font-bold", className)}
      >
        <Phone className="size-4" />
        0868947734
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      size={size}
      variant="sunset"
      className={cn(
        "hover:scale-105 transition-all font-bold shadow-warm-lg hover:shadow-warm-xl",
        className
      )}
    >
      <Phone className="size-5" />
      Liên hệ Zalo: 0868947734 (Thanh Tài)
    </Button>
  );
}
