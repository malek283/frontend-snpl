# boutique/models.py
from django.db import models
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _

# Catégorie de Boutique
class CategoryBoutique(models.Model):
    nom = models.CharField(max_length=255, verbose_name=_("Nom"))
    image = models.ImageField(upload_to='category_boutique_images/', blank=True, null=True, verbose_name=_("Image"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Catégorie de Boutique")
        verbose_name_plural = _("Catégories de Boutiques")
        db_table = 'categories_boutiques'

    def __str__(self):
        return self.nom

# Boutique
class Boutique(models.Model):
    nom = models.CharField(max_length=255, verbose_name=_("Nom"))
    description = models.TextField(blank=True, null=True, verbose_name=_("Description"))
    logo = models.ImageField(upload_to='boutique_logos/', blank=True, null=True, verbose_name=_("Logo"))
    adresse = models.CharField(max_length=255, blank=True, null=True, verbose_name=_("Adresse"))
    telephone = models.CharField(max_length=255, blank=True, null=True, verbose_name=_("Téléphone"))
    email = models.EmailField(blank=True, null=True, validators=[validate_email], verbose_name=_("Email"))
    image = models.ImageField(upload_to='boutique_images/', blank=True, null=True, verbose_name=_("Image"))
    category_boutique = models.ForeignKey(
        CategoryBoutique,
        null=True,
        on_delete=models.CASCADE,
        related_name='boutiques',
        verbose_name=_("Catégorie Boutique")
    )
    marchand = models.ForeignKey(
        'users.Marchand',
        on_delete=models.CASCADE,
        related_name='boutiques',
        verbose_name=_("Marchand")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Boutique")
        verbose_name_plural = _("Boutiques")
        db_table = 'boutiques'

    def __str__(self):
        return self.nom

# Catégorie de Produit
class CategoryProduit(models.Model):
    nom = models.CharField(max_length=255, verbose_name=_("Nom"))
    image = models.ImageField(upload_to='category_produit_images/', blank=True, null=True, verbose_name=_("Image"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    boutique = models.ForeignKey(
        Boutique,
        null=True,
        on_delete=models.CASCADE,
        related_name='categories_produits',  # Changed to avoid clash
        verbose_name=_("Boutique")
    )

    class Meta:
        verbose_name = _("Catégorie de Produit")
        verbose_name_plural = _("Catégories de Produits")
        db_table = 'categories_produits'

    def __str__(self):
        return self.nom

# Produit
class Produit(models.Model):
    nom = models.CharField(max_length=255, verbose_name=_("Nom"))
    description = models.TextField(blank=True, null=True, verbose_name=_("Description"))
    prix = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_("Prix"))
    stock = models.PositiveIntegerField(default=0, verbose_name=_("Stock"))
    image = models.ImageField(upload_to='produit_images/', blank=True, null=True, verbose_name=_("Image"))
    couleur = models.CharField(max_length=50, blank=True, null=True, verbose_name=_("Couleur"))
    taille = models.CharField(max_length=50, blank=True, null=True, verbose_name=_("Taille"))
    category_produit = models.ForeignKey(
        CategoryProduit,
        null=True,
        on_delete=models.CASCADE,
        related_name='produits',
        verbose_name=_("Catégorie Produit")
    )
    boutique = models.ForeignKey(
        Boutique,
        null=True,
        on_delete=models.CASCADE,
        related_name='produits',  # Kept as is
        verbose_name=_("Boutique")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Produit")
        verbose_name_plural = _("Produits")
        db_table = 'produits'

    def __str__(self):
        return self.nom