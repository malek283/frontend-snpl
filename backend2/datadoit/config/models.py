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