"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Clock,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Globe
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: any;
}

const navItems: NavItem[] = [
  { name: '仪表盘', path: '/admin', icon: LayoutDashboard },
  { name: '文章管理', path: '/admin/articles', icon: FileText },
  { name: '项目管理', path: '/admin/projects', icon: FolderKanban },
  { name: '时间线管理', path: '/admin/timeline', icon: Clock },
  { name: '消息管理', path: '/admin/messages', icon: Mail },
  { name: '站点配置', path: '/admin/site-config', icon: Globe },
  { name: '账户设置', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: any;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth) {
      try {
        const authData = JSON.parse(auth);
        if (authData.isLoggedIn && authData.expiresAt > Date.now()) {
          setIsAuthenticated(true);
          setUsername(authData.username || 'Admin');
          return;
        }
      } catch (e) {
        console.error('Invalid auth data');
      }
    }
    if (pathname !== '/admin/login') {
      window.location.href = '/admin/login';
    }
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    window.location.href = '/admin/login';
  };

  const currentPage = navItems.find(item => item.path === pathname);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-background-tertiary border-r border-border">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <User className="w-6 h-6 text-primary-500" />
            管理后台
          </h1>
          <p className="text-sm text-foreground-muted mt-1">欢迎, {username}</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                        : 'text-foreground-muted hover:text-foreground hover:bg-background-secondary'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 text-foreground-muted hover:text-error hover:bg-error/10 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="font-medium">退出登录</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-background-tertiary border-r border-border z-50 transform transition-transform duration-200 md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <User className="w-6 h-6 text-primary-500" />
              管理后台
            </h1>
            <p className="text-sm text-foreground-muted mt-1">欢迎, {username}</p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground-muted" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                        : 'text-foreground-muted hover:text-foreground hover:bg-background-secondary'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 text-foreground-muted hover:text-error hover:bg-error/10 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="font-medium">退出登录</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-background-secondary border-b border-border flex-shrink-0">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 hover:bg-background-tertiary rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-foreground" />
              </button>
              <h2 className="text-xl font-semibold text-foreground">
                {currentPage?.name || '管理面板'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background-tertiary rounded-lg border border-border">
                <User className="w-4 h-4 text-primary-500" />
                <span className="text-sm text-foreground">{username}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
