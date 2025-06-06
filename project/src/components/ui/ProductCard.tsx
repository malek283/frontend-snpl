import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div 
      className="card relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.isNew && (
          <span className="bg-secondary text-white text-xs px-2 py-1 rounded-sm font-medium">
            Nouveau
          </span>
        )}
        {product.discountedPrice && (
          <span className="bg-primary text-white text-xs px-2 py-1 rounded-sm font-medium">
            -{Math.round((1 - product.discountedPrice / product.price) * 100)}%
          </span>
        )}
      </div>

      {/* Quick actions */}
      <div className={`absolute right-2 top-2 z-10 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          className="bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-primary text-primary' : ''}`} />
        </button>
        <Link 
          to={`/products/${product.id}`} 
          className="bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
          aria-label="Quick view"
        >
          <Eye className="h-4 w-4" />
        </Link>
      </div>

      {/* Product image and link */}
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          {/* Vendor name */}
          <p className="text-xs text-gray-500 mb-1">{product.vendor.name}</p>
          
          {/* Product name */}
          <h3 className="font-medium text-sm mb-2 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.rating.toFixed(1)})</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              {product.discountedPrice ? (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{product.discountedPrice.toFixed(2)} €</span>
                  <span className="text-sm text-gray-500 line-through">{product.price.toFixed(2)} €</span>
                </div>
              ) : (
                <span className="font-semibold">{product.price.toFixed(2)} €</span>
              )}
            </div>
            
            {/* Add to cart button */}
            <button 
              onClick={handleAddToCart}
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;