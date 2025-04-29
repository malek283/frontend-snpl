

// Replace with your API base URL

import api from "../axiosInstance";
import { Boutique } from "../types";



export const createBoutique = async (boutiqueData: FormData): Promise<Boutique> => {
  try {
    const response = await api.post(`boutique/boutiques/`, boutiqueData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Boutique created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating boutique:', error);
    throw error;
  }
};