// Manejo del carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCart() {
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    
    cartItemsEl.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p>Tu carrito está vacío</p>';
        cartTotalEl.textContent = '$0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h3>${item.name}</h3>
                <p>$${item.price}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button onclick="removeFromCart(${item.id})">Eliminar</button>
            </div>
        `;
        cartItemsEl.appendChild(itemEl);
        total += item.price * item.quantity;
    });
    
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        saveCart();
        renderCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Integración con Mercado Pago
document.getElementById('checkout-btn').addEventListener('click', async function() {
    if (cart.length === 0) return;
    
    try {
        const response = await fetch('/api/create-preference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items: cart })
        });
        
        const { id } = await response.json();
        
        // Redirigir a Mercado Pago
        window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference-id=${id}`;
    } catch (error) {
        console.error('Error al procesar el pago:', error);
    }
});

// Inicializar carrito al cargar la página
document.addEventListener('DOMContentLoaded', renderCart);