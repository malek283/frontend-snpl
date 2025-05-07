import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Package,
  LogOut,
  UserCircle,
  Mail,
  Share
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Debug auth state
  console.log('Navbar Auth State:', { 
    isAuthenticated, 
    user, 
    userRole: user?.role, 
    isClient: user?.role?.toLowerCase() === 'client' 
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleReferralModal = () => setIsReferralModalOpen(!isReferralModalOpen);

  const categories = [
    'Parfums',
    'Maquillage',
    'Soin Visage',
    'Corps & Bain',
    'Cheveux',
    'Nouveautés',
    'Marques',
    'Bons plans'
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top navbar with logo, search, and icons */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ShopDelux
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher un produit, une marque..."
                className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/wishlist" className="relative hidden sm:block">
              <Heart className="h-6 w-6 hover:text-primary transition-colors" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 hover:text-primary transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {!isAuthenticated && (
              <>
                <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Se connecter
                </Link>
                <Link to="/register" className="text-sm font-medium hover:text-primary transition-colors">
                  S'inscrire
                </Link>
              </>
            )}

            <div className="relative">
              <button 
                onClick={toggleUserMenu} 
                className="focus:outline-none"
                aria-label="User menu"
              >
                {isAuthenticated && user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-primary" 
                  />
                ) : (
                  <User className="h-6 w-6 hover:text-primary transition-colors" />
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5 fade-in">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name || 'Utilisateur'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email || 'Email non disponible'}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserCircle className="mr-2 h-4 w-4" />
                        Gérer le profil
                      </Link>
                      {user.role?.toLowerCase() === 'client' && (
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            console.log('Opening referral modal for user:', user);
                            toggleReferralModal();
                            setIsUserMenuOpen(false);
                          }}
                        >
                          <Share className="mr-2 h-4 w-4" />
                          Votre code de parrainage
                        </button>
                      )}
                      <Link 
                        to="/orders" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Mes commandes
                      </Link>
                      <Link 
                        to="/messages" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Messages
                      </Link>
                      <button 
                        onClick={() => {
                          console.log('Logging out user:', user);
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Se déconnecter
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">Visiteur</p>
                        <p className="text-xs text-gray-500">Non connecté</p>
                      </div>
                      <Link 
                        to="/login" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Se connecter
                      </Link>
                      <Link 
                        to="/register" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        S'inscrire
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un produit, une marque..."
              className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <nav className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <ul className="hidden md:flex items-center space-x-6 overflow-x-auto whitespace-nowrap py-3 scrollbar-hide">
            {categories.map((category, index) => (
              <li key={index}>
                <Link 
                  to={`/products?category=${category}`}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md slide-up">
          <ul className="py-2 px-4">
            {categories.map((category, index) => (
              <li key={index} className="py-2">
                <Link 
                  to={`/products?category=${category}`}
                  className="block text-base font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category}
                </Link>
              </li>
            ))}
            <li className="py-2 border-t border-gray-100 mt-2 pt-4">
              <Link 
                to="/wishlist"
                className="flex items-center text-base font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-5 w-5 mr-2" />
                Ma Liste d'envies
                {wishlistItems.length > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      )}

      {isReferralModalOpen && user?.role?.toLowerCase() === 'client' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Votre code de parrainage</h2>
            <p className="text-gray-700 mb-2">
              Voici votre code de parrainage : <strong>{user.referral_code || 'Non disponible'}</strong>
            </p>
            <p className="text-gray-700 mb-4">
              Partagez ce code avec vos amis. Pour chaque personne inscrite avec votre code, vous gagnez des réductions et des récompenses sur notre plateforme !
            </p>
            <button
              className="btn-primary w-full"
              onClick={toggleReferralModal}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;