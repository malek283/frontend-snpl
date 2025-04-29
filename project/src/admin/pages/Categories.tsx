import React, { useState } from 'react';
import { Search, Filter, Plus, Trash2, Edit, MoreHorizontal, ChevronDown, ChevronRight } from 'lucide-react';

const Categories: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([1]);

  const toggleCategory = (id: number) => {
    if (expandedCategories.includes(id)) {
      setExpandedCategories(expandedCategories.filter(catId => catId !== id));
    } else {
      setExpandedCategories([...expandedCategories, id]);
    }
  };

  const categories = [
    {
      id: 1,
      name: 'Electronics',
      products: 156,
      subcategories: [
        { id: 11, name: 'Smartphones', products: 65 },
        { id: 12, name: 'Laptops', products: 42 },
        { id: 13, name: 'Accessories', products: 49 }
      ]
    },
    {
      id: 2,
      name: 'Clothing',
      products: 243,
      subcategories: [
        { id: 21, name: 'Men\'s Wear', products: 86 },
        { id: 22, name: 'Women\'s Wear', products: 124 },
        { id: 23, name: 'Kids\' Wear', products: 33 }
      ]
    },
    {
      id: 3,
      name: 'Home & Garden',
      products: 178,
      subcategories: [
        { id: 31, name: 'Furniture', products: 45 },
        { id: 32, name: 'Kitchen', products: 68 },
        { id: 33, name: 'Decor', products: 65 }
      ]
    },
    {
      id: 4,
      name: 'Sports',
      products: 97,
      subcategories: [
        { id: 41, name: 'Exercise Equipment', products: 32 },
        { id: 42, name: 'Sportswear', products: 41 },
        { id: 43, name: 'Outdoor', products: 24 }
      ]
    },
    {
      id: 5,
      name: 'Beauty & Personal Care',
      products: 126,
      subcategories: [
        { id: 51, name: 'Makeup', products: 52 },
        { id: 52, name: 'Skincare', products: 48 },
        { id: 53, name: 'Hair Care', products: 26 }
      ]
    }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
        <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          <Plus size={16} className="mr-2" />
          Add New Category
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
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50">
              <Filter size={16} className="mr-2 text-gray-500" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { title: 'Total Categories', value: '35', icon: 'layers', color: 'bg-indigo-50 text-indigo-600' },
          { title: 'Total Products', value: '874', icon: 'package', color: 'bg-emerald-50 text-emerald-600' },
          { title: 'Avg. Products per Category', value: '25', icon: 'bar-chart', color: 'bg-amber-50 text-amber-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={stat.color} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {stat.icon === 'layers' && <><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></>}
                {stat.icon === 'package' && <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></>}
                {stat.icon === 'bar-chart' && <><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></>}
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {categories.map((category) => (
                <React.Fragment key={category.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <button 
                          onClick={() => toggleCategory(category.id)}
                          className="mr-2 p-1 rounded-full hover:bg-gray-100"
                        >
                          {expandedCategories.includes(category.id) ? 
                            <ChevronDown size={16} className="text-gray-500" /> : 
                            <ChevronRight size={16} className="text-gray-500" />
                          }
                        </button>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.products}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end items-center space-x-2">
                        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-600" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-600" title="Delete">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500" title="More Options">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Subcategories */}
                  {expandedCategories.includes(category.id) && category.subcategories.map((subcat) => (
                    <tr key={subcat.id} className="bg-gray-50 hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center ml-8">
                          <div className="text-sm text-gray-700">{subcat.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {subcat.products}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end items-center space-x-2">
                          <button className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-indigo-600" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-red-600" title="Delete">
                            <Trash2 size={16} />
                          </button>
                          <button className="p-1 rounded-full hover:bg-gray-200 text-gray-500" title="More Options">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-sm text-gray-500">Showing 5 main categories (15 subcategories)</p>
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
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;