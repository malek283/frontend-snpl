import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Overview from './pages/Overview';
import Users from './pages/Users';
import Merchants from './pages/Merchants';
import Stores from './pages/Stores';
import Categories from './pages/Categories';
import Content from './pages/Content';
import Support from './pages/Support';
import Admins from './pages/Admins';
import Settings from './pages/Settings';
import Header from './Header';

type Page = 'overview' | 'users' | 'merchants' | 'stores' | 'categories' | 'content' | 'support' | 'admins' | 'settings';

const AdminDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />;
      case 'users':
        return <Users />;
      case 'merchants':
        return <Merchants />;
      case 'stores':
        return <Stores />;
      case 'categories':
        return <Categories />;
      case 'content':
        return <Content />;
      case 'support':
        return <Support />;
      case 'admins':
        return <Admins />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} currentPage={currentPage} />
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-5xl mx-auto"> {/* Changed from max-w-7xl to max-w-5xl */}
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;