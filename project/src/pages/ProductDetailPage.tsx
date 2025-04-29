import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image Section */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
              <div className="aspect-square w-full relative">
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col justify-between">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
                <div className="space-y-2">
                  <p className="text-gray-500">Product ID: {id}</p>
                  <p className="text-xl font-semibold text-gray-900">Loading...</p>
                  <p className="text-gray-600">Loading description...</p>
                </div>

                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900">Price</h2>
                  <p className="text-2xl font-bold text-gray-900 mt-2">Loading...</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button 
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Add to Cart
                </button>
                <button 
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;