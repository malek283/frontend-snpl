import { Outlet } from 'react-router-dom';
import MerchantSidebar from '../components/navigation/MerchantSidebar';
import MerchantHeader from '../components/navigation/MerchantHeader';
import { useState } from 'react';
import { motion } from 'framer-motion';

const MerchantLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <MerchantSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <MerchantHeader onMenuButtonClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-auto bg-gradient-to-br from-purple-50 to-pink-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-7xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default MerchantLayout;