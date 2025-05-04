from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User

class Badges(models.Model):
    nom = models.CharField(max_length=255, verbose_name=_("Nom"))
    description = models.TextField(blank=True, null=True, verbose_name=_("Description"))
    image = models.ImageField(upload_to='badges_images/', blank=True, null=True, verbose_name=_("Image"))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Créé le"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Mis à jour le"))

    class Meta:
        verbose_name = _("Badge")
        verbose_name_plural = _("Badges")
        db_table = 'badges'

    def __str__(self):
        return self.nom

class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_badges', verbose_name=_("Utilisateur"))
    badge = models.ForeignKey(Badges, on_delete=models.CASCADE, related_name='user_badges', verbose_name=_("Badge"))
    awarded_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Attribué le"))

    class Meta:
        unique_together = ('user', 'badge')
        verbose_name = _("Badge d'utilisateur")
        verbose_name_plural = _("Badges d'utilisateurs")
        db_table = 'user_badges'

    def __str__(self):
        return f"{self.user.prenom} {self.user.nom} - {self.badge.nom}"