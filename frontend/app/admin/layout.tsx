'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  MapPin,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WebSocketProvider } from '@/components/providers/WebSocketProvider';
import { NotificationBell } from '@/components/admin/NotificationBell';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout, isAuthenticated, fetchUser, isHydrated } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth check effect
  useEffect(() => {
    // Wait for Zustand to hydrate before checking auth
    if (!isHydrated) return;
    

    
    // 1. If no token -> Redirect to login immediately
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    // 2. If token exists but no user -> Try to fetch user data
    if (!user) {
      fetchUser().catch(() => {
        logout();
        router.push('/login');
      });
    }
  }, [isHydrated, isAuthenticated, user, router, logout, fetchUser]);

  // Close mobile menu on escape key - MUST be before any conditional returns
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open - MUST be before any conditional returns
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Show loading while hydrating or fetching user - AFTER all hooks
  if (!isHydrated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" suppressHydrationWarning>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" suppressHydrationWarning></div>
        <span className="ml-3 mt-4 text-gray-600">Loading admin panel...</span>
        {isHydrated && (
          <button 
            onClick={() => { logout(); router.push('/login'); }}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Click here if stuck
          </button>
        )}
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-teal-500 rounded-lg flex items-center justify-center">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">TaiVilla</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <Link
          href="/admin"
          onClick={handleLinkClick}
          className="flex items-center px-3 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium transition-all"
        >
          <LayoutDashboard className="h-5 w-5 mr-3" />
          Thống Kê
        </Link>
        <Link
          href="/admin/properties"
          onClick={handleLinkClick}
          className="flex items-center px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
        >
          <Building2 className="h-5 w-5 mr-3" />
          Quản Lý Villa
        </Link>
        <Link
          href="/admin/locations"
          onClick={handleLinkClick}
          className="flex items-center px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
        >
          <MapPin className="h-5 w-5 mr-3" />
          Quản Lý Vị Trí
        </Link>
        <Link
          href="/admin/property-types"
          onClick={handleLinkClick}
          className="flex items-center px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
        >
          <Home className="h-5 w-5 mr-3" />
          Loại Hình BĐS
        </Link>
        <Link
          href="/admin/requests"
          onClick={handleLinkClick}
          className="flex items-center px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
        >
          <FileText className="h-5 w-5 mr-3" />
          Yêu Cầu Tư Vấn
        </Link>
        <Link
          href="/admin/amenities"
          onClick={handleLinkClick}
          className="flex items-center px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
        >
          <Settings className="h-5 w-5 mr-3" />
          Tiện Nghi
        </Link>
      </nav>

      {/* Help Card */}
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-4 border border-slate-600/30">
          <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-white mb-1">Cần hỗ trợ?</p>
          <p className="text-xs text-slate-400 mb-3">Liên hệ TaiVilla</p>
          <button className="w-full px-3 py-2 bg-transparent border border-slate-500 text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-700 transition-colors">
            XEM WEBSITE
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {user.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.username}</p>
              <p className="text-xs text-slate-400">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-slate-800 text-white shrink-0 fixed h-screen">
          <SidebarContent />
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <aside className="lg:hidden fixed left-0 top-0 h-full w-64 bg-slate-800 text-white z-50 transform transition-transform duration-300">
              <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-teal-500 rounded-lg flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">TaiVilla</h1>
                    <p className="text-xs text-slate-400">Admin</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="px-3 space-y-1 mt-4">
                <Link
                  href="/admin"
                  onClick={handleLinkClick}
                  className="flex items-center px-3 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium"
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Thống Kê
                </Link>
                <Link
                  href="/admin/properties"
                  onClick={handleLinkClick}
                  className="flex items-center px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
                >
                  <Building2 className="h-5 w-5 mr-3" />
                  Quản Lý Villa
                </Link>
                <Link
                  href="/admin/requests"
                  onClick={handleLinkClick}
                  className="flex items-center px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
                >
                  <FileText className="h-5 w-5 mr-3" />
                  Yêu Cầu Tư Vấn
                </Link>
                <Link
                  href="/admin/amenities"
                  onClick={handleLinkClick}
                  className="flex items-center px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Tiện Nghi
                </Link>
              </nav>
              <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {user.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.username}</p>
                      <p className="text-xs text-slate-400">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden mr-2 p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">🏠</span>
                <span className="text-gray-300">/</span>
                <span className="text-gray-600 font-medium">Dashboards</span>
                <Menu className="h-4 w-4 text-gray-400 ml-2" />
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <NotificationBell />
              
              {/* Settings */}
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              {/* User Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.username?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </WebSocketProvider>
  );
}
