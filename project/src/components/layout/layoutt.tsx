import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import Sidebar from '../../marchanddashbord/components/Sidebar';

const Layout = () => {
  const location = useLocation();

  // Afficher le Navbar uniquement sur la page d'accueil
  const showNavbar = location.pathname === '/HomePage';

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        {showNavbar && <Navbar />}
        <main className="flex-grow p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;