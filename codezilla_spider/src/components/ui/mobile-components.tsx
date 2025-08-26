import React, { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Progress } from './progress';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus, 
  X, 
  Check,
  AlertTriangle,
  Info,
  Star
} from 'lucide-react';

// Mobile Card Component
interface MobileCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const MobileCard: React.FC<MobileCardProps> = ({
  title,
  children,
  className = '',
  onClick,
  badge,
  badgeVariant = 'default'
}) => {
  return (
    <Card 
      className={`mobile-card ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {(title || badge) && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            {title && <CardTitle className="text-base">{title}</CardTitle>}
            {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
          </div>
        </CardHeader>
      )}
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};

// Mobile Button Component
interface MobileButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={`mobile-btn ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <div className="mobile-spinner mr-2" />}
      {children}
    </Button>
  );
};

// Mobile Accordion Component
interface MobileAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const MobileAccordion: React.FC<MobileAccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`mobile-accordion ${className}`}>
      <div className="mobile-accordion-item">
        <button
          className="mobile-accordion-header w-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-medium">{title}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {isOpen && (
          <div className="mobile-accordion-content">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

// Mobile Tabs Component
interface MobileTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface MobileTabsProps {
  tabs: MobileTab[];
  defaultTab?: string;
  className?: string;
}

export const MobileTabs: React.FC<MobileTabsProps> = ({
  tabs,
  defaultTab,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={className}>
      <div className="mobile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`mobile-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

// Mobile Form Input Component
interface MobileFormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const MobileFormInput: React.FC<MobileFormInputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`mobile-form-group ${className}`}>
      <label className="mobile-form-label">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`mobile-form-input ${error ? 'border-destructive' : ''}`}
      />
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};

// Mobile Search Component
interface MobileSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  className?: string;
}

export const MobileSearch: React.FC<MobileSearchProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  className = ''
}) => {
  return (
    <div className={`mobile-search ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch?.()}
        className="mobile-search-input"
      />
    </div>
  );
};

// Mobile Filter Chips Component
interface MobileFilterChip {
  id: string;
  label: string;
  active?: boolean;
}

interface MobileFilterChipsProps {
  chips: MobileFilterChip[];
  onChipClick: (chipId: string) => void;
  className?: string;
}

export const MobileFilterChips: React.FC<MobileFilterChipsProps> = ({
  chips,
  onChipClick,
  className = ''
}) => {
  return (
    <div className={`mobile-filter-chips ${className}`}>
      {chips.map((chip) => (
        <button
          key={chip.id}
          className={`mobile-filter-chip ${chip.active ? 'active' : ''}`}
          onClick={() => onChipClick(chip.id)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
};

// Mobile Loading Component
interface MobileLoadingProps {
  message?: string;
  className?: string;
}

export const MobileLoading: React.FC<MobileLoadingProps> = ({
  message = 'Loading...',
  className = ''
}) => {
  return (
    <div className={`mobile-loading ${className}`}>
      <div className="mobile-spinner" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

// Mobile Error Component
interface MobileErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const MobileError: React.FC<MobileErrorProps> = ({
  title = 'Something went wrong',
  message = 'Please try again later',
  onRetry,
  className = ''
}) => {
  return (
    <div className={`mobile-error ${className}`}>
      <AlertTriangle className="h-8 w-8" />
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <MobileButton onClick={onRetry} variant="outline">
          Try Again
        </MobileButton>
      )}
    </div>
  );
};

// Mobile Success Component
interface MobileSuccessProps {
  title?: string;
  message?: string;
  className?: string;
}

export const MobileSuccess: React.FC<MobileSuccessProps> = ({
  title = 'Success!',
  message,
  className = ''
}) => {
  return (
    <div className={`mobile-success ${className}`}>
      <Check className="h-8 w-8" />
      <div>
        <h3 className="font-medium">{title}</h3>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
};

// Mobile Empty State Component
interface MobileEmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export const MobileEmptyState: React.FC<MobileEmptyStateProps> = ({
  icon = <Info className="h-8 w-8" />,
  title = 'No data found',
  message = 'There are no items to display',
  action,
  className = ''
}) => {
  return (
    <div className={`mobile-empty ${className}`}>
      {icon}
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {action}
    </div>
  );
};

// Mobile Bottom Sheet Component
interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Bottom Sheet */}
      <div className={`mobile-bottom-sheet ${isOpen ? 'open' : ''} ${className}`}>
        <div className="mobile-bottom-sheet-handle" />
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{title}</h3>
            <button
              onClick={onClose}
              className="touch-target p-1 rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {children}
      </div>
    </>
  );
};

// Mobile Floating Action Button Component
interface MobileFabProps {
  icon: React.ReactNode;
  onClick: () => void;
  label?: string;
  className?: string;
}

export const MobileFab: React.FC<MobileFabProps> = ({
  icon,
  onClick,
  label,
  className = ''
}) => {
  return (
    <button
      className={`mobile-fab ${className}`}
      onClick={onClick}
      aria-label={label}
    >
      {icon}
    </button>
  );
};

// Mobile Progress Component
interface MobileProgressProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export const MobileProgress: React.FC<MobileProgressProps> = ({
  value,
  max = 100,
  label,
  className = ''
}) => {
  const percentage = (value / max) * 100;

  return (
    <div className={`mobile-progress ${className}`}>
      {label && (
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="mobile-progress-bar" style={{ width: `${percentage}%` }} />
    </div>
  );
};

// Mobile Skeleton Components
export const MobileSkeletonText: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`mobile-skeleton mobile-skeleton-text ${className}`} />
);

export const MobileSkeletonAvatar: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`mobile-skeleton mobile-skeleton-avatar ${className}`} />
);

export const MobileSkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`mobile-skeleton mobile-skeleton-card ${className}`} />
);

// Mobile Notification Component
interface MobileNotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

export const MobileNotification: React.FC<MobileNotificationProps> = ({
  type,
  title,
  message,
  onClose,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <Check className="h-4 w-4" />;
      case 'error': return <X className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className={`mobile-notification ${type} ${className}`}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1">
          <p className="font-medium">{title}</p>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="touch-target p-1 rounded-full hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};

