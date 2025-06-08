from django.contrib import admin
from .models import Producto
from .models import Sucursal

# Opción 1: Registro básico (elimina esto si usas la Opción 2)
# admin.site.register(Producto)

# Opción 2: Registro personalizado (recomendado)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'stock')
    search_fields = ('nombre',)

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'date_joined', 'is_staff')
    list_filter = ('is_staff', 'is_superuser')
    search_fields = ('username', 'email')
    

admin.site.register(Producto, ProductoAdmin)  # Solo esta línea debe estar activa

@admin.register(Sucursal)
class SucursalAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'comuna', 'telefono', 'horario')
    list_filter = ('comuna',)
    search_fields = ('nombre', 'direccion', 'comuna')
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'comuna')
        }),
        ('Contacto', {
            'fields': ('direccion', 'telefono', 'horario')
        }),
        ('Coordenadas (Google Maps)', {
            'fields': ('latitud', 'longitud'),
            'description': '<p>Obtener coordenadas desde <a href="https://www.google.com/maps" target="_blank">Google Maps</a></p>'
        }),
    )