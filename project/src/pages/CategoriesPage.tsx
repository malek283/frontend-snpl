import React, { useState } from 'react';
import Button from '../components/ui/Button';
import CategoryCard from '../components/categories/CategoryCard';
import { Plus, Search } from 'lucide-react';
import { categories } from '../data/mockData';

import AddCategoryModal from '../components/modals/AddCategoryModal';
import { CategoryBoutique } from '../types';

const CategoriesPage: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesList, setCategoriesList] = useState<CategoryBoutique[]>(categories);

  const handleAddCategory = (category: { name: string; description: string }) => {
    const newCategory: CategoryBoutique = {
      id: `${categoriesList.length + 1}`,
      name: category.name,
      description: category.description,
      slug: category.name.toLowerCase().replace(/\s+/g, '-'),
      productsCount: 0
    };
    
    setCategoriesList([...categoriesList, newCategory]);
  };

  const filteredCategories = categoriesList.filter(category => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Manage your product categories</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          icon={<Plus size={16} />}
        >
          Add Category
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            className="block w-full bg-white pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map(category => (
          <CategoryCard 
            key={category.id} 
            category={category}
            onEdit={() => {/* Handle edit */}}
            onDelete={() => {/* Handle delete */}}
          />
        ))}
      </div>
      
      {/* Empty state */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery 
              ? 'Try adjusting your search criteria.' 
              : 'Get started by creating a new category.'}
          </p>
          {!searchQuery && (
            <div className="mt-6">
              <Button 
                onClick={() => setShowAddModal(true)}
                icon={<Plus size={16} />}
              >
                Add Category
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddCategory}
      />
    </div>
  );
};

export default CategoriesPage;