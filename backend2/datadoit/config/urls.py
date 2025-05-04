from django.urls import path
from .views import configurer_list_create

urlpatterns = [
    path('configurers/', configurer_list_create, name='configurer-list-create'),
]
