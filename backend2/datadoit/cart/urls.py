from django.urls import path
from . import views

urlpatterns = [
    path('panier/', views.panier_view, name='panier'),
    path('panier/add/', views.add_to_cart_view, name='add_to_cart'),
    path('panier/checkout/', views.checkout_view, name='checkout'),
    path('orders/', views.orders_view, name='orders'),
]