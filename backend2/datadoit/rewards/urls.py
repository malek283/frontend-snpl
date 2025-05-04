from django.urls import path
from .views import badges_list_create_view, user_badges_view

urlpatterns = [
    path('allRewards/', badges_list_create_view, name='badges-list-create'),
    path('my-badges/', user_badges_view, name='user-badges'),
]
