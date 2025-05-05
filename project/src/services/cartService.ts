import axios from 'axios';
import { Boutique, CategoryProduit, LignePanier, OrderCreatePayload, Panier, Produit } from '../types';
import { useAuthStore } from '../components/Store/authStore';


const API_URL = 'http://localhost:8000/';

export const getBoutiqueDetails = async (boutiqueId: string): Promise<{ boutique: Boutique; categories: CategoryProduit[] }> => {
  try {
    const response = await axios.get(`${API_URL}/boutiques/${boutiqueId}/`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des détails de la boutique');
  }
};

export const getBoutiqueProductsByCategory = async (boutiqueId: string, categoryId: string): Promise<Produit[]> => {
  try {
    const response = await axios.get(`${API_URL}/boutiques/${boutiqueId}/categories/${categoryId}/produits/`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des produits');
  }
};

export const getProductDetails = async (productId: string): Promise<Produit> => {
 
  try {
    const response = await axios.get(`${API_URL}boutique/produitDetails/${productId}/`, {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des détails du produit');
  }
};

// Existing cart service functions...
export const addToCart = async (clientId: number, produitId: number, quantite: number = 1): Promise<LignePanier> => {
  try {
    const response = await axios.post(
      `${API_URL}cart/paniers/add/`,
      {
        client_id: clientId,
        produit_id: produitId,
        quantite,
      },
      {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erreur lors de l\'ajout au panier');
  }
};

export const getCart = async (clientId: number): Promise<Panier> => {
  try {
    const response = await axios.get(`${API_URL}cart/paniers/${clientId}/`, {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la récupération du panier');
  }
};

export const removeFromCart = async (lignePanierId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/paniers/lignes/${lignePanierId}/`, {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la suppression du produit');
  }
};

export const updateCartQuantity = async (lignePanierId: number, quantite: number): Promise<void> => {
  try {
    await axios.patch(
      `${API_URL}/paniers/lignes/${lignePanierId}/`,
      { quantite },
      {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      }
    );
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour de la quantité');
  }
};
export const placeOrder = async (payload: OrderCreatePayload): Promise<void> => {
    console.log('commande22',payload)
    try {
      await axios.post(`${API_URL}cart/orders/create/`, payload, {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la création de la commande');
    }
  };