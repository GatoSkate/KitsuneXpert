from django.contrib import admin
from .models import Producto

# Opción 1: Registro básico (elimina esto si usas la Opción 2)
# admin.site.register(Producto)

# Opción 2: Registro personalizado (recomendado)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'stock')
    search_fields = ('nombre',)

admin.site.register(Producto, ProductoAdmin)  # Solo esta línea debe estar activa