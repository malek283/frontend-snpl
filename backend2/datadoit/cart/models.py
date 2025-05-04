from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import Client
from boutique.models import Produit

class Panier(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='paniers')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Créé le"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Mis à jour le"))

    class Meta:
        verbose_name = _("Panier")
        verbose_name_plural = _("Paniers")
        db_table = 'paniers'

    def __str__(self):
        return f"Panier de {self.client.user.prenom} {self.client.user.nom}"

class LignePanier(models.Model):
    panier = models.ForeignKey(Panier, on_delete=models.CASCADE, related_name='lignes')
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE, related_name='lignes_panier')
    quantite = models.PositiveIntegerField(default=1, verbose_name=_("Quantité"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Créé le"))

    class Meta:
        verbose_name = _("Ligne de Panier")
        verbose_name_plural = _("Lignes de Panier")
        db_table = 'lignes_paniers'

    def __str__(self):
        return f"{self.quantite} x {self.produit.nom} (Panier ID: {self.panier.id})"