"""
URL configuration for datadoit project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from os import stat
from django.urls import include, path
from django.contrib import admin

from datadoit import settings
from django.conf.urls.static import static



urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('boutique/', include('boutique.urls')),
    path('cart/', include('cart.urls')),
    path('chat/', include('chat.urls')),
    path('rewards/', include('rewards.urls')),
    path('config/', include('config.urls')),
     ]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)