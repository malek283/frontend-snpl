import React from 'react';
import { Search, Filter, Download, MoreHorizontal, Eye, Edit, Trash2, UserPlus } from 'lucide-react';

const Merchants: React.FC = () => {
  const merchants = [
    { 
      id: 1, 
      name: 'Tech Gadgets Store', 
      owner: 'John Smith', 
      email: 'john@techgadgets.com', 
      stores: 3, 
      products: 156, 
      revenue: '$25,430.50', 
      status: 'active', 
      joined: '15 Aug 2023' 
    },
    { 
      id: 2, 
      name: 'Fashion Trends', 
      owner: 'Emily Johnson', 
      email: 'emily@fashiontrends.com', 
      stores: 1, 
      products: 87, 
      revenue: '$18,320.75', 
      status: 'active', 
      joined: '02 Sep 2023' 
    },
    { 
      id: 3, 
      name: 'Home Decor Plus', 
      owner: 'Michael Brown', 
      email: 'michael@homedecor.com', 
      stores: 2, 
      products: 104, 
      revenue: '$12,645.30', 
      status: 'pending', 
      joined: '10 Oct 2023' 
    },
    { 
      id: 4, 
      name: 'Organic Foods Co.', 
      owner: 'Sarah Wilson', 
      email: 'sarah@organicfoods.com', 
      stores: 1, 
      products: 68, 
      revenue: '$9,875.25', 
      status: 'active', 
      joined: '28 Oct 2023' 
    },
    { 
      id: 5, 
      name: 'Sports Equipment Pro', 
      owner: 'David Miller', 
      email: 'david@sportspro.com', 
      stores: 1, 
      products: 112, 
      revenue: '$15,320.00', 
      status: 'suspended', 
      joined: '05 Nov 2023' 
    },
    { 
      id: 6, 
      name: 'Kids Toys World', 
      owner: 'Jennifer Davis', 
      email: 'jennifer@kidsworld.com', 
      stores: 2, 
      products: 94, 
      revenue: '$7,645.80', 
      status: 'active', 
      joined: '19 Nov 2023' 
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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Merchant Management</h2>
        <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          <UserPlus size={16} className="mr-2" />
          Add New Merchant
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
              placeholder="Search merchants..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50">
              <Filter size={16} className="mr-2 text-gray-500" />
              <span>Filters</span>
            </button>
            
            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50">
              <Download size={16} className="mr-2 text-gray-500" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { title: 'Total Merchants', value: '583', change: '+12%', color: 'bg-blue-50 text-blue-700' },
          { title: 'Active Merchants', value: '498', change: '+8%', color: 'bg-green-50 text-green-700' },
          { title: 'Pending Approval', value: '45', change: '-5%', color: 'bg-yellow-50 text-yellow-700' },
          { title: 'Suspended', value: '40', change: '+2%', color: 'bg-red-50 text-red-700' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={stat.color} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className="text-xs mt-2">
              <span className={stat.change.includes('+') ? 'text-green-600' : 'text-red-600'}>
                {stat.change}
              </span> from last month
            </p>
          </div>
        ))}
      </div>

      {/* Merchants Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stores</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {merchants.map((merchant) => (
                <tr key={merchant.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                        {merchant.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{merchant.name}</div>
                        <div className="text-xs text-gray-500">
                          <span className="mr-1">{merchant.owner}</span> •
                          <span className="ml-1">{merchant.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{merchant.stores}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{merchant.products}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{merchant.revenue}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(merchant.status)}`}>
                      {merchant.status.charAt(0).toUpperCase() + merchant.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{merchant.joined}</td>
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
                      <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500" title="More Options">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-sm text-gray-500">Showing 1-6 of 583 merchants</p>
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
    </div>
  );
};

export default Merchants;