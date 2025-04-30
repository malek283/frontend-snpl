from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
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

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom', 'prenom', 'telephone', 'adresse']

    def __str__(self):
        return f"{self.prenom} {self.nom} ({self.email})"
    
    def get_role(self):
        return self.role


class Client(User):
    solde_points = models.IntegerField(default=0,null=True)
    historique_achats = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'clients'  # Match Sequelize tableName

    def __str__(self):
        return f"Client: {self.prenom} {self.nom} ({self.email})"

class Marchand(User):
    is_marchant = models.BooleanField(default=False)

    class Meta:
        db_table = 'marchands'  # Match Sequelize tableName

    def __str__(self):
        return f"Marchand: {self.prenom} {self.nom} ({self.email})"

class Admin(User):
    def __str__(self):
        return f"Admin: {self.prenom} {self.nom} ({self.email})"

    # Fonctionnalités spécifiques à Admin
    def has_full_access(self):
        # Exemple de méthode spécifique au rôle Admin
        return True