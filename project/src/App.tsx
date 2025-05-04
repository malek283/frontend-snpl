import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Layout from './components/layout/layoutt';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MerchantDashboard from './dashboard/pages/MerchantDashboard';
import AdminDashboard from './admin/AdminDashboard';
import CategoryPage from './admin/pages/CategoryPage';
import ShopCreatorPage from './admin/pages/CategoryPage';
import ErrorBoundary from './ErrorBoundary';
import CategoryBoutiquesPage from './pages/CategoryBoutiquesPage';
import BoutiqueCategoriesPage from './pages/BoutiqueCategoriesPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import BoutiqueProductsPage from './pages/BoutiqueProductsPage';
function App() {
  return (
    
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster position="top-center" />
          <ErrorBoundary>
          <Routes>

        
            <Route path="/" element={<Layout />}>
              <Route path="/" index element={<HomePage />} />
              <Route path="/HomePage" index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="MerchantDashboard" element={<MerchantDashboard />} />
              <Route path="AdminDashboard" element={<AdminDashboard />} />
              <Route path="ShopCreatorPage" element={<ShopCreatorPage />} />
              <Route path="/category-boutiques/:categoryId" element={<CategoryBoutiquesPage />} />
        <Route path="/boutique/:boutiqueId/categories" element={<BoutiqueCategoriesPage />} />
        <Route path="/boutique/:boutiqueId/category/:categoryId" element={<BoutiqueProductsPage />} />

              
              
              <Route path="profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="wishlist" element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              } />
              <Route path="orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
          </ErrorBoundary>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
    
  );

}


export default App;