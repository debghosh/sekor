import React from 'react';

interface NavigationTabsProps {
  activeTab: 'home' | 'forYou' | 'following' | 'saved';
  onTabChange: (tab: 'home' | 'forYou' | 'following' | 'saved') => void;
  isAuthenticated: boolean;
}

const NavigationTabs = ({ activeTab, onTabChange, isAuthenticated }: NavigationTabsProps) => {
  const tabs = [
    { id: 'home', label: 'Home', requireAuth: false },
    { id: 'forYou', label: 'For You', requireAuth: true },
    { id: 'following', label: 'Following', requireAuth: true },
    { id: 'saved', label: 'Saved', requireAuth: true },
  ] as const;

  return (
    <nav className="border-b border-border mb-8">
      <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          // Don't show auth-required tabs if user is not authenticated
          if (tab.requireAuth && !isAuthenticated) {
            return null;
          }

          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative py-4 px-1 text-body font-medium whitespace-nowrap transition-colors
                ${isActive 
                  ? 'text-primary' 
                  : 'text-text-medium hover:text-text-dark'
                }
              `}
            >
              {tab.label}
              
              {/* Active indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationTabs;
