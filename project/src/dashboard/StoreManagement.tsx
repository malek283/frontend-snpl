import React, { useState } from 'react';
import { Building, Edit, UploadCloud } from 'lucide-react';
import { Merchant } from './data/mockData';


interface StoreManagementProps {
  merchant: Merchant;
}

const StoreManagement: React.FC<StoreManagementProps> = ({ merchant }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    storeName: merchant.storeName,
    description: merchant.storeDescription,
    category: merchant.storeCategory,
    logo: merchant.storeLogo,
    coverImage: merchant.storeCoverImage
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the store info in a real app
    // For now we just toggle the editing state
    setIsEditing(false);
  };

  const categories = [
    'Fashion', 'Beauty', 'Electronics', 'Home', 'Sports', 'Food', 'Art', 'Books', 'Health'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion de Boutique</h1>
          <p className="text-gray-500">Personnalisez les informations de votre boutique</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
          >
            <Edit size={18} className="mr-2" />
            <span>Modifier</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {!isEditing ? (
          <div>
            {/* Store Cover Image */}
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
              {formData.coverImage && (
                <img 
                  src={formData.coverImage} 
                  alt="Store Cover" 
                  className="h-full w-full object-cover absolute inset-0"
                />
              )}
              <div className="absolute bottom-4 left-6 flex items-center">
                <div className="h-16 w-16 rounded-lg bg-white p-1 mr-4 shadow-lg">
                  {formData.logo ? (
                    <img 
                      src={formData.logo} 
                      alt="Store Logo" 
                      className="h-full w-full object-cover rounded"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 rounded flex items-center justify-center">
                      <Building size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-white text-2xl font-bold drop-shadow-md">
                    {formData.storeName}
                  </h2>
                  <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {formData.category}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Store Details */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">
                  {formData.description || "Aucune description disponible."}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques de la Boutique</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Date de création</span>
                      <span className="font-medium">12/05/2023</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Nombre de produits</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Commandes totales</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Évaluation moyenne</span>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">4.8</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-4 w-4 ${star <= 5 ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 15.934l-6.18 3.254 1.18-6.875L.1 7.628l6.9-1.003L10 .5l3 6.125 6.9 1.003-4.9 4.685 1.18 6.875L10 15.934z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de Contact</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Email</span>
                      <span className="font-medium">{merchant.email}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Téléphone</span>
                      <span className="font-medium">{merchant.phone || 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Adresse</span>
                      <span className="font-medium">{merchant.address || 'Non renseignée'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Site web</span>
                      <span className="font-medium text-blue-600">
                        {merchant.website || 'Non renseigné'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la boutique
                </label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                    Logo
                  </label>
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                    <input
                      type="text"
                      id="logo"
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
                      placeholder="URL de l'image"
                    />
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <UploadCloud size={18} />
                      <span>Télécharger une image</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Image de couverture
                  </label>
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                    <input
                      type="text"
                      id="coverImage"
                      name="coverImage"
                      value={formData.coverImage}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
                      placeholder="URL de l'image"
                    />
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <UploadCloud size={18} />
                      <span>Télécharger une image</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Enregistrer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StoreManagement;