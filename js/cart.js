let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById('cart-count').textContent = cart.length;
}

// Renderizar carrito en cart.html
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    let total = 0;

    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
            <button onclick="removeFromCart(${index})">🗑️</button>
        `;
        cartItems.appendChild(itemElement);
        total += item.price;
    });

    totalElement.textContent = total.toFixed(2);
}

// Inicializar
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', renderCart);
}