import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
        
        <div className="space-y-6">
          {/* Profile Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{user?.nom || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{user?.email || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
            <div className="space-y-4">
              <button 
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Change Password
              </button>
              <button 
                className="w-full sm:w-auto px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Preferences</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="emailNotifications" className="ml-2 text-gray-700">
                  Receive email notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketingEmails"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="marketingEmails" className="ml-2 text-gray-700">
                  Receive marketing emails
                </label>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
            <button 
              className="px-6 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;