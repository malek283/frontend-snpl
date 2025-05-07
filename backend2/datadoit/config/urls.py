from django.urls import path
from .views import remise_type_list_create, remise_type_detail

urlpatterns = [
    path('admin/remises-types/', remise_type_list_create, name='remise-type-list-create'),
    path('admin/remises-types/<int:pk>/', remise_type_detail, name='remise-type-detail'),
]