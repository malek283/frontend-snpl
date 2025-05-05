import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { useAuthStore } from './authStore';
import { addToCart, getCart, removeFromCart } from '../../services/cartService';
import axios from 'axios';
import { LignePanier, Panier } from '../../types';

interface CartState {
  panier: Panier | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: (clientId: number) => Promise<void>;
  addToCart: (produitId: number, quantite?: number) => Promise<void>;
  removeFromCart: (lignePanierId: number) => Promise<void>;
  updateQuantity: (lignePanierId: number, quantite: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      panier: null,
      isLoading: false,
      error: null,
      fetchCart: async (clientId: number) => {
        set({ isLoading: true, error: null });
        try {
          const panier = await getCart(clientId);
          set({ panier, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
      addToCart: async (produitId: number, quantite: number = 1) => {
        const authState = useAuthStore.getState();
        if (!authState.isAuthenticated || !authState.user?.id) {
          set({ error: 'Veuillez vous connecter pour ajouter des produits au panier.' });
          return;
        }
        set({ isLoading: true, error: null });
        try {
          const clientId = authState.user.id; // Assuming user.id corresponds to client.id
          const newLigne = await addToCart(clientId, produitId, quantite);
          const currentPanier = get().panier;
          if (currentPanier) {
            set({
              panier: {
                ...currentPanier,
                lignes: [...currentPanier.lignes, newLigne],
              },
              isLoading: false,
            });
          } else {
            await get().fetchCart(clientId);
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
      removeFromCart: async (lignePanierId: number) => {
        set({ isLoading: true, error: null });
        try {
          await removeFromCart(lignePanierId);
          const currentPanier = get().panier;
          if (currentPanier) {
            set({
              panier: {
                ...currentPanier,
                lignes: currentPanier.lignes.filter((ligne: { id: number; }) => ligne.id !== lignePanierId),
              },
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      updateQuantity: async (lignePanierId: number, quantite: number) => {
        set({ isLoading: true, error: null });
        try {
          // Note: This assumes the backend supports updating quantity via a PATCH request
          await axios.patch(
            `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/paniers/lignes/${lignePanierId}/`,
            { quantite },
            {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
              },
            }
          );
          const currentPanier = get().panier;
          if (currentPanier) {
            set({
              panier: {
                ...currentPanier,
                lignes: currentPanier.lignes.map((ligne: LignePanier) =>
                  ligne.id === lignePanierId
                    ? { ...ligne, quantite }
                    : ligne
                ),
              },
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
      clearCart: () => {
        set({ panier: null, error: null, isLoading: false });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        panier: state.panier,
      }),
    }
  )
);
