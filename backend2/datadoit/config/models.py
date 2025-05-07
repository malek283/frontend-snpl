from django.db import models
from django.utils.translation import gettext_lazy as _
from boutique.models import Boutique

class Configurer(models.Model):
    boutique = models.ForeignKey(Boutique, on_delete=models.CASCADE, related_name='configurations', verbose_name=_("Boutique"))
    parametre = models.TextField(verbose_name=_("Paramètre"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Créé le"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Mis à jour le"))

    class Meta:
        verbose_name = _("Configuration")
        verbose_name_plural = _("Configurations")
        db_table = 'configurations'

    def __str__(self):
        return f"Configuration pour {self.boutique.nom}"

class RemiseType(models.Model):
    TYPE_CHOICES = [
        ('tranches', _('Remise par tranches')),
        ('fin_paiement', _('Remise à la fin de paiement')),
    ]
    
    boutique = models.ForeignKey(
        Boutique, 
        on_delete=models.CASCADE, 
        related_name='remise_types', 
        verbose_name=_("Boutique"),
        null=True,  # Temporary to allow migration
        blank=True
    )
    duree_plan_paiement = models.CharField(max_length=100, verbose_name=_("Durée du plan de paiement"),null=True)
    type_remise = models.CharField(max_length=20, choices=TYPE_CHOICES, verbose_name=_("Type de remise"))
    nombre_tranches = models.PositiveIntegerField(null=True, blank=True, verbose_name=_("Nombre de tranches déclencheur"))
    pourcentage_remise = models.DecimalField(max_digits=5, decimal_places=2, verbose_name=_("Pourcentage de remise"))
    montant_max_remise = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name=_("Montant maximal de remise"))
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name=_("Date de création"))

    class Meta:
        verbose_name = _("Type de remise")
        verbose_name_plural = _("Types de remises")
        ordering = ['-date_creation']

    def __str__(self):
        return f"{self.duree_plan_paiement} ({self.get_type_remise_display()})"