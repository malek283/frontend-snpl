

import api from '../axiosInstance';
import { CategoryProduit, Produit, Boutique, ProduitCreatePayload } from '../types';

export const getCategoryProduits = async (boutiqueId?: string): Promise<CategoryProduit[]> => {
  const response = await api.get<CategoryProduit[]>('boutique/category-produits/', {
    params: { boutique_id: boutiqueId },
  });
  console.log('getCategoryProduits response:', response.data);
  return response.data;
};

export const getProduits = async (categoryId?: string, boutiqueId?: string): Promise<Produit[]> => {
  const response = await api.get<Produit[]>('boutique/produits/', {
    params: { category_produit: categoryId, boutique: boutiqueId },
  });
  console.log('getProduits response:', response.data);
  return response.data;
};
export const createProduit = async (payload: ProduitCreatePayload): Promise<Produit> => {
  const formData = new FormData();
  formData.append('nom', payload.nom);
  formData.append('description', payload.description);
  formData.append('prix', payload.prix);
  formData.append('stock', payload.stock);
  formData.append('couleur', payload.couleur);
  formData.append('taille', payload.taille);
  formData.append('boutique', payload.boutique);
  formData.append('category_produit', payload.category_produit);

  if (payload.image) {
    formData.append('image_file', payload.image); // Important : ajouter le fichier
  }

  for (const [key, value] of formData.entries()) {
    console.log(`🧾 ${key}:`, value);
  }
  const response = await api.post<Produit>('boutique/produits/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};


export const updateProduit = async (id: number, payload: any): Promise<Produit> => {
  const response = await api.put<Produit>(`boutique/produits/${id}/`, payload);
  return response.data;
};

export const deleteProduit = async (id: number): Promise<void> => {
  await api.delete(`boutique/produits/${id}/`);
};

export const createCategoryProduit = async (payload: any): Promise<CategoryProduit> => {
  const formData = new FormData();
  formData.append('nom', payload.nom);
  formData.append('boutique', payload.boutique);
  if (payload.image) {
    formData.append('image_file', payload.image); // le champ attendu par le serializer
  }

  const response = await api.post<CategoryProduit>(
    'boutique/category-produits/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};


export const updateCategoryProduit = async (id: number, payload: any): Promise<CategoryProduit> => {
  const response = await api.put<CategoryProduit>(`boutique/category-produits/${id}/`, payload);
  return response.data;
};

export const deleteCategoryProduit = async (id: number): Promise<void> => {
  await api.delete(`boutique/category-produits/${id}/`);
};

export const getBoutiques = async (): Promise<Boutique[]> => {
  const response = await api.get<Boutique[]>('boutique/boutiques/');
  console.log('getBoutiques response:', response.data);
  return response.data;
};

export const updateBoutique = async (id: number, payload: any): Promise<Boutique> => {
  const response = await api.put<Boutique>(`boutique/boutiques/${id}/`, payload);
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
