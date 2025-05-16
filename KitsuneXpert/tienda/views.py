from django.contrib.auth.forms import UserCreationForm  # Añade esta línea en la parte superior
from django.shortcuts import render
from .models import Producto
from django.shortcuts import redirect, get_object_or_404
from .models import Carrito
from django.http import JsonResponse
from django.contrib.auth import login
from .forms import CustomUserCreationForm 
from django.contrib.auth import login
from django.shortcuts import render, redirect

from django.contrib.auth import login as auth_login  # Renombramos para evitar conflicto
from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm

def registro(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            
            # Opcional: Enviar email de bienvenida
            # enviar_email_bienvenida(user)
            
            auth_login(request, user)  # Usamos el nombre renombrado
            return redirect('index')  # Cambia 'index' por tu URL de inicio
    else:
        form = CustomUserCreationForm()
    
    return render(request, 'tienda/registro.html', {'form': form})

def index(request):
    return render(request, 'tienda/index.html')

def productos(request):
    productos = Producto.objects.all()
    return render(request, 'tienda/productos.html', {'productos': productos})

def sucursales(request):
    return render(request, 'tienda/sucursales.html')

def finalizar_compra(request):
    if not request.user.is_authenticated:
        return redirect('login')
    
    # Obtener items del carrito
    items_carrito = Carrito.objects.filter(usuario=request.user)
    
    # Crear pedido (simulado)
    if items_carrito.exists():
        total = sum(item.subtotal() for item in items_carrito)
        
        # Aquí podrías crear un registro en tu modelo Pedido si lo tienes
        # Pedido.objects.create(usuario=request.user, total=total)
        
        # Vaciar carrito
        items_carrito.delete()
        
        # Redirigir a página de éxito
        return render(request, 'tienda/compra_exitosa.html')
    
    return redirect('carrito')

def aumentar_cantidad(request, item_id):
    item = get_object_or_404(Carrito, id=item_id, usuario=request.user)
    item.cantidad += 1
    item.save()
    return redirect('carrito')

def reducir_cantidad(request, item_id):
    item = get_object_or_404(Carrito, id=item_id, usuario=request.user)
    if item.cantidad > 1:
        item.cantidad -= 1
        item.save()
    else:
        item.delete()  # Elimina si la cantidad llega a 0
    return redirect('carrito')

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