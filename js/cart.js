document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const cartCountElement = document.getElementById('cart-count');
    const checkoutForm = document.getElementById('checkout-form');
    
    // Cargar carrito desde localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Renderizar carrito
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío. ¡Explora nuestra tienda!</p>';
        } else {
            cart.forEach((item, index) => {
                subtotal += item.price * item.quantity;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        totalElement.textContent = `$${subtotal.toFixed(2)}`;
    }

    // Actualizar contador del carrito
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }

    // Eventos para modificar cantidades
    document.addEventListener('click', (e) => {
        if (e.target.closest('.quantity-btn')) {
            const btn = e.target.closest('.quantity-btn');
            const index = btn.dataset.index;
            const action = btn.dataset.action;
            
            if (action === 'increase') {
                cart[index].quantity += 1;
            } else if (action === 'decrease' && cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount();
        }

        // Eliminar producto
        if (e.target.closest('.cart-item-remove')) {
            const btn = e.target.closest('.cart-item-remove');
            const index = btn.dataset.index;
            const item = document.querySelector(`.cart-item:nth-child(${parseInt(index) + 1})`);
            
            item.classList.add('removing');
            setTimeout(() => {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateCartCount();
            }, 500);
        }
    });

    // Stripe Checkout (ejemplo)
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            
            if (cart.length === 0) {
                alert('¡Tu carrito está vacío!');
                return;
            }

            // Simulación de pago (reemplaza con tu backend real)
            try {
                alert('Redirigiendo a pasarela de pago... (Simulación)');
                // Limpiar carrito después del pago
                localStorage.removeItem('cart');
                cart = [];
                renderCart();
                updateCartCount();
                window.location.href = 'index.html?payment=success';
            } catch (error) {
                console.error('Error:', error);
                alert('Error al procesar el pago');
            }
        });
    }

    // PayPal (opcional)
    if (window.paypal) {
        paypal.Buttons({
            createOrder: (data, actions) => {
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total.toFixed(2)
                        }
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then(() => {
                    localStorage.removeItem('cart');
                    alert('¡Pago completado con éxito!');
                    window.location.href = 'index.html?payment=success';
                });
            }
        }).render('#paypal-button-container');
    }

    renderCart();
});