import axios from 'axios';
import { Boutique, CategoryProduit, LignePanier, OrderCreatePayload, Panier, Produit, ShippingInfo } from '../types';
import { useAuthStore } from '../components/Store/authStore';

const API_URL = 'http://localhost:8000/';

export const addToCart = async (produitId: number, quantite: number = 1): Promise<LignePanier> => {
  try {
    const response = await axios.post(
      `${API_URL}cart/panier/add/`,
      { produit_id: produitId, quantite },
      {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout au panier');
  }
};

export const getCart = async (): Promise<Panier> => {
  try {
    const response = await axios.get(`${API_URL}cart/panier/`, {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du panier');
  }
};

export const removeFromCart = async (lignePanierId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}cart/panier/lignes/${lignePanierId}/`, {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du produit');
  }
};

export const updateCartQuantity = async (lignePanierId: number, quantite: number): Promise<LignePanier> => {
  try {
    const response = await axios.patch(
      `${API_URL}cart/panier/lignes/${lignePanierId}/`,
      { quantite },
      {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de la quantité');
  }
};

export const placeOrder = async (shippingInfo: ShippingInfo): Promise<void> => {
  try {
    await axios.post(
      `${API_URL}cart/panier/checkout/`,
      { shipping_info: shippingInfo },
      {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      }
    );
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la création de la commande');
  }
};

export const getOrders = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}cart/orders/`, {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des commandes');
  }
};