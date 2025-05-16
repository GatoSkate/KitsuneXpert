from django.shortcuts import render
from .models import Producto
from django.shortcuts import redirect, get_object_or_404
from .models import Carrito

def index(request):
    return render(request, 'tienda/index.html')

def productos(request):
    productos = Producto.objects.all()
    return render(request, 'tienda/productos.html', {'productos': productos})

def sucursales(request):
    return render(request, 'tienda/sucursales.html')

def carrito(request):
    if not request.user.is_authenticated:
        return redirect('login')
    
    items = Carrito.objects.filter(usuario=request.user)
    total = sum(item.subtotal() for item in items)
    
    return render(request, 'tienda/carrito.html', {
        'items': items,
        'total': total
    })

def ver_carrito(request):
    if not request.user.is_authenticated:
        return redirect('login')
    
    items = Carrito.objects.filter(usuario=request.user)
    total = sum(item.subtotal() for item in items)
    
    return render(request, 'tienda/carrito.html', {
        'items': items,
        'total': total
    })

def agregar_al_carrito(request, producto_id):
    if not request.user.is_authenticated:
        return redirect('login')  # Redirige si no está logueado
    
    producto = get_object_or_404(Producto, id=producto_id)
    
    # Crea o actualiza el item del carrito
    item, created = Carrito.objects.get_or_create(
        usuario=request.user,
        producto=producto,
        defaults={'cantidad': 1}
    )
    
    if not created:
        item.cantidad += 1
        item.save()
    
    return redirect('productos')  # Redirige de vuelta a productos

def login(request):
    return render(request, 'tienda/login.html')