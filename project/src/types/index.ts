export interface UserSignupData {
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  role: 'Client' | 'Marchand' | 'Admin';
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
  role: 'Client' | 'Marchand' | 'Admin';
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}


export interface CategoryBoutique {

  id?: number;
  nom: string;
  image?: string | null;

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
  boutique_nom?: string;
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





export interface Boutique {

  id: number;
  nom: string;
  description: string;
  logo?: string | File; // Can be URL or File during creation
  adresse?: string;
  telephone?: string;
  email?: string;
  image?: string | File; // Can be URL or File during creation
  category_boutique: number | CategoryBoutique; // ID or object
  marchand: number; // Assuming marchand is an ID
  created_at: string;
  updated_at: string;
}

// Authentication-related interfaces
export interface AuthToken {
  token: string;
}

export interface MerchantUser {
  id: number;
  username: string;
  email: string;
  first_name: string; // Maps to prenom in Marchand
  last_name: string;  // Maps to nom in Marchand
  is_marchant: boolean;
}

// Model interfaces based on backend serializers


export interface Marchand {
  user: string; // String representation (e.g., "Marchand: Prenom Nom")
  is_marchant: boolean;
}

export interface CategoryProduit {
  id: number;
  nom: string;
  image: string | null;
  boutique: string; // Boutique ID
  boutique_details: Boutique;
  created_at: string;
  updated_at: string;
}

export interface Produit {
  id: number;
  nom: string;
  description: string | null;
  prix: string; // Decimal as string (e.g., "19.99")
  stock: number;
  image: string | null;
  couleur: string | null;
  taille: string | null;
  category_produit: number; // CategoryProduit ID
  category_produit_details: CategoryProduit;
  boutique: string; // Boutique ID
  boutique_details: Boutique;
  created_at: string;
  updated_at: string;
}

// API payload interfaces
export interface ProduitCreatePayload {
  nom: string;
  description?: string;
  prix: string;
  stock: string;
  couleur?: string;
  taille?: string;
  image?: File | null;
  category_produit: string;
  boutique: string;
}

export interface ProduitUpdatePayload {
  nom?: string;
  description?: string;
  prix?: string;
  stock?: string;
  couleur?: string;
  taille?: string;
  image?: File | null;
  category_produit?: string;
  boutique?: string;
}

export interface CategoryProduitCreatePayload {
  nom: string;
  image?: File | null;
  boutique: string;
}

export interface CategoryProduitUpdatePayload {
  nom?: string;
  image?: File | null;
  boutique?: string;
}

export interface BoutiqueUpdatePayload {
  nom?: string;
  description?: string;
  logo?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  image?: File | null;
  category_boutique?: string;
}

// Error response interface
export interface ApiError {
  error?: string;
  [key: string]: any; // For detailed validation errors
}