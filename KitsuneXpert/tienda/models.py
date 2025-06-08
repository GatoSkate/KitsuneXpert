from django.db import models
from django.contrib.auth.models import User

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to='productos/')  # ¡Requiere Pillow! (pip install pillow)
    stock = models.PositiveIntegerField(default=10)

    def __str__(self):
        return self.nombre
    
class Carrito(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    fecha_agregado = models.DateTimeField(auto_now_add=True)

    def subtotal(self):
        return self.producto.precio * self.cantidad

    def __str__(self):
        return f"{self.cantidad}x {self.producto.nombre} ({self.usuario.username})"


class Sucursal(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200)
    comuna = models.CharField(max_length=50)
    telefono = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)  # Campo modificado para ser opcional
    horario = models.CharField(max_length=100)
    imagen = models.ImageField(upload_to='sucursales/', blank=True, null=True)  # Opcional
    latitud = models.FloatField()
    longitud = models.FloatField()
    imagen = models.ImageField(
        upload_to='sucursales/',
        blank=True,  # Permite que el campo esté vacío en formularios
        null=True,   # Permite NULL en la base de datos
        help_text="Imagen de la sucursal (opcional)"
    )
    
    def __str__(self):
        return f"{self.nombre} - {self.comuna}"