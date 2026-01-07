'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

// Route to label mapping
const ROUTE_LABELS: Record<string, string> = {
  '/taike-manage': 'Thống Kê',
  '/taike-manage/properties': 'Quản Lý Villa',
  '/taike-manage/properties/new': 'Thêm Mới',
  '/taike-manage/locations': 'Quản Lý Vị Trí',
  '/taike-manage/property-types': 'Loại Hình BĐS',
  '/taike-manage/requests': 'Yêu Cầu Tư Vấn',
  '/taike-manage/amenities': 'Tiện Nghi',
  '/taike-manage/labels': 'Nhãn',
};

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive: boolean;
}

export function AdminBreadcrumb() {
  const pathname = usePathname();
  
  // Build breadcrumb items based on current path
  const buildBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];
    
    // Always start with home (dashboard)
    items.push({
      label: 'Thống Kê',
      href: '/taike-manage',
      isActive: pathname === '/taike-manage',
    });
    
    // If we're on dashboard, that's it
    if (pathname === '/taike-manage') {
      return items;
    }
    
    // Check for specific routes
    const segments = pathname.split('/').filter(Boolean);
    
    // /taike-manage/properties
    if (segments[1] === 'properties') {
      items.push({
        label: 'Quản Lý Villa',
        href: '/taike-manage/properties',
        isActive: pathname === '/taike-manage/properties',
      });
      
      // /taike-manage/properties/new
      if (segments[2] === 'new') {
        items.push({
          label: 'Thêm Mới',
          href: '/taike-manage/properties/new',
          isActive: true,
        });
      }
      // /taike-manage/properties/[id]/edit
      else if (segments[2] && segments[3] === 'edit') {
        items.push({
          label: 'Chỉnh Sửa',
          href: pathname,
          isActive: true,
        });
      }
    }
    // /taike-manage/locations
    else if (segments[1] === 'locations') {
      items.push({
        label: 'Quản Lý Vị Trí',
        href: '/taike-manage/locations',
        isActive: pathname === '/taike-manage/locations',
      });
      
      if (segments[2] === 'new') {
        items.push({
          label: 'Thêm Mới',
          href: pathname,
          isActive: true,
        });
      } else if (segments[2] && segments[3] === 'edit') {
        items.push({
          label: 'Chỉnh Sửa',
          href: pathname,
          isActive: true,
        });
      }
    }
    // /taike-manage/property-types
    else if (segments[1] === 'property-types') {
      items.push({
        label: 'Loại Hình BĐS',
        href: '/taike-manage/property-types',
        isActive: pathname === '/taike-manage/property-types',
      });
      
      if (segments[2] === 'new') {
        items.push({
          label: 'Thêm Mới',
          href: pathname,
          isActive: true,
        });
      } else if (segments[2] && segments[3] === 'edit') {
        items.push({
          label: 'Chỉnh Sửa',
          href: pathname,
          isActive: true,
        });
      }
    }
    // /taike-manage/requests
    else if (segments[1] === 'requests') {
      items.push({
        label: 'Yêu Cầu Tư Vấn',
        href: '/taike-manage/requests',
        isActive: true,
      });
    }
    // /taike-manage/amenities
    else if (segments[1] === 'amenities') {
      items.push({
        label: 'Tiện Nghi',
        href: '/taike-manage/amenities',
        isActive: true,
      });
    }
    // /taike-manage/labels
    else if (segments[1] === 'labels') {
      items.push({
        label: 'Nhãn',
        href: '/taike-manage/labels',
        isActive: true,
      });
    }
    
    return items;
  };
  
  const breadcrumbs = buildBreadcrumbs();
  
  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link 
        href="/taike-manage" 
        className="text-gray-400 hover:text-gray-600 transition-colors"
        title="Dashboard"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-300" />
          {item.isActive ? (
            <span className="text-gray-700 font-medium">{item.label}</span>
          ) : (
            <Link 
              href={item.href}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
