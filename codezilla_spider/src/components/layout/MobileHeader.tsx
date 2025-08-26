import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  User, 
  Settings, 
  Home,
  Pill,
  Activity,
  Brain,
  Radio,
  FileText,
  Users,
  ShoppingCart,
  Shield,
  Mic,
  Camera,
  QrCode,
  Plus,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface MobileHeaderProps {
  className?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsNotificationsOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-header')) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, color: 'text-blue-600' },
    { name: 'Medicine AI', path: '/ai-medicine-recommendation', icon: Pill, color: 'text-red-600' },
    { name: 'Infinite Memory', path: '/infinite-memory', icon: Brain, color: 'text-purple-600' },
    { name: 'ML Predictions', path: '/ml-predictions', icon: Activity, color: 'text-green-600' },
    { name: 'RFID Management', path: '/rfid', icon: Radio, color: 'text-orange-600' },
    { name: 'Skin Analysis', path: '/skin-analysis', icon: Camera, color: 'text-teal-600' },
    { name: 'Voice Assistant', path: '/voice-medicine', icon: Mic, color: 'text-indigo-600' },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingCart, color: 'text-pink-600' },
    { name: 'Medical Records', path: '/medical-records', icon: FileText, color: 'text-cyan-600' },
    { name: 'GeneChain', path: '/genechain', icon: Shield, color: 'text-emerald-600' },
    { name: 'Mobile Test', path: '/mobile-test', icon: Shield, color: 'text-violet-600' },
  ];

  const quickActions = [
    { name: 'Add Medicine', icon: Plus, action: () => console.log('Add Medicine'), color: 'bg-blue-500' },
    { name: 'Scan QR Code', icon: QrCode, action: () => console.log('Scan QR'), color: 'bg-green-500' },
    { name: 'Voice Input', icon: Mic, action: () => console.log('Voice Input'), color: 'bg-purple-500' },
    { name: 'Take Photo', icon: Camera, action: () => console.log('Take Photo'), color: 'bg-orange-500' },
  ];

  const notifications = [
    { id: 1, title: 'Low Stock Alert', message: 'Paracetamol is running low', type: 'warning', time: '2 min ago', priority: 'high' },
    { id: 2, title: 'New Medicine Added', message: 'Amoxicillin has been added to inventory', type: 'success', time: '5 min ago', priority: 'medium' },
    { id: 3, title: 'System Update', message: 'ML models have been updated', type: 'info', time: '10 min ago', priority: 'low' },
    { id: 4, title: 'Patient Alert', message: 'Patient #12345 needs attention', type: 'error', time: '15 min ago', priority: 'high' },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <Bell className="h-4 w-4 text-yellow-500" />;
      case 'success': return <Bell className="h-4 w-4 text-green-500" />;
      case 'error': return <Bell className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-950/20';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'low': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.priority === activeTab);

  return (
    <div className={`mobile-header fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-border/50 ${className}`}>
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MedChain
            </h1>
            <p className="text-xs text-muted-foreground">Healthcare AI</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="sm"
            className="touch-target rounded-full w-10 h-10 p-0 hover:bg-muted/80"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications Button */}
          <Button
            variant="ghost"
            size="sm"
            className="touch-target rounded-full w-10 h-10 p-0 hover:bg-muted/80 relative"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 hover:bg-red-600">
              {notifications.filter(n => n.priority === 'high').length}
            </Badge>
          </Button>

          {/* Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="touch-target rounded-full w-10 h-10 p-0 hover:bg-muted/80"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="px-4 py-3 border-b border-border/50 bg-background/50 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search medicines, patients, records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border/50 rounded-xl bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
            />
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {isNotificationsOpen && (
        <div className="px-4 py-3 border-b border-border/50 bg-background/50 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
          {/* Notification Tabs */}
          <div className="flex space-x-1 mb-3">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'high', label: 'High', count: notifications.filter(n => n.priority === 'high').length },
              { key: 'medium', label: 'Medium', count: notifications.filter(n => n.priority === 'medium').length },
              { key: 'low', label: 'Low', count: notifications.filter(n => n.priority === 'low').length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-3 p-3 rounded-xl border-l-4 transition-all duration-200 hover:shadow-sm ${getPriorityColor(notification.priority)}`}
              >
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{notification.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                  View
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 animate-in fade-in duration-200">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 right-0 w-80 h-full bg-background/95 backdrop-blur-md border-l border-border/50 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-4 h-full flex flex-col">
              {/* User Profile */}
              <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{user?.name || 'Dr. John Doe'}</p>
                  <p className="text-sm text-muted-foreground">General Practitioner</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <Button
                      key={action.name}
                      variant="outline"
                      size="sm"
                      className="h-16 flex flex-col items-center justify-center space-y-1 rounded-xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                      onClick={action.action}
                    >
                      <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xs font-medium">{action.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">Navigation</h3>
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 shadow-sm' 
                            : 'text-foreground hover:bg-muted/50 hover:scale-[1.02]'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-primary' : 'bg-muted'}`}>
                          <Icon className={`h-4 w-4 ${isActive ? 'text-primary-foreground' : item.color}`} />
                        </div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Settings & Logout */}
              <div className="border-t border-border/50 pt-4 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start rounded-xl hover:bg-muted/50"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4 mr-3" />
                  ) : (
                    <Moon className="h-4 w-4 mr-3" />
                  )}
                  <span className="text-sm">Toggle Theme</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  <span className="text-sm">Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
