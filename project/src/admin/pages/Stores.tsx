import React, { useState } from 'react';
import { Search, Filter, Plus, Trash2, Edit, Eye, Check, X, ArrowUp, ArrowDown } from 'lucide-react';

const Stores: React.FC = () => {
  const [view, setView] = useState<'list' | 'grid'>('list');
  
  const stores = [
    { 
      id: 1, 
      name: 'Tech Gadgets Store', 
      owner: 'John Smith', 
      category: 'Electronics',
      products: 156, 
      revenue: '$25,430.50', 
      rating: 4.8,
      status: 'active',
      featured: true,
      image: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 2, 
      name: 'Fashion Trends', 
      owner: 'Emily Johnson', 
      category: 'Clothing',
      products: 87, 
      revenue: '$18,320.75', 
      rating: 4.5,
      status: 'active',
      featured: false,
      image: 'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 3, 
      name: 'Home Decor Plus', 
      owner: 'Michael Brown', 
      category: 'Home & Garden',
      products: 104, 
      revenue: '$12,645.30', 
      rating: 4.2,
      status: 'pending',
      featured: false,
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 4, 
      name: 'Organic Foods Co.', 
      owner: 'Sarah Wilson', 
      category: 'Food & Beverage',
      products: 68, 
      revenue: '$9,875.25', 
      rating: 4.7,
      status: 'active',
      featured: true,
      image: 'https://images.pexels.com/photos/8540151/pexels-photo-8540151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 5, 
      name: 'Sports Equipment Pro', 
      owner: 'David Miller', 
      category: 'Sports',
      products: 112, 
      revenue: '$15,320.00', 
      rating: 4.0,
      status: 'suspended',
      featured: false,
      image: 'https://images.pexels.com/photos/3622614/pexels-photo-3622614.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 6, 
      name: 'Kids Toys World', 
      owner: 'Jennifer Davis', 
      category: 'Toys & Games',
      products: 94, 
      revenue: '$7,645.80', 
      rating: 4.4,
      status: 'active',
      featured: false,
      image: 'https://images.pexels.com/photos/163429/toy-car-toy-box-mini-163429.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-xs font-medium text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Store Management</h2>
        <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          <Plus size={16} className="mr-2" />
          Add New Store
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search stores..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50">
              <Filter size={16} className="mr-2 text-gray-500" />
              <span>Filters</span>
            </button>
            
            <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
              <button 
                onClick={() => setView('list')}
                className={`px-3 py-2 ${view === 'list' ? 'bg-gray-100' : 'bg-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
              <button 
                onClick={() => setView('grid')}
                className={`px-3 py-2 ${view === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { title: 'Total Stores', value: '487', change: '+8%', changeType: 'positive' },
          { title: 'Active Stores', value: '412', change: '+5%', changeType: 'positive' },
          { title: 'Pending Approval', value: '45', change: '-12%', changeType: 'negative' },
          { title: 'Average Revenue', value: '$12,430', change: '+15%', changeType: 'positive' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xl font-semibold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.title}</p>
            <div className="mt-2 flex items-center">
              {stat.changeType === 'positive' ? (
                <div className="flex items-center text-emerald-600">
                  <ArrowUp size={16} />
                  <span className="ml-1 text-sm font-medium">{stat.change}</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <ArrowDown size={16} />
                  <span className="ml-1 text-sm font-medium">{stat.change}</span>
                </div>
              )}
              <span className="text-xs text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Stores Display */}
      {view === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gray-200 overflow-hidden">
                          <img 
                            src={store.image} 
                            alt={store.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{store.name}</div>
                          <div className="text-xs text-gray-500">Owner: {store.owner}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {store.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {store.products}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {store.revenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderRating(store.rating)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(store.status)}`}>
                        {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {store.featured ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full">
                          <Check size={14} />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-400 rounded-full">
                          <X size={14} />
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end items-center space-x-2">
                        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600" title="View Details">
                          <Eye size={16} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-600" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-600" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
            <p className="text-sm text-gray-500">Showing 1-6 of 487 stores</p>
            <div className="flex space-x-1">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 bg-indigo-50 text-indigo-600 font-medium rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm">
                3
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-200 relative">
                <img 
                  src={store.image} 
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(store.status)}`}>
                    {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                  </span>
                  {store.featured && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{store.name}</h3>
                <p className="text-sm text-gray-500 mb-3">Owner: {store.owner}</p>
                
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{store.products}</span> products
                  </div>
                  {renderRating(store.rating)}
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">{store.category}</span>
                  <span className="text-sm font-semibold text-gray-900">{store.revenue}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 flex justify-end space-x-2">
                <button className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200" title="View Details">
                  <Eye size={16} />
                </button>
                <button className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200" title="Edit">
                  <Edit size={16} />
                </button>
                <button className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stores;