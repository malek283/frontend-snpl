import axios, { AxiosResponse } from 'axios';
import { User, UserAdmin } from '../types';
import api from '../axiosInstance';



export class UserService {
  // Récupérer tous les utilisateurs
  static async getUsers(): Promise<UserAdmin[]> {
    try {
      const response: AxiosResponse<User[]> = await api.get(`/users/list/`);
      return response.data as UserAdmin[];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  // Récupérer un utilisateur par ID
  static async getUserById(id: number): Promise<UserAdmin> {
    try {
      const response: AxiosResponse<UserAdmin> = await api.get(`/users/list/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  // Créer un nouvel utilisateur
  static async createUser(userData: Partial<UserAdmin>): Promise<User> {
    try {
      const response: AxiosResponse<UserAdmin> = await api.post(`/users/list/`, userData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  static async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      const response: AxiosResponse<UserAdmin> = await api.put(`/users/updat/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(id: number): Promise<void> {
    try {
      await api.delete(`/users/delete/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  // Approuver un utilisateur
  static async approveUser(id: number): Promise<UserAdmin> {
    try {
      const response: AxiosResponse<UserAdmin> = await api.post(`/users/approve/${id}`, {
        is_approved: true,
      });
      return response.data as UserAdmin;
    } catch (error) {
      console.error(`Erreur lors de l'approbation de l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  // Rejeter un utilisateur
  static async rejectUser(id: number): Promise<UserAdmin> {
    try {
      const response: AxiosResponse<UserAdmin> = await api.post(`/users/refuse/${id}`, {
        is_approved: false,
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors du rejet de l'utilisateur ${id}:`, error);
      throw error;
    }
  }
}