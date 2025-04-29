export interface UserSignupData {
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  role: 'client' | 'marchand' | 'admin';
  password: string;
  confirm_password: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'client' | 'marchand' | 'admin';
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}


export interface CategoryBoutique {

  id?: number;
  nom: string;
  image: File | null;

}

export interface Product {
  id: number;
  nom: string;
  description: string | null;
  prix: number;
  stock: number;
  image: string | null;
  couleur: string | null;
  taille: string | null;
  categorie: string;
  boutique: string;
  created_at: string;
  updated_at: string;
}
export type UserRole = 'client' | 'marchand' | 'admin';

export interface UserAdmin {
  id: number;               // si tu retournes un id
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: UserRole;
  is_active: boolean;
  is_staff: boolean;
  is_approved: boolean;
  created_at: string;        // dates sont souvent string en JSON
  updated_at: string;
}

export interface Client extends User {
  solde_points?: number;
  historique_achats?: string;
}

export interface Marchand extends User {
  boutique_nom?: string;
  description?: string;
}

export interface Admin extends User {
  // Tu peux ajouter ici des méthodes/fonctions spécifiques plus tard
}















