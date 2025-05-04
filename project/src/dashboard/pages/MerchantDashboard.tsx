// src/dashboard/pages/MerchantDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import AccountSettings from '../AccountSettings';
import CustomerMessages from '../CustomerMessages';
import Header from '../Header';
import Notifications from '../Notifications';
import OrderManagement from '../OrderManagement';
import Overview from '../Overview';
import PaymentManagement from '../PaymentManagement';
import ProductManagement from '../ProductManagement';
import StoreManagement from '../StoreManagement';
import Support from '../Support';
import { mockMerchant } from '../data/mockData';
import Sidebar from '../Sidebar';
import { Users } from 'lucide-react';

type ActiveSection = 'overview' | 'products' | 'store' | 'orders' | 'payments' | 'notifications' | 'support' | 'settings' | 'messages' | 'user';

const MerchantDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Memoized callbacks
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleSetActiveSection = useCallback((section: ActiveSection) => {
    setActiveSection(section);
  }, []);

  const renderActiveSection = useCallback(() => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'products':
        return <ProductManagement />;
      case 'store':
        return <StoreManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'notifications':
        return <Notifications />;
      case 'support':
        return <Support />;
      case 'settings':
        return <AccountSettings merchant={mockMerchant} />;
      case 'messages':
        return <CustomerMessages />;
        case 'user':
          return <Users />;
      default:
        return <Overview />;
    }
  }, [activeSection]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        activeSection={activeSection}
        setActiveSection={handleSetActiveSection}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          toggleSidebar={toggleSidebar}
          merchantName={mockMerchant.name}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default React.memo(MerchantDashboard);