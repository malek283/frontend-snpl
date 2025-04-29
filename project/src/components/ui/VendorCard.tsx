import { Link } from 'react-router-dom';
import { Vendor } from '../../types';

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  return (
    <Link to={`/vendor/${vendor.id}`} className="block">
      <div className="card group cursor-pointer hover:-translate-y-1 transition-all duration-300">
        <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-t-lg flex items-center justify-center p-6">
          <img 
            src={vendor.logo} 
            alt={vendor.name} 
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="font-medium">{vendor.name}</h3>
          <div className="flex items-center justify-center mt-2 mb-1">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 ml-1">({vendor.rating.toFixed(1)})</span>
          </div>
          <p className="text-sm text-gray-500">{vendor.productsCount} produits</p>
        </div>
      </div>
    </Link>
  );
};

export default VendorCard;