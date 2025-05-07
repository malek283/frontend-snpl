import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAllBoutiques, createBoutique, deleteBoutique, getBoutiquesall } from '../../services/boutiqueService';
import { getCategories } from '../../services/categorieService';
import { Boutique, CategoryBoutique } from '../../types';
import { useAuthStore } from '../../components/Store/authStore';

const Stores: React.FC = () => {
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [filteredBoutiques, setFilteredBoutiques] = useState<Boutique[]>([]);
  const [categories, setCategories] = useState<CategoryBoutique[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBoutique, setNewBoutique] = useState({
    nom: '',
    description: '',
    adresse: '',
    telephone: '',
    email: '',
    category_boutique: '',
    logo: null as File | null,
    image: null as File | null,
  });
  const { user } = useAuthStore();

  // Update pagination based on filtered boutiques
  const updatePagination = (boutiques: Boutique[]) => {
    const totalCount = boutiques.length;
    const totalPages = Math.ceil(totalCount / pagination.pageSize);
    setPagination((prev) => ({
      ...prev,
      totalCount,
      totalPages: totalPages || 1, // Ensure at least 1 page
      currentPage: Math.min(prev.currentPage, totalPages || 1), // Adjust currentPage if it exceeds totalPages
    }));
  };

  // Fetch boutiques
  const fetchBoutiques = async () => {
    setLoading(true);
    setError(null);
    try {
      const boutiques = await getBoutiquesall();
      setBoutiques(boutiques);
      setFilteredBoutiques(boutiques);
      updatePagination(boutiques); // Update pagination after fetching
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch boutiques';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Fetch boutiques error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories and boutiques on mount
  useEffect(() => {
    fetchBoutiques();
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err: any) {
        console.error('Fetch categories error:', err);
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  // Filter boutiques and update pagination
  useEffect(() => {
    let result = boutiques;
    if (searchTerm) {
      result = result.filter(
        (boutique) =>
          boutique.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          boutique.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          boutique.telephone?.includes(searchTerm)
      );
    }
    setFilteredBoutiques(result);
    updatePagination(result); // Update pagination after filtering
  }, [searchTerm, boutiques]);

  // Handle delete
  const handleDelete = async (boutiqueId: number) => {
    if (window.confirm('Are you sure you want to delete this boutique?')) {
      try {
        await deleteBoutique(boutiqueId);
        const updatedBoutiques = boutiques.filter((b) => b.id !== boutiqueId);
        setBoutiques(updatedBoutiques);
        setFilteredBoutiques(updatedBoutiques);
        updatePagination(updatedBoutiques); // Update pagination after deletion
        toast.success('Boutique deleted successfully');
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to delete boutique';
        toast.error(errorMessage);
        console.error('Delete boutique error:', err);
      }
    }
  };

  // Handle add boutique
  const handleAddBoutique = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoutique.nom || !newBoutique.category_boutique) {
      toast.error('Name and category are required');
      return;
    }
    if (newBoutique.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newBoutique.email)) {
      toast.error('Invalid email format');
      return;
    }
    const formData = new FormData();
    Object.entries(newBoutique).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string | Blob);
      }
    });
    if (user?.id) {
      formData.append('marchand', user.id.toString());
    }
    try {
      const boutique = await createBoutique(formData);
      const updatedBoutiques = [...boutiques, boutique];
      setBoutiques(updatedBoutiques);
      setFilteredBoutiques(updatedBoutiques);
      updatePagination(updatedBoutiques); // Update pagination after adding
      setShowAddModal(false);
      setNewBoutique({
        nom: '',
        description: '',
        adresse: '',
        telephone: '',
        email: '',
        category_boutique: '',
        logo: null,
        image: null,
      });
      toast.success('Boutique created successfully');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create boutique';
      toast.error(errorMessage);
      console.error('Create boutique error:', err);
    }
  };

  // Pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  // Render page buttons dynamically
  const renderPageButtons = () => {
    const { currentPage, totalPages } = pagination;
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    // Adjust startPage if endPage is at the limit
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    const buttons = [];
    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 border rounded-lg ${
            currentPage === page ? 'bg-indigo-100 text-indigo-700' : ''
          }`}
        >
          {page}
        </button>
      );
    }
    return buttons;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
        <button
          onClick={fetchBoutiques}
          className="ml-4 px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Boutique Management</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2" /> Add Boutique
        </button>
      </div>

      {/* Add Boutique Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Boutique</h2>
            <form onSubmit={handleAddBoutique}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={newBoutique.nom}
                  onChange={(e) => setNewBoutique({ ...newBoutique, nom: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={newBoutique.description}
                  onChange={(e) => setNewBoutique({ ...newBoutique, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Address</label>
                <input
                  type="text"
                  value={newBoutique.adresse}
                  onChange={(e) => setNewBoutique({ ...newBoutique, adresse: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  value={newBoutique.telephone}
                  onChange={(e) => setNewBoutique({ ...newBoutique, telephone: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={newBoutique.email}
                  onChange={(e) => setNewBoutique({ ...newBoutique, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Category</label>
                <select
                  value={newBoutique.category_boutique}
                  onChange={(e) =>
                    setNewBoutique({ ...newBoutique, category_boutique: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewBoutique({ ...newBoutique, logo: e.target.files?.[0] || null })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewBoutique({ ...newBoutique, image: e.target.files?.[0] || null })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="mr-2 px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search boutiques..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Marchand</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBoutiques
                .slice(
                  (pagination.currentPage - 1) * pagination.pageSize,
                  pagination.currentPage * pagination.pageSize
                )
                .map((boutique) => (
                  <tr key={boutique.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {boutique.logo && (
                          <img
                            src={`http://localhost:8000${boutique.logo}`}
                            alt={boutique.nom || 'Boutique'}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium">{boutique.nom || 'Unnamed Boutique'}</div>
                          <div className="text-sm text-gray-500">{boutique.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{boutique.category_boutique?.nom || 'N/A'}</td>
                    <td className="py-3 px-4">{boutique.marchand?.user?.nom || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-500 hover:text-blue-700">
                          <Eye />
                        </button>
                        <button className="p-1 text-indigo-500 hover:text-indigo-700">
                          <Edit />
                        </button>
                        <button
                          className="p-1 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(boutique.id)}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {filteredBoutiques.length === 0 && (
          <div className="text-center py-8 text-gray-500">No boutiques found</div>
        )}

        {filteredBoutiques.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div>
              Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)} of{' '}
              {pagination.totalCount} boutiques
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              {renderPageButtons()}
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stores;