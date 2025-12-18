'use client';

import { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  // { code: 'en', name: 'English', flag: '🇬🇧' }, // Temporarily hidden - TODO: Enable when translations are complete
];

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'transparent';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className }: LanguageSwitcherProps) {
  const [locale, setLocale] = useState('vi');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Read locale from cookie on mount
    const savedLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1];
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale);
    // Set cookie for 1 year
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    // Reload to apply new language
    window.location.reload();
  };

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1.5 rounded-full transition-all duration-300",
            variant === 'transparent' 
              ? "bg-white/10 hover:bg-white/20 text-white border border-white/20" 
              : "bg-slate-100 hover:bg-slate-200 text-slate-700",
            variant === 'compact' && "px-2 py-1 h-8",
            className
          )}
        >
          <span className="text-base leading-none flex items-center">{currentLang.flag}</span>
          <span className={cn(
            "font-medium text-xs uppercase tracking-wide leading-none",
            variant === 'compact' && "hidden sm:inline"
          )}>
            {currentLang.code}
          </span>
          <Globe className={cn(
            "opacity-60 shrink-0",
            variant === 'compact' ? "w-3 h-3" : "w-3.5 h-3.5"
          )} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-40 bg-white/95 backdrop-blur-lg border border-slate-200 shadow-lg"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              "flex items-center gap-3 cursor-pointer px-3 py-2",
              locale === lang.code && "bg-blue-50"
            )}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="flex-1 text-sm font-medium">{lang.name}</span>
            {locale === lang.code && (
              <Check className="w-4 h-4 text-blue-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
