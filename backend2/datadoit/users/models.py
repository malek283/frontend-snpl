from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver
import logging
import uuid


logger = logging.getLogger(__name__)

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        logger.debug(f"Creating user with email={email}, extra_fields={extra_fields}")
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        logger.debug(f"User created: id={user.id}, role={user.role}")
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('client', 'Client'),
        ('marchand', 'Marchand'),
        ('admin', 'Admin'),
    ]

    email = models.EmailField(unique=True)
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)
    telephone = models.CharField(max_length=20)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    adresse = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom', 'prenom', 'telephone']

    def save(self, *args, **kwargs):
        """S'assure que le rôle est correctement sauvegardé"""
        if not self.role:  # Si aucun rôle n'est défini
            self.role = 'client'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.prenom} {self.nom} ({self.email})"

class Client(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='client_profile'
    )
    solde_points = models.IntegerField(default=0, null=True)
    historique_achats = models.TextField(blank=True, default='', null=True)
    referral_code = models.CharField(max_length=10, unique=True, blank=True, null=True)
    nombre_clients_parraines = models.IntegerField(default=0)

    class Meta:
        db_table = 'clients'

    def __str__(self):
        return f"Client: {self.user.prenom} {self.user.nom}"

    def save(self, *args, **kwargs):
        if not self.referral_code:
            # Generate a unique referral code
            code = self.user.prenom.upper()[:5] + str(uuid.uuid4())[:5].upper()
            while Client.objects.filter(referral_code=code).exists():
                code = self.user.prenom.upper()[:5] + str(uuid.uuid4())[:5].upper()
            self.referral_code = code
        super().save(*args, **kwargs)

class Marchand(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='marchand_profile'
    )
    is_marchant = models.BooleanField(default=True)

    class Meta:
        db_table = 'marchands'

    def __str__(self):
        return f"Marchand: {self.user.prenom} {self.user.nom}"

class Admin(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='admin_profile'
    )

    class Meta:
        db_table = 'admins'

    def __str__(self):
        return f"Admin: {self.user.prenom} {self.user.nom}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'client':
            Client.objects.create(user=instance)
            logger.debug(f"Created Client profile for user: {instance.email}")
        elif instance.role == 'marchand':
            Marchand.objects.create(user=instance)
            logger.debug(f"Created Marchand profile for user: {instance.email}")
        elif instance.role == 'admin':
            Admin.objects.create(user=instance)
            logger.debug(f"Created Admin profile for user: {instance.email}")
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'client':
            if not hasattr(instance, 'client_profile'):
                Client.objects.create(user=instance)
                logger.debug(f"Created Client profile for user: {instance.email}")
        elif instance.role == 'marchand':
            if not hasattr(instance, 'marchand_profile'):
                Marchand.objects.create(user=instance)
                logger.debug(f"Created Marchand profile for user: {instance.email}")
        elif instance.role == 'admin':
            if not hasattr(instance, 'admin_profile'):
                Admin.objects.create(user=instance)
                logger.debug(f"Created Admin profile for user: {instance.email}")