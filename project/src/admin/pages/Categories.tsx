import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Plus, Trash2, Edit, MoreHorizontal, ChevronDown, ChevronRight, X, Check, Image as ImageIcon, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: number;
  name: string;
  image?: string;
  products: number;
  subcategories: Subcategory[];
  shopId?: number;
}

interface Subcategory {
  id: number;
  name: string;
  image?: string;
  products: number;
}

const Categories: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([1]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: '',
    isSubcategory: false,
    parentId: 0
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data initialization with images
  useEffect(() => {
    const mockCategories: Category[] = [
      {
        id: 1,
        name: 'Electronics',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        products: 156,
        shopId: 1,
        subcategories: [
          { id: 11, name: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', products: 65 },
          { id: 12, name: 'Laptops', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', products: 42 },
          { id: 13, name: 'Accessories', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', products: 49 }
        ]
      },
      {
        id: 2,
        name: 'Clothing',
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        products: 243,
        shopId: 1,
        subcategories: [
          { id: 21, name: 'Men\'s Wear', image: 'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', products: 86 },
          { id: 22, name: 'Women\'s Wear', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', products: 124 },
          { id: 23, name: 'Kids\' Wear', image: 'https://images.unsplash.com/photo-1590005024862-6b67679a29fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', products: 33 }
        ]
      },
      {
        id: 3,
        name: 'Home & Garden',
        image: 'https://images.unsplash.com/photo-1583845112203-454375aa0a52?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        products: 178,
        shopId: 2,
        subcategories: [
          { id: 31, name: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', products: 45 },
          { id: 32, name: 'Kitchen', image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', products: 68 },
          { id: 33, name: 'Decor', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', products: 65 }
        ]
      }
    ];
    
    const currentShopId = 1;
    setCategories(mockCategories.filter(cat => cat.shopId === currentShopId));
  }, []);

  const toggleCategory = (id: number) => {
    setExpandedCategories(prev => 
      prev.includes(id) 
        ? prev.filter(catId => catId !== id) 
        : [...prev, id]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setNewCategory({...newCategory, image: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const newId = Math.max(0, ...categories.flatMap(c => [c.id, ...c.subcategories.map(s => s.id)])) + 1;

    if (newCategory.isSubcategory && newCategory.parentId) {
      setCategories(categories.map(cat => 
        cat.id === newCategory.parentId 
          ? {
              ...cat,
              subcategories: [
                ...cat.subcategories,
                { 
                  id: newId, 
                  name: newCategory.name, 
                  image: newCategory.image,
                  products: 0 
                }
              ]
            }
          : cat
      ));
      toast.success('Subcategory added successfully!');
    } else {
      setCategories([
        ...categories,
        {
          id: newId,
          name: newCategory.name,
          image: newCategory.image,
          products: 0,
          shopId: 1,
          subcategories: []
        }
      ]);
      toast.success('Category added successfully!');
    }

    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEditCategory = (category: Category, isSubcategory: boolean, parentId?: number) => {
    setEditMode(true);
    setCurrentCategory(category);
    setNewCategory({
      name: category.name,
      image: category.image || '',
      isSubcategory,
      parentId: parentId || 0
    });
    setPreviewImage(category.image || null);
    setIsAddModalOpen(true);
  };

  const handleUpdateCategory = () => {
    if (!currentCategory) return;

    if (newCategory.isSubcategory && newCategory.parentId) {
      setCategories(categories.map(cat => 
        cat.id === newCategory.parentId
          ? {
              ...cat,
              subcategories: cat.subcategories.map(sub => 
                sub.id === currentCategory.id 
                  ? { ...sub, name: newCategory.name, image: newCategory.image }
                  : sub
              )
            }
          : cat
      ));
    } else {
      setCategories(categories.map(cat => 
        cat.id === currentCategory.id
          ? { ...cat, name: newCategory.name, image: newCategory.image }
          : cat
      ));
    }

    toast.success('Category updated successfully!');
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleDeleteClick = (category: Category, isSubcategory: boolean, parentId?: number) => {
    setCurrentCategory(category);
    setNewCategory({
      name: '',
      image: '',
      isSubcategory,
      parentId: parentId || 0
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCategory = () => {
    if (!currentCategory) return;

    if (newCategory.isSubcategory && newCategory.parentId) {
      setCategories(categories.map(cat => 
        cat.id === newCategory.parentId
          ? {
              ...cat,
              subcategories: cat.subcategories.filter(sub => sub.id !== currentCategory.id)
            }
          : cat
      ));
    } else {
      setCategories(categories.filter(cat => cat.id !== currentCategory.id));
    }

    toast.success('Category deleted successfully!');
    resetForm();
    setIsDeleteModalOpen(false);
  };

  const resetForm = () => {
    setNewCategory({
      name: '',
      image: '',
      isSubcategory: false,
      parentId: 0
    });
    setCurrentCategory(null);
    setEditMode(false);
    setPreviewImage(null);
  };

  const filteredCategories = categories.filter(category =>
    category.subcategories.some(sub =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  

  const totalProducts = categories.reduce((sum, cat) => 
    sum + cat.products + cat.subcategories.reduce((subSum, sub) => subSum + sub.products, 0), 
  0);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6 p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.h2 
          variants={slideUp}
          className="text-2xl md:text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Shop Categories
        </motion.h2>
        <motion.button 
          variants={slideUp}
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus size={18} className="mr-2" />
          Add New Category
        </motion.button>
      </div>

      {/* Filters and Search */}
      <motion.div 
        variants={slideUp}
        className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 space-y-4 backdrop-blur-sm bg-opacity-90"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button className="px-5 py-3 border border-gray-200 rounded-xl flex items-center hover:bg-gray-50 transition-colors duration-200 shadow-sm">
              <Filter size={16} className="mr-2 text-gray-500" />
              <span className="font-medium">Filters</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats cards */}
      <motion.div 
        variants={slideUp}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {[
          { title: 'Total Categories', value: categories.length.toString(), icon: 'layers', color: 'bg-indigo-100 text-indigo-600', bg: 'from-indigo-50 to-indigo-100' },
          { title: 'Total Products', value: totalProducts.toString(), icon: 'package', color: 'bg-emerald-100 text-emerald-600', bg: 'from-emerald-50 to-emerald-100' },
          { title: 'Avg. Products per Category', value: categories.length > 0 ? Math.round(totalProducts / categories.length).toString() : '0', icon: 'bar-chart', color: 'bg-amber-100 text-amber-600', bg: 'from-amber-50 to-amber-100' }
        ].map((stat, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-br ${stat.bg} rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300`}
          >
            <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center mb-4 shadow-inner`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {stat.icon === 'layers' && <><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></>}
                {stat.icon === 'package' && <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></>}
                {stat.icon === 'bar-chart' && <><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></>}
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </div>
        ))}
      </motion.div>

      {/* Categories Table */}
      <motion.div 
        variants={slideUp}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Products</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <React.Fragment key={category.id}>
                    <tr className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {category.subcategories.length > 0 && (
                            <button 
                              onClick={() => toggleCategory(category.id)}
                              className="mr-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                              {expandedCategories.includes(category.id) ? 
                                <ChevronDown size={18} className="text-gray-500 group-hover:text-indigo-600" /> : 
                                <ChevronRight size={18} className="text-gray-500 group-hover:text-indigo-600" />
                              }
                            </button>
                          )}
                          {category.subcategories.length === 0 && <div className="w-9"></div>}
                          <div className="flex items-center">
                            {category.image && (
                              <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 shadow-sm">
                                <img 
                                  src={category.image} 
                                  alt={category.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{category.name}</div>
                              <div className="text-xs text-gray-500">
                                {category.subcategories.length} subcategories
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 font-medium">{category.products}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end items-center space-x-2">
                          <button 
                            onClick={() => handleEditCategory(category, false)}
                            className="p-2 rounded-full hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-colors" 
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(category, false)}
                            className="p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors" 
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              setIsAddModalOpen(true);
                              setNewCategory(prev => ({...prev, isSubcategory: true, parentId: category.id}));
                            }}
                            className="p-2 rounded-full hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors" 
                            title="Add Subcategory"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Subcategories */}
                    {expandedCategories.includes(category.id) && category.subcategories.map((subcat) => (
                      <motion.tr 
                        key={subcat.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <td className="px-6 py-3">
                          <div className="flex items-center ml-12">
                            {subcat.image && (
                              <div className="w-8 h-8 rounded-md overflow-hidden mr-3 shadow-sm">
                                <img 
                                  src={subcat.image} 
                                  alt={subcat.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="text-sm text-gray-700">{subcat.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 font-medium">
                          {subcat.products}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end items-center space-x-2">
                            <button 
                              onClick={() => handleEditCategory(subcat, true, category.id)}
                              className="p-2 rounded-full hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-colors" 
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(subcat, true, category.id)}
                              className="p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors" 
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <ImageIcon size={24} className="text-gray-400" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-700">No categories found</h4>
                      <p className="text-sm text-gray-500">Create your first category to get started</p>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Add Category
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredCategories.length}</span> main categories with{' '}
            <span className="font-medium">
              {filteredCategories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
            </span>{' '}
            subcategories
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1 border border-indigo-200 bg-indigo-50 text-indigo-600 font-medium rounded-lg text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </motion.div>

      {/* Add/Edit Category Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editMode ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <button 
                    onClick={() => {
                      setIsAddModalOpen(false);
                      resetForm();
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Image
                    </label>
                    <div 
                      onClick={triggerFileInput}
                      className={`w-full h-40 rounded-xl border-2 border-dashed ${previewImage ? 'border-transparent' : 'border-gray-300 hover:border-indigo-400'} overflow-hidden cursor-pointer transition-all duration-200 flex items-center justify-center`}
                    >
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload an image</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {previewImage && (
                      <button
                        onClick={() => {
                          setPreviewImage(null);
                          setNewCategory({...newCategory, image: ''});
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Remove image
                      </button>
                    )}
                  </div>

                  {/* Category Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="Enter category name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    />
                  </div>

                  {/* Subcategory Checkbox (only when adding new) */}
                  {!editMode && (
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={newCategory.isSubcategory}
                            onChange={(e) => setNewCategory({...newCategory, isSubcategory: e.target.checked})}
                          />
                          <div className={`w-10 h-6 rounded-full shadow-inner transition-colors duration-200 ${newCategory.isSubcategory ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${newCategory.isSubcategory ? 'translate-x-5' : 'translate-x-1'}`}></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">This is a subcategory</span>
                      </label>

                      {newCategory.isSubcategory && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Parent Category
                          </label>
                          <select
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            value={newCategory.parentId}
                            onChange={(e) => setNewCategory({...newCategory, parentId: parseInt(e.target.value)})}
                          >
                            <option value={0}>Select a parent category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      onClick={() => {
                        setIsAddModalOpen(false);
                        resetForm();
                      }}
                      className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={editMode ? handleUpdateCategory : handleAddCategory}
                      className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      {editMode ? 'Update' : 'Add'} Category
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Confirm Deletion
                  </h3>
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Warning: This action cannot be undone
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>
                            Are you sure you want to delete the category "{currentCategory?.name}"?
                            {newCategory.isSubcategory ? '' : ' All subcategories will also be deleted.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteCategory}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl text-sm font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete Permanently
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Categories;