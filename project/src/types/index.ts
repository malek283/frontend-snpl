export interface UserSignupData {
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  role: string;
  password: string;
  confirm_password: string;
  referral_code?: string;
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
  boutiqueId: number | null;
  referral_code?: string;
  nombre_clients_parraines?: number;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface CategoryBoutique {
  id: number;
  nom: string;
  image?: string | null;
}

export interface Product {
  id: number;
  name: string;
  images: string[];
  price: number;
  discountedPrice?: number | null;
  rating: number;
  isNew: boolean;
  vendor: {
    id: number;
    name: string;
  };
}

export type UserRole = 'client' | 'marchand' | 'admin';

export interface UserAdmin {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: UserRole;
  is_active: boolean;
  is_staff: boolean;
  is_approved: boolean;
  created_at: string;
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

export interface Admin extends User {}

export interface Vendor {
  id: number;
  name: string;
  logo: string;
  description: string;
  rating: number;
  productsCount: number;
}

export interface Boutique {
  id: number;
  nom: string;
  description?: string;
  logo?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  image?: string;
  category_boutique: CategoryBoutique;
  marchand: Marchand;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface AuthToken {
  token: string;
}

export interface MerchantUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_marchant: boolean;
}

export interface Marchand {
  user: string;
  is_marchant: boolean;
}

export interface CategoryProduit {
  id: number;
  nom: string;
  image: File | null;
  boutique: string; // Boutique ID
  boutique_details: Boutique;
  created_at: string;
  updated_at: string;
}

export interface Produit {
  id: number;
  nom: string;
  description: string | null;
  prix: string;
  stock: number;
  image: string | null;
  couleur: string | null;
  taille: string | null;
  category_produit: number;
  category_produit_details: CategoryProduit;
  boutique: string;
  boutique_details: Boutique;
  created_at: string;
  updated_at: string;
}

export interface ProduitCreatePayload {
  nom: string;
  description: string;
  prix: string;
  stock: string;
  couleur: string;
  taille: string;
  image: File | null;
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
  image?: string | null;
  category_boutique?: string;
}

export interface ApiError {
  error?: string;
  [key: string]: any;
}
export interface RemiseType {
  id: number;
  boutique: number | null;
  duree_plan_paiement: string;
  type_remise: string;
  type_remise_display: string;
  nombre_tranches: number | null;
  pourcentage_remise: number;
  montant_max_remise: number | null;
  date_creation: string;
}

export interface RemiseTypeCreatePayload {
  duree_plan_paiement_number: string;
  duree_plan_paiement_unit: string;
  type_remise: string;
  nombre_tranches: string | number | null;
  pourcentage_remise: string | number;
  montant_max_remise: string | number | null;
  boutique: string | number | null;
}
// Interface for a Cart Line Item (LignePanier)
export interface LignePanier {
  id: number;
  produit: Produit;
  quantite: number;
  created_at: string;
}

// Interface for a Cart (Panier)
export interface Panier {
  id: number;
  client: number;
  lignes: LignePanier[];
  created_at: string;
  updated_at: string;
}

// Interface for an Order (Echange)
export interface Order {
  id: number;
  boutique: string;
  montant: number;
  created_at: string;
}

// Interface for Shipping Information
export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

// Interface for Order Creation Payload (for future extensibility)
export interface OrderCreatePayload {
  shippingInfo?: ShippingInfo;
  panierId?: number;
}