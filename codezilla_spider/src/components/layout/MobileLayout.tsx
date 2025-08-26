import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MobileHeader } from './MobileHeader';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Main Content with proper spacing for mobile header */}
      <main className={`pt-16 pb-24 ${className || ''}`}>
        {children}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

// Enhanced Mobile Bottom Navigation Component
const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigationItems = [
    { 
      name: 'Home', 
      path: '/dashboard', 
      icon: '🏠',
      activeIcon: '🏠',
      description: 'Dashboard'
    },
    { 
      name: 'Fitness', 
      path: '/fitness-dashboard', 
      icon: '💪',
      activeIcon: '💪',
      description: 'Fitness'
    },
    { 
      name: 'Health', 
      path: '/bmi-calculator', 
      icon: '🏥',
      activeIcon: '🏥',
      description: 'Health'
    },
    { 
      name: 'Zenith', 
      path: '/mental-health', 
      icon: '🧘',
      activeIcon: '🧘',
      description: 'Wellness'
    },
    { 
      name: 'Drone', 
      path: '/drone-delivery', 
      icon: '🚁',
      activeIcon: '🚁',
      description: 'Delivery'
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/50 shadow-lg">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      
      {/* Navigation content */}
      <div className="relative flex justify-around items-center py-2 px-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300 touch-target relative ${
                isActive 
                  ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary scale-110 shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
              
              {/* Icon with animation */}
              <div className={`text-2xl mb-1 transition-all duration-300 ${
                isActive ? 'scale-110' : 'group-hover:scale-105'
              }`}>
                {isActive ? item.activeIcon : item.icon}
              </div>
              
              {/* Label */}
              <span className={`text-xs font-medium transition-all duration-300 ${
                isActive 
                  ? 'text-primary font-semibold' 
                  : 'text-muted-foreground group-hover:text-foreground'
              }`}>
                {item.name}
              </span>
              
              {/* Description tooltip */}
              <div className={`absolute bottom-full mb-2 px-2 py-1 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap ${
                isActive ? 'bg-primary text-primary-foreground' : ''
              }`}>
                {item.description}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* Bottom safe area for devices with home indicator */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </nav>
  );
};
