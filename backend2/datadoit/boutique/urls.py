from django.urls import path
from . import views

urlpatterns = [
    # Boutique URLs
    path('boutiquechat/', views.boutique_list_createchat, name='boutique-list-create'),
    path('boutiques/', views.boutique_list_create, name='boutique-list-create'),
    path('boutiques/<int:pk>/', views.boutique_retrieve_update_destroy, name='boutique-retrieve-update-destroy'),
    path('boutiques/<int:boutique_id>/', views.boutique_detail, name='boutique-detail'),
    path('boutiquesall/', views.all_boutiques, name='all_boutiques'),
    path('boutiques/<int:boutique_id>/details/', views.boutique_detail_public, name='boutique-detail-public'),
    path('boutiques/<int:boutique_id>/categories/<int:category_id>/produits/', views.boutique_produits_by_category, name='boutique-produits-by-category'),
    path('boutique/<int:pk>/approve/', views.approve_boutique, name='approve_boutique'),
    path('boutique/<int:pk>/reject/', views.reject_boutique, name='reject_boutique'),
    path('boutique/<int:pk>/delete/', views.delete_boutique, name='delete_boutique'),
    
    # CategoryBoutique URLs
    path('category_boutiques/', views.category_boutique_list_create, name='category_boutique-list-create'),
    path('category_boutiques/<int:pk>/', views.category_boutique_detail, name='category_boutique-detail'),
    path('category_boutiques/<int:pk>/boutiques/', views.boutiques_by_category, name='boutiques-by-category'),
    
    # CategoryProduit URLs
    path('category-produits/', views.category_produit_list_create, name='category_produit-list-create'),
    path('category-produits/<int:pk>/', views.category_produit_retrieve_update_destroy, name='category_produit-detail'),
    
    # Produit URLs
    path('produits/', views.produit_list_create, name='produit-list-create'),
    path('produits/<int:pk>/', views.produit_detail, name='produit-detail'),

    path('boutiques/all/', views.list_boutiques, name='list_boutiques'),
]