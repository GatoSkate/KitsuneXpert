from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', views.index, name='index'),
    path('productos/', views.productos, name='productos'),
    path('sucursales/', views.sucursales, name='sucursales'),  # ¡Añade esta línea!
    path('login/', views.login, name='login'),
     path('carrito/', views.carrito, name='carrito'),  # ¡Esta línea es esencial!
    path('agregar/<int:producto_id>/', views.agregar_al_carrito, name='agregar_carrito'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)