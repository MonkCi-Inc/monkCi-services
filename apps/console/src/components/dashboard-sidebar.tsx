'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  Server, 
  Github, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { authService, User } from "@/lib/auth";

interface DashboardSidebarProps {
  user: User | null;
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const navigate = (path: string) => {
    router.push(path);
    setIsMobileOpen(false); // Close mobile menu after navigation
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  // Show Connect GitHub only for emailAuthId users without GitHub
  const showConnectGitHub = user?.emailAuthId ;

  // Mobile overlay
  const mobileOverlay = isMobileOpen && (
    <div 
      className="fixed inset-0 bg-black/50 z-40 md:hidden"
      onClick={toggleMobileMenu}
    />
  );

  // Mobile sidebar
  const mobileSidebar = (
    <div className={`
      fixed top-0 left-0 h-full bg-card border-r z-50 md:hidden
      transform transition-transform duration-300 ease-in-out
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      w-64
    `}>
      <div className="flex flex-col h-full">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">M</span>
            </div>
            <h2 className="text-lg font-semibold">Monk CI</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile User Info */}
        {user && (
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatarUrl} alt={user.name || user.login || 'User'} />
                <AvatarFallback>{(user.name || user.login || 'U').charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name || user.login || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">@{user.login || 'user'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={isActive('/dashboard') && pathname === '/dashboard' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => navigate('/dashboard')}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Button>

          <Button
            variant={isActive('/dashboard/runners') ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => navigate('/dashboard/runners')}
          >
            <Server className="h-5 w-5 mr-3" />
            Runners
          </Button>

          {showConnectGitHub && (
            <Button
              variant={isActive('/dashboard/connect-github') ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => navigate('/dashboard/connect-github')}
            >
              <Github className="h-5 w-5 mr-3" />
              Connect GitHub
            </Button>
          )}
        </nav>

        {/* Mobile Footer */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  // Desktop sidebar
  const desktopSidebar = (
    <div className={`
      hidden md:flex flex-col h-screen bg-card border-r
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Desktop Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">M</span>
            </div>
            <h2 className="text-lg font-semibold">Monk CI</h2>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center mx-auto">
            <span className="text-sm font-bold text-primary-foreground">M</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden md:flex ml-auto"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Desktop User Info */}
      {user && !isCollapsed && (
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl} alt={user.name || user.login || 'User'} />
              <AvatarFallback>{(user.name || user.login || 'U').charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name || user.login || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">@{user.login || 'user'}</p>
            </div>
          </div>
        </div>
      )}

      {user && isCollapsed && (
        <div className="p-4 border-b flex justify-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} alt={user.name || user.login || 'User'} />
            <AvatarFallback>{(user.name || user.login || 'U').charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant={isActive('/dashboard') && pathname === '/dashboard' ? 'secondary' : 'ghost'}
          className={`w-full ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          onClick={() => navigate('/dashboard')}
          title={isCollapsed ? 'Dashboard' : undefined}
        >
          <LayoutDashboard className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Dashboard</span>}
        </Button>

        <Button
          variant={isActive('/dashboard/runners') ? 'secondary' : 'ghost'}
          className={`w-full ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          onClick={() => navigate('/dashboard/runners')}
          title={isCollapsed ? 'Runners' : undefined}
        >
          <Server className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Runners</span>}
        </Button>

        {showConnectGitHub && (
          <Button
            variant={isActive('/dashboard/connect-github') ? 'secondary' : 'ghost'}
            className={`w-full ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            onClick={() => navigate('/dashboard/connect-github')}
            title={isCollapsed ? 'Connect GitHub' : undefined}
          >
            <Github className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Connect GitHub</span>}
          </Button>
        )}
      </nav>

      {/* Desktop Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className={`w-full ${isCollapsed ? 'justify-center' : 'justify-start'} text-destructive hover:text-destructive`}
          onClick={handleLogout}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Sign Out</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 bg-card border"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {mobileOverlay}
      {mobileSidebar}
      {desktopSidebar}
    </>
  );
}

