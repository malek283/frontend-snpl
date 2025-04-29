import React from 'react';
import { Menu, Bell, Search, ChevronDown } from 'lucide-react';

type Page = 'overview' | 'users' | 'merchants' | 'stores' | 'categories' | 'content' | 'support' | 'admins' | 'settings';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  currentPage: Page;
}

const pageTitles: Record<Page, string> = {
  overview: 'Dashboard Overview',
  users: 'User Management',
  merchants: 'Merchant Management',
  stores: 'Store Management',
  categories: 'Categories',
  content: 'Content & Notifications',
  support: 'Support Tickets',
  admins: 'Admin Management',
  settings: 'Site Settings',
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen, currentPage }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-800">
            {pageTitles[currentPage]}
          </h1>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-xs ml-6">
          <div className="w-full relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              A
            </div>
            <span className="hidden md:flex ml-2 text-sm font-medium text-gray-700 items-center">
              Admin
              <ChevronDown size={16} className="ml-1" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;