import { Bell, Shield, User, Brain, TrendingUp, Pill, Package, Radio, Camera, Mic, Heart, Menu, X, Sparkles, LogIn, UserPlus, Hospital, Stethoscope, Activity, Zap, Settings, Dna, AlertTriangle, Dumbbell, Calculator, Calendar, Target, BarChart3, Activity as ActivityIcon, Disc3, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationPanel } from "@/components/ui/notification-panel";
import { ProfileMenu } from "@/components/ui/profile-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole] = useState<"admin" | "manager" | "staff" | "supplier">("admin");
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when Escape key is pressed
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);
  
  const { 
    unreadCount, 
    highPriorityCount, 
    isPanelOpen, 
    openPanel, 
    closePanel,
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotifications();

  // Organized navigation items by category
  const navigationCategories = [
    {
      title: "AI Diagnostics",
      items: [
        { to: "/disease-diagnosis", icon: Stethoscope, label: "Disease Diagnosis" },
        { to: "/mental-health", icon: Brain, label: "Mental Health" },
        { to: "/skin-analysis", icon: Camera, label: "Skin Analysis" },
        { to: "/voice-medicine", icon: Mic, label: "Voice Medicine" },
      ]
    },
    {
      title: "Health & Fitness",
      items: [
        { to: "/fitness-dashboard", icon: Dumbbell, label: "Fitness Dashboard", highlight: true },
        { to: "/bmi-calculator", icon: Calculator, label: "BMI Calculator" },
        { to: "/period-tracker", icon: Calendar, label: "Period Tracker" },
        { to: "/health-analytics", icon: BarChart3, label: "Health Analytics" },
      ]
    },
    {
      title: "Zenith Wellness",
      items: [
        { to: "/mental-health", icon: Brain, label: "Mental Health" },
        { to: "/spotify-integration", icon: Disc3, label: "Music Therapy" },
        { to: "/ai-wellness-planner", icon: Target, label: "AI Wellness Planner" },
      ]
    },
    {
      title: "Medical Records",
      items: [
        { to: "/medical-records", icon: User, label: "Medical Records" },
        { to: "/patient-profile", icon: User, label: "Patient Profile" },
        { to: "/prescriptions", icon: Pill, label: "Prescriptions" },
      ]
    },
    {
      title: "Predictive Analytics",
      items: [
        { to: "/readmission-risk", icon: Hospital, label: "Readmission Risk" },
        { to: "/insurance-coverage", icon: Shield, label: "Insurance Coverage" },
        { to: "/ml-predictions", icon: TrendingUp, label: "ML Predictions" },
      ]
    },
    {
      title: "Core Features",
      items: [
        { to: "/infinite-memory", icon: Zap, label: "Infinite Memory" },
        { to: "/medicine-recommendation", icon: Pill, label: "Medicine AI" },
        { to: "/echomed-ai", icon: Heart, label: "EchoMed AI" },
        { to: "/genechain", icon: Dna, label: "GeneChain Unified" },
        { to: "/marketplace", icon: Package, label: "Marketplace" },
        { to: "/drone-delivery", icon: Plane, label: "Drone Delivery", highlight: true },
      ]
    },
    {
      title: "Management",
      items: [
        { to: "/inventory", icon: Activity, label: "Inventory" },
        { to: "/rfid", icon: Radio, label: "RFID Tracking" },
      ]
    }
  ];

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    console.log('Mobile menu toggled:', newState);
    setIsMobileMenuOpen(newState);
  };

  const closeMobileMenu = () => {
    console.log('Mobile menu closed');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 border-b bg-card shadow-card h-16 flex items-center justify-between px-4 lg:px-6 z-50 dark:bg-card dark:border-border backdrop-blur-sm bg-card/95">
        {/* Left Side - Hamburger Button and Logo */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Button - Left side */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-all duration-200 rounded-full p-2"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo - Clickable to go to landing page */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer dark:text-foreground">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">MedChain</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Healthcare AI Platform</p>
            </div>
          </Link>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {isAuthenticated && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-all duration-200 rounded-full p-2"
              onClick={openPanel}
            >
              <Bell className="h-5 w-5" />
              {(unreadCount > 0 || highPriorityCount > 0) && (
                <span className="notification-badge absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  {unreadCount > 0 ? unreadCount : highPriorityCount}
                </span>
              )}
            </Button>
          )}
          
          {isAuthenticated ? (
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-all duration-200 rounded-full p-2"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <User className="h-5 w-5" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/signin">
                <Button variant="outline" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 opacity-100 pointer-events-auto" onClick={closeMobileMenu}>
          <div className="absolute left-0 top-16 w-80 h-full bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 translate-x-0 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Navigation</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={closeMobileMenu}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <nav className="space-y-6">
                {navigationCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                      {category.title}
                    </h3>
                    <div className="space-y-1">
                      {category.items.map((item, itemIndex) => {
                        const isActive = location.pathname === item.to;
                        return (
                          <Link key={itemIndex} to={item.to} onClick={closeMobileMenu}>
                            <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                              isActive 
                                ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 dark:from-blue-950 dark:to-indigo-950 dark:border-blue-800 dark:text-blue-300 dark:hover:from-blue-900 dark:hover:to-indigo-900" 
                                : item.highlight
                                ? "hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border hover:border-green-200 text-gray-700 dark:hover:from-green-950 dark:hover:to-emerald-950 dark:hover:border-green-800 dark:text-gray-300"
                                : "hover:bg-gray-50 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
                            }`}>
                              <item.icon className={`h-5 w-5 ${item.highlight ? 'text-green-600 dark:text-green-400' : ''}`} />
                              <span className="font-medium">{item.label}</span>
                              {item.highlight && (
                                <span className="ml-auto text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                                  New
                                </span>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Menu Footer */}
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p className="font-medium">MedChain AI Platform</p>
                  <p className="mt-1 text-xs">Advanced healthcare AI & blockchain inventory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <NotificationPanel
        isOpen={isPanelOpen}
        onClose={closePanel}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onDelete={deleteNotification}
        onMarkAllAsRead={markAllAsRead}
        onClearAll={clearAll}
      />

      <ProfileMenu
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userRole={userRole}
      />
    </>
  );
};