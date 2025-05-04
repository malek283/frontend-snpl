
import api from '../axiosInstance';
import { Produit, ProduitCreatePayload, ProduitUpdatePayload, CategoryProduitCreatePayload, CategoryProduitUpdatePayload, Boutique, BoutiqueUpdatePayload, CategoryProduit } from '../types';

// Produit Services
export const getProduits = async (categoryProduitId?: string): Promise<Produit[]> => {
  const params = categoryProduitId ? { category_produit_id: categoryProduitId } : {};
  const response = await api.get<Produit[]>('boutique/produits/', { params });
  return response.data;
};

export const createProduit = async (produitData: ProduitCreatePayload): Promise<Produit> => {
  console.log('produitData', produitData)
  const formData = new FormData();
  Object.entries(produitData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as string | Blob);
    }
  });
  const response = await api.post<Produit>('boutique/produits/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateProduit = async (id: number, produitData: ProduitUpdatePayload): Promise<Produit> => {
  const formData = new FormData();
  Object.entries(produitData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as string | Blob);
    }
  });
  const response = await api.put<Produit>(`boutique/produits/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteProduit = async (id: number): Promise<void> => {
  await api.delete(`boutique/produits/${id}/`);
};


// CategoryProduit Services
export const getCategoryProduits = async (): Promise<CategoryProduit[]> => {
  const response = await api.get<CategoryProduit[]>('boutique/category_produits/');
  console.log('getCategoryProduits response:', response.data);
  return response.data;
};

export const createCategoryProduit = async (categoryData: CategoryProduitCreatePayload): Promise<CategoryProduit> => {
  const formData = new FormData();
  Object.entries(categoryData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as string | Blob);
    }
  });
  const response = await api.post<CategoryProduit>('boutique/category_produits/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateCategoryProduit = async (
  id: number,
  categoryData: CategoryProduitUpdatePayload
): Promise<CategoryProduit> => {
  const formData = new FormData();
  Object.entries(categoryData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as string | Blob);
    }
  });
  const response = await api.put<CategoryProduit>(`boutique/category_produits/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteCategoryProduit = async (id: number): Promise<void> => {
  await api.delete(`boutique/category_produits/${id}/`);
};

// Boutique Services
export const getBoutiques = async (): Promise<Boutique[]> => {
  const response = await api.get<Boutique[]>('boutique/boutiques/');
  console.log('boutique response:', response.data);
  return response.data;
};

export const getBoutiquechat = async (boutiqueId?: string): Promise<Boutique[]> => {
  try {
    const response = await api.get<Boutique[] | Boutique>('boutique/boutiquechat/', {
      params: boutiqueId ? { boutique_id: boutiqueId } : {},
    });
    console.log('Boutique response:', response.data);
    // Normalize response to always return an array
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error('Error fetching boutiques:', error);
    throw error;
  }
};

export const updateBoutique = async (id: number, boutiqueData: BoutiqueUpdatePayload): Promise<Boutique> => {
  const formData = new FormData();
  Object.entries(boutiqueData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as string | Blob);
    }
  });
  const response = await api.put<Boutique>(`boutique/boutiques/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
export const getBoutiqueDetails = async (boutiqueId: string): Promise<{
  boutique: Boutique;
  categories: CategoryProduit[];
  products: Produit[];
}> => {
  try {
    const response = await api.get(`boutique/boutiques/${boutiqueId}/details/`);
    
    // Validation des données reçues
    if (!response.data || !response.data.boutique) {
      throw new Error('Données de boutique invalides');
    }
    
    return {
      boutique: response.data.boutique,
      categories: response.data.categories || [],
      products: response.data.products || []
    };
  } catch (error) {
    console.error('Error fetching boutique details:', error);
    throw error;
  }
};

