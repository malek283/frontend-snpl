import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, ChevronDown, ChevronUp, X, List, Grid } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  image?: string;
}

const ProductManagement: React.FC = () => {
  // États initiaux
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'categories' | 'products'>('categories');
  
  // États pour les modales
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // États pour la sélection et le filtrage
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fonctions pour les catégories
  const handleAddCategory = (newCategory: Omit<Category, 'id'>) => {
    setCategories([...categories, { ...newCategory, id: Date.now().toString() }]);
    setIsAddCategoryModalOpen(false);
  };

  // Fonctions pour les produits
  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    setProducts([...products, { ...newProduct, id: Date.now().toString() }]);
    setIsAddProductModalOpen(false);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setIsEditModalOpen(false);
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setIsDeleteModalOpen(false);
    }
  };

  // Filtrage et tri des produits
  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'all' || product.categoryId === selectedCategory) &&
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });

  const handleSort = (column: 'name' | 'price' | 'stock') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Composant pour le formulaire de catégorie
  const CategoryFormModal = () => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Ajouter une Catégorie</h3>
          <button onClick={() => setIsAddCategoryModalOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const name = (form.elements.namedItem('name') as HTMLInputElement).value;
          const description = (form.elements.namedItem('description') as HTMLInputElement).value;
          handleAddCategory({ name, description });
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input 
                name="name" 
                type="text" 
                required 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                name="description" 
                rows={3} 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  // Composant pour le formulaire de produit
  const ProductFormModal = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{isEdit ? 'Modifier' : 'Ajouter'} un Produit</h3>
          <button onClick={() => isEdit ? setIsEditModalOpen(false) : setIsAddProductModalOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const newProduct = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            description: (form.elements.namedItem('description') as HTMLInputElement).value,
            price: parseFloat((form.elements.namedItem('price') as HTMLInputElement).value),
            stock: parseInt((form.elements.namedItem('stock') as HTMLInputElement).value),
            categoryId: (form.elements.namedItem('categoryId') as HTMLSelectElement).value,
            image: (form.elements.namedItem('image') as HTMLInputElement).value
          };
          
          if (isEdit && selectedProduct) {
            handleEditProduct({ ...newProduct, id: selectedProduct.id });
          } else {
            handleAddProduct(newProduct);
          }
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input 
                name="name" 
                type="text" 
                required 
                defaultValue={isEdit ? selectedProduct?.name : ''}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                name="description" 
                rows={3} 
                defaultValue={isEdit ? selectedProduct?.description : ''}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select
                name="categoryId"
                required
                defaultValue={isEdit ? selectedProduct?.categoryId : ''}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix *</label>
                <input 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  required 
                  defaultValue={isEdit ? selectedProduct?.price : ''}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <input 
                  name="stock" 
                  type="number" 
                  required 
                  defaultValue={isEdit ? selectedProduct?.stock : ''}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input 
                name="image" 
                type="text" 
                defaultValue={isEdit ? selectedProduct?.image : ''}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => isEdit ? setIsEditModalOpen(false) : setIsAddProductModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isEdit ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des Produits</h1>
      
      {/* Onglets */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'categories' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('categories')}
        >
          Catégories
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'products' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => {
            if (categories.length === 0) {
              alert('Veuillez créer au moins une catégorie avant de gérer les produits');
            } else {
              setActiveTab('products');
            }
          }}
          disabled={categories.length === 0}
        >
          Produits
        </button>
      </div>
      
      {/* Contenu des onglets */}
      {activeTab === 'categories' ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Liste des Catégories</h2>
            <button
              onClick={() => setIsAddCategoryModalOpen(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <Plus size={18} className="mr-2" />
              Ajouter une Catégorie
            </button>
          </div>
          
          {categories.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">Aucune catégorie créée</p>
              <button
                onClick={() => setIsAddCategoryModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Créer votre première catégorie
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de produits</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map(category => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{category.name}</td>
                      <td className="px-6 py-4 text-gray-500">{category.description || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {products.filter(p => p.categoryId === category.id).length} produits
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Liste des Produits</h2>
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <Plus size={18} className="mr-2" />
              Ajouter un Produit
            </button>
          </div>
          
          {/* Filtres */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <select
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Toutes catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          
          {/* Tableau des produits */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">Aucun produit trouvé</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                Réinitialiser les filtres
              </button>
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Ajouter un produit
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center">
                        Prix
                        {sortBy === 'price' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('stock')}
                    >
                      <div className="flex items-center">
                        Stock
                        {sortBy === 'stock' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map(product => {
                    const category = categories.find(c => c.id === product.categoryId);
                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-gray-500 text-sm line-clamp-1">{product.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.price.toFixed(2)} €</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock > 10 ? 'bg-green-100 text-green-800' :
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.stock} en stock
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category?.name || 'Catégorie inconnue'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsEditModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsDeleteModalOpen(true);
                              }}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Supprimer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Modales */}
      {isAddCategoryModalOpen && <CategoryFormModal />}
      {isAddProductModalOpen && <ProductFormModal />}
      {isEditModalOpen && <ProductFormModal isEdit />}
      
      {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Confirmer la suppression</h3>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer le produit "{selectedProduct.name}" ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;