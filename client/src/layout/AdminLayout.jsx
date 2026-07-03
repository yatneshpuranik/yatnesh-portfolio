import React, { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, User, Code, Briefcase, GraduationCap, 
  FolderGit, BookOpen, FileText, Share2, Mail, Settings, 
  LogOut, Globe, ShieldAlert, Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AdminLayout = ({ children }) => {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated and loading finished
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-t-purple-600 border-gray-800 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Securing connection...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Prevents render before redirect completes
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Profile Bio', path: '/admin/profile', icon: User },
    { name: 'Projects', path: '/admin/projects', icon: FolderGit },
    { name: 'Research Papers', path: '/admin/research', icon: BookOpen },
    { name: 'Skills', path: '/admin/skills', icon: Code },
    { name: 'Experience', path: '/admin/experience', icon: Briefcase },
    { name: 'Education', path: '/admin/education', icon: GraduationCap },
    { name: 'Certificates', path: '/admin/certificates', icon: Award },
    { name: 'Resume', path: '/admin/resume', icon: FileText },
    { name: 'Social Links', path: '/admin/socials', icon: Share2 },
    { name: 'Messages Inbox', path: '/admin/messages', icon: Mail },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-[#030712] text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0f19] flex flex-col shrink-0">
        
        {/* Admin Branding */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-2">
          <ShieldAlert className="w-6 h-6 text-purple-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              CMS Admin
            </span>
            <span className="text-[10px] text-gray-500 font-mono">Logged in as {user?.username}</span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-purple-600/10 text-purple-500 border-l-4 border-purple-600 pl-3' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          {/* Back to Website */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/40 hover:text-gray-950 dark:hover:text-gray-100 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>View Website</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-[#0b0f19]/70 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold">
            {navItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-xs bg-purple-600/10 text-purple-500 border border-purple-500/20 px-2.5 py-1 rounded-full font-mono font-medium">
              Vite + React 19
            </span>
          </div>
        </header>
        <main className="p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
