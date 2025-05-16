from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth import views as auth_views
from .forms import CustomUserCreationForm

urlpatterns = [
    path('', views.index, name='index'),
    path('productos/', views.productos, name='productos'),
    path('sucursales/', views.sucursales, name='sucursales'),  # ¡Añade esta línea!
    path('login/', views.login, name='login'),
    path('carrito/aumentar/<int:item_id>/', views.aumentar_cantidad, name='aumentar_cantidad'),
    path('carrito/reducir/<int:item_id>/', views.reducir_cantidad, name='reducir_cantidad'),
    path('carrito/', views.carrito, name='carrito'),  # ¡Esta línea es esencial!
    path('agregar/<int:producto_id>/', views.agregar_al_carrito, name='agregar_carrito'),
    path('finalizar-compra/', views.finalizar_compra, name='finalizar_compra'),
    path('registro/', views.registro, name='registro'),
    path('login/', auth_views.LoginView.as_view(
        template_name='tienda/login.html',
        extra_context={'titulo': 'Iniciar Sesión'}
    ), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)