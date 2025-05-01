
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, InputLabel, FormControl,
  Typography, Box, Alert, SelectChangeEvent, Card, CardContent, CardMedia, CardActions, Grid, IconButton
} from '@mui/material';
import { Add, Edit, Delete, Save, Cancel } from '@mui/icons-material';
import {
  getCategoryProduits, getProduits, updateProduit, createProduit, updateCategoryProduit,
  createCategoryProduit, deleteProduit, deleteCategoryProduit,
  getBoutiques
} from '../services/productproduitservice';
import { CategoryProduit, CategoryProduitCreatePayload, Produit, ProduitCreatePayload, Boutique } from '../types';

const ProductManagement: React.FC = () => {
  // State for products, categories, and boutiques
  const [produits, setProduits] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<CategoryProduit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [boutiqueId, setBoutiqueId] = useState<string>('');

  // State for forms
  const [productForm, setProductForm] = useState<ProduitCreatePayload>({
    nom: '', description: '', prix: '', stock: '', couleur: '', taille: '', image: null, category_produit: '', boutique: '',
  });
  const [categoryForm, setCategoryForm] = useState<CategoryProduitCreatePayload>({ nom: '', image: null, boutique: '' });

  // State for editing and dialogs
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  // Fetch boutiques and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch boutiques
        const boutiquesData = await getBoutiques();
        console.log('Boutiques API response:', boutiquesData);
        if (boutiquesData.length === 0) {
          setError('No boutiques found. Please create a boutique first.');
          return;
        }

        // Use the first boutique's ID (extend for multiple boutiques if needed)
        const boutiqueIdFromBoutiques = boutiquesData[0].id.toString();
        setBoutiqueId(boutiqueIdFromBoutiques);

        // Update forms with boutique ID
        setProductForm((prev) => ({ ...prev, boutique: boutiqueIdFromBoutiques }));
        setCategoryForm((prev) => ({ ...prev, boutique: boutiqueIdFromBoutiques }));

        // Fetch categories
        const categoriesData = await getCategoryProduits();
        console.log('Categories API response:', categoriesData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to fetch boutiques or categories. Please try again.');
        console.error('Fetch error:', err);
      }
    };
    fetchData();
  }, []);

  // Fetch products when selectedCategory changes
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const produitsData = await getProduits(selectedCategory || undefined);
        console.log('Products API response:', produitsData);
        setProduits(produitsData);
      } catch (err) {
        setError('Failed to fetch products. Please try again.');
        console.error('Fetch error:', err);
      }
    };
    fetchProduits();
  }, [selectedCategory]);

  // Handle product form input changes
  const handleProductFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target as HTMLInputElement | { name: string; value: string };
    const files = (e.target as HTMLInputElement).files;
    setProductForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle category form input changes
  const handleCategoryFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  // Handle product form submission
  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!productForm.boutique) {
      setError('Boutique ID is required. Please ensure a valid boutique is configured.');
      return;
    }
    try {
      if (editingProductId) {
        const updatedProduit = await updateProduit(editingProductId, productForm);
        setProduits(produits.map((p) => (p.id === editingProductId ? updatedProduit : p)));
        setEditingProductId(null);
      } else {
        const newProduit = await createProduit({ ...productForm, category_produit: selectedCategory });
        setProduits([...produits, newProduit]);
      }
      setProductForm({
        nom: '', description: '', prix: '', stock: '', couleur: '', taille: '', image: null,
        category_produit: '', boutique: boutiqueId,
      });
      setOpenProductDialog(false);
    } catch (err) {
      setError('Failed to save product. Please check your input and try again.');
      console.error('Product submit error:', err);
    }
  };

  // Handle category form submission
  const handleCategorySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!categoryForm.boutique) {
      setError('Boutique ID is required. Please ensure a valid boutique is configured.');
      return;
    }
    try {
      if (editingCategoryId) {
        const updatedCategory = await updateCategoryProduit(editingCategoryId, {
          ...categoryForm,
          boutique: categoryForm.boutique.toString(),
        });
        setCategories(categories.map((c) => (c.id === editingCategoryId ? updatedCategory : c)));
        setEditingCategoryId(null);
      } else {
        console.log('Submitting category payload:', categoryForm);
        const newCategory = await createCategoryProduit(categoryForm);
        console.log('Category creation response:', newCategory);
        setCategories([...categories, newCategory]);
      }
      setCategoryForm({ nom: '', image: null, boutique: boutiqueId });
      setOpenCategoryDialog(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.non_field_errors?.[0] || 'Failed to save category. Please check your input and try again.';
      setError(errorMessage);
      console.error('Category submit error:', err.response?.data || err);
    }
  };

  // Handle product edit
  const handleEditProduct = (produit: Produit) => {
    setEditingProductId(produit.id);
    setProductForm({
      nom: produit.nom, description: produit.description || '', prix: produit.prix, stock: produit.stock.toString(),
      couleur: produit.couleur || '', taille: produit.taille || '', image: null,
      category_produit: produit.category_produit.toString(), boutique: produit.boutique.toString(),
    });
    setOpenProductDialog(true);
  };

  // Handle category edit
  const handleEditCategory = (category: CategoryProduit) => {
    setEditingCategoryId(category.id);
    setCategoryForm({ nom: category.nom, image: null, boutique: category.boutique.toString() });
    setOpenCategoryDialog(true);
  };

  // Handle product deletion
  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduit(id);
      setProduits(produits.filter((p) => p.id !== id));
    } catch (err) {
      setError('Failed to delete product. Please try again.');
      console.error('Delete product error:', err);
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategoryProduit(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      setError('Failed to delete category. Please try again.');
      console.error('Delete category error:', err);
    }
  };

  // Helper to get image URL with console logs
  const getImageUrl = (
    image: string | File | null,
    context: 'Product' | 'Category',
    itemName: string
  ) => {
    console.log(`[${context}] Image for ${itemName}:`, image);
    if (typeof image === 'string' && image) {
      const isFullUrl = image.startsWith('http://') || image.startsWith('https://');
      console.log(`[${context}] Image is a string, full URL: ${isFullUrl}, URL: ${image}`);
      return image; // Server returned a URL
    }
    if (image instanceof File) {
      const objectUrl = URL.createObjectURL(image);
      console.log(`[${context}] Image is a File, created Object URL: ${objectUrl}`);
      return objectUrl; // Create object URL for File
    }
    console.log(`[${context}] No image provided for ${itemName}, returning null`);
    return null; // No image
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4}>Product Management</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Category Section */}
      <Box mb={8}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="medium">Categories</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenCategoryDialog(true)}
          >
            Add Category
          </Button>
        </Box>

        {/* Category Dialog */}
        <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)}>
          <DialogTitle>{editingCategoryId ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth margin="dense" label="Category Name" name="nom" value={categoryForm.nom}
              onChange={handleCategoryFormChange} required
            />
            <TextField
              fullWidth margin="dense" type="file" name="image" onChange={handleCategoryFormChange}
              InputLabelProps={{ shrink: true }} label="Image"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCategoryDialog(false)} startIcon={<Cancel />}>Cancel</Button>
            <Button onClick={handleCategorySubmit} variant="contained" startIcon={<Save />}>
              {editingCategoryId ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Category Cards */}
        <Grid container spacing={3}>
          {categories.length === 0 && (
            <Grid item xs={12}>
              <Typography>No categories found.</Typography>
            </Grid>
          )}
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={getImageUrl(category.image, 'Category', category.nom) || 'https://via.placeholder.com/140'}
                  alt={category.nom}
                  sx={{ objectFit: 'cover' }}
                  onError={() => console.error(`[Category] Failed to load image for ${category.nom}`)}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{category.nom}</Typography>
                  {!category.image && (
                    <Typography variant="body2" color="text.secondary">
                      No image available
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <IconButton onClick={() => handleEditCategory(category)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDeleteCategory(category.id)}><Delete /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Category Filter */}
      <Box mb={4}>
        <FormControl fullWidth>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} label="Filter by Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id.toString()}>{category.nom}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Product Section */}
      <Box mb={8}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="medium">Products</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenProductDialog(true)}
          >
            Add Product
          </Button>
        </Box>

        {/* Product Dialog */}
        <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)}>
          <DialogTitle>{editingProductId ? 'Edit Product' : 'Add Product'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth margin="dense" label="Product Name" name="nom" value={productForm.nom}
              onChange={handleProductFormChange} required
            />
            <TextField
              fullWidth margin="dense" label="Description" name="description" value={productForm.description}
              onChange={handleProductFormChange} multiline rows={3}
            />
            <TextField
              fullWidth margin="dense" label="Price" name="prix" type="number" value={productForm.prix}
              onChange={handleProductFormChange} required
            />
            <TextField
              fullWidth margin="dense" label="Stock" name="stock" type="number" value={productForm.stock}
              onChange={handleProductFormChange} required
            />
            <TextField
              fullWidth margin="dense" label="Color" name="couleur" value={productForm.couleur}
              onChange={handleProductFormChange}
            />
            <TextField
              fullWidth margin="dense" label="Size" name="taille" value={productForm.taille}
              onChange={handleProductFormChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                name="category_produit"
                value={productForm.category_produit}
                onChange={(e: SelectChangeEvent<string>) => handleProductFormChange(e)}
                label="Category"
                required
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id.toString()}>{category.nom}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth margin="dense" type="file" name="image" onChange={handleProductFormChange}
              InputLabelProps={{ shrink: true }} label="Image"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenProductDialog(false)} startIcon={<Cancel />}>Cancel</Button>
            <Button onClick={handleProductSubmit} variant="contained" startIcon={<Save />}>
              {editingProductId ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Product Cards */}
        <Grid container spacing={3}>
          {produits.length === 0 && (
            <Grid item xs={12}>
              <Typography>No products found.</Typography>
            </Grid>
          )}
          {produits.map((produit) => (
            <Grid item xs={12} sm={6} md={4} key={produit.id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={getImageUrl(produit.image, 'Product', produit.nom) || 'https://via.placeholder.com/140'}
                  alt={produit.nom}
                  sx={{ objectFit: 'cover' }}
                  onError={() => console.error(`[Product] Failed to load image for ${produit.nom}`)}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{produit.nom}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${produit.prix}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock: {produit.stock}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {produit.category_produit_details.nom}
                  </Typography>
                  {!produit.image && (
                    <Typography variant="body2" color="text.secondary">
                      No image available
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <IconButton onClick={() => handleEditProduct(produit)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDeleteProduct(produit.id)}><Delete /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductManagement;
