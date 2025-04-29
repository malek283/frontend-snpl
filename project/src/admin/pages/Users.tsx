import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, UserPlus, Award, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';

const Users: React.FC = () => {
  const [view, setView] = useState<'list' | 'grid'>('list');
  
  const users = [
    { 
      id: 1, 
      name: 'Emma Wilson', 
      email: 'emma@example.com', 
      role: 'Customer', 
      status: 'active', 
      lastLogin: '2 hours ago', 
      orders: 12,
      paymentHistory: {
        onTime: 12,
        late: 0,
        total: 12
      },
      rewards: {
        points: 1200,
        tier: 'gold',
        nextTierProgress: 80
      }
    },
    { 
      id: 2, 
      name: 'Liam Johnson', 
      email: 'liam@example.com', 
      role: 'Customer', 
      status: 'active', 
      lastLogin: '1 day ago', 
      orders: 4,
      paymentHistory: {
        onTime: 3,
        late: 1,
        total: 4
      },
      rewards: {
        points: 300,
        tier: 'silver',
        nextTierProgress: 45
      }
    },
    { 
      id: 3, 
      name: 'Olivia Smith', 
      email: 'olivia@example.com', 
      role: 'Customer', 
      status: 'inactive', 
      lastLogin: '2 weeks ago', 
      orders: 0,
      paymentHistory: {
        onTime: 0,
        late: 0,
        total: 0
      },
      rewards: {
        points: 0,
        tier: 'bronze',
        nextTierProgress: 0
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold':
        return 'bg-amber-100 text-amber-800';
      case 'silver':
        return 'bg-gray-100 text-gray-600';
      case 'bronze':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPaymentStatus = (history: { onTime: number; late: number; total: number }) => {
    const percentage = history.total > 0 ? (history.onTime / history.total) * 100 : 0;
    return (
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600">{percentage}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          <UserPlus size={16} className="mr-2" />
          Add New User
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
              placeholder="Search users..."
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

      {/* User List */}
      {view === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment History</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rewards</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-48">
                        {renderPaymentStatus(user.paymentHistory)}
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <Clock size={12} className="mr-1" />
                          {user.paymentHistory.onTime} on-time / {user.paymentHistory.total} total
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getTierColor(user.rewards.tier)}`}>
                          {user.rewards.tier.charAt(0).toUpperCase() + user.rewards.tier.slice(1)}
                        </span>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <Award size={12} className="mr-1" />
                          {user.rewards.points} points
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end items-center space-x-2">
                        <button className="p-1 rounded-full hover:bg-green-100 text-gray-500 hover:text-green-600" title="Approve">
                          <CheckCircle size={16} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600" title="Reject">
                          <XCircle size={16} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-amber-100 text-gray-500 hover:text-amber-600" title="Manage Rewards">
                          <Award size={16} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-blue-100 text-gray-500 hover:text-blue-600" title="Payment History">
                          <DollarSign size={16} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-600" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-600" title="Delete">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500" title="More">
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
            <p className="text-sm text-gray-500">Showing {users.length} users</p>
            <div className="flex space-x-1">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 bg-indigo-50 text-indigo-600 font-medium rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <span className={`px-2 py-1 text-xs leading-5 font-medium rounded-full ${getStatusColor(user.status)}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{user.email}</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Payment History</div>
                    {renderPaymentStatus(user.paymentHistory)}
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Rewards Program</div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs leading-5 font-medium rounded-full ${getTierColor(user.rewards.tier)}`}>
                        {user.rewards.tier.charAt(0).toUpperCase() + user.rewards.tier.slice(1)}
                      </span>
                      <span className="text-sm text-gray-600">{user.rewards.points} points</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 grid grid-cols-2 gap-2">
                    <div>
                      <span className="block text-gray-400">Orders</span>
                      <span>{user.orders}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400">Last Login</span>
                      <span>{user.lastLogin}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 flex justify-end space-x-2">
                <button className="p-1 rounded-full hover:bg-green-100 text-gray-500 hover:text-green-600" title="Approve">
                  <CheckCircle size={16} />
                </button>
                <button className="p-1 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600" title="Reject">
                  <XCircle size={16} />
                </button>
                <button className="p-1 rounded-full hover:bg-amber-100 text-gray-500 hover:text-amber-600" title="Manage Rewards">
                  <Award size={16} />
                </button>
                <button className="p-1 rounded-full hover:bg-blue-100 text-gray-500 hover:text-blue-600" title="Payment History">
                  <DollarSign size={16} />
                </button>
                <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500" title="More">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;