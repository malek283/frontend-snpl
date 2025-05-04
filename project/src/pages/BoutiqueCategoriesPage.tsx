import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBoutiqueDetails, getBoutiqueProductsByCategory } from '../services/boutiqueService';
import { CategoryProduit, Boutique, Produit } from '../types';
import ProductCard from '../components/ui/ProductCard';
import { ArrowLeft, X } from 'lucide-react';

const BoutiqueCategoriesPage = () => {
  const { boutiqueId } = useParams<{ boutiqueId: string }>();
  const [categories, setCategories] = useState<CategoryProduit[]>([]);
  const [boutique, setBoutique] = useState<Boutique | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryProduit | null>(null);
  const [products, setProducts] = useState<Produit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoutiqueDetails = async () => {
      try {
        setIsLoading(true);
        if (boutiqueId) {
          const data = await getBoutiqueDetails(boutiqueId);
          setBoutique(data.boutique);
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Error fetching boutique details:', err);
        setError('Échec du chargement des catégories. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoutiqueDetails();
  }, [boutiqueId]);

  const handleCategoryClick = async (category: CategoryProduit) => {
    try {
      setIsProductsLoading(true);
      setSelectedCategory(category);
      if (boutiqueId) {
        const productData = await getBoutiqueProductsByCategory(boutiqueId, category.id.toString());
        setProducts(productData);
      }
    } catch (err: any) {
      console.error('Erreur chargement produits :', err);
      setError(err.response?.data?.error || 'Impossible de charger les produits.');
      setSelectedCategory(null);
      setProducts([]);
    } finally {
      setIsProductsLoading(false);
    }
  };

  const handleCloseProducts = () => {
    setSelectedCategory(null);
    setProducts([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section with only one slide */}
      <div className="relative w-full h-screen max-h-[600px] overflow-hidden bg-gray-100">
        <div className="min-w-full h-full relative flex">
          <div className="w-1/2 bg-pink-50 flex flex-col justify-center pl-16 pr-8">
            <div className="max-w-md">
              <p className="text-sm uppercase tracking-widest mb-2">One That Much</p>
              <h2 className="text-5xl font-bold mb-4 tracking-tight">{boutique?.nom?.toUpperCase() || 'BOUTIQUE'}</h2>
              <p className="text-gray-600 mb-8">
                {boutique?.description || 'Découvrez notre sélection exclusive de produits.'}
              </p>
              <button className="bg-black text-white px-8 py-3 uppercase text-sm tracking-wider hover:bg-gray-800 transition-colors">
                SHOP NOW
              </button>
            </div>
          </div>
          <div className="w-1/2 h-full bg-cover bg-center" style={{ 
            backgroundImage: `url(${boutique?.logo || 'https://via.placeholder.com/800x600'})` 
          }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="mb-6">
          <Link
            to={`/category-boutiques/${boutique?.category_boutique}`}
            className="flex items-center text-primary hover:text-primary-dark"
          >
            <ArrowLeft className="mr-2" size={20} />
            Retour aux boutiques
          </Link>
        </div>

        {/* Boutique Section Title */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-light tracking-wider mb-6 text-gray-800">
            NOS CATÉGORIES DE PRODUITS
          </h2>
          <div className="w-16 h-px bg-black mx-auto"></div>
        </div>

        {/* Categories Display */}
        {categories.length === 0 ? (
          <p className="text-center text-gray-500">Aucune catégorie de produit trouvée.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 justify-items-center mb-24">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="flex flex-col items-center cursor-pointer group transition-all duration-300"
              >
                <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-200 shadow-md transform transition duration-300 group-hover:scale-105 group-hover:shadow-lg">
                  <img
                    src={category.image || 'https://via.placeholder.com/300'}
                    alt={category.nom}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-4 text-center font-medium text-sm uppercase tracking-wider text-gray-800 group-hover:text-black">
                  {category.nom}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Products Section */}
        {selectedCategory && (
          <div className="bg-white rounded-lg shadow-md p-8 relative mt-16 mb-16">
            <button 
              onClick={handleCloseProducts}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-light tracking-wide mb-8 text-center">
              {selectedCategory.nom.toUpperCase()}
            </h2>
            {isProductsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : products.length === 0 ? (
              <p className="text-gray-500 text-center py-12">Aucun produit trouvé dans cette catégorie.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      id: product.id,
                      name: product.nom,
                      images: [product.image || 'https://via.placeholder.com/300'],
                      price: parseFloat(product.prix),
                      discountedPrice: null,
                      rating: 4.5,
                      isNew: new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      vendor: {
                        id: parseInt(product.boutique),
                        name: boutique?.nom || 'Inconnu'
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoutiqueCategoriesPage;
