import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore();
async function cargarProductos() {
    const querySnapshot = await getDocs(collection(db, "productos"));
    // Resto del código...
}
try {
    const response = await fetch('/data/products.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const products = await response.json();
    console.log("Productos cargados:", products); // Verifica en consola
} catch (error) {
    console.error("Error detallado:", error); // Muestra el error real
}
function addToCart(productId, productName, productPrice, productImage) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => item.id === productId);
    
    if (existingProductIndex !== -1) {
        // Si el producto ya existe, incrementar la cantidad
        cart[existingProductIndex].quantity += 1;
    } else {
        // Si es un producto nuevo, añadirlo al carrito
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAddToCartNotification(productName);
}

// Actualizar el contador del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Mostrar notificación al añadir producto
function showAddToCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'add-to-cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${productName} añadido al carrito</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        notification.addEventListener('animationend', () => {
            notification.remove();
        });
    }, 2000);
}

// Cargar y mostrar productos desde el JSON
document.addEventListener('DOMContentLoaded', async () => {
    try {
        
        const response = await fetch('/data/products.json');
        if (!response.ok) throw new Error('Error al cargar productos');
        
        const products = await response.json();
        const productGrid = document.getElementById('product-grid');
        
        // Limpiar el grid antes de agregar productos
        productGrid.innerHTML = '';
        
        // Verificar si hay productos
        if (products.length === 0) {
            productGrid.innerHTML = '<p class="no-products">No hay productos disponibles en este momento.</p>';
            return;
        }
        
        // Crear tarjetas para cada producto
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" 
                        onclick="addToCart(${product.id}, '${escapeHtml(product.name)}', ${product.price}, '${product.image}')">
                        <i class="fas fa-cart-plus"></i> Añadir al carrito
                    </button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
        
        // Actualizar contador del carrito
        updateCartCount();
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('product-grid').innerHTML = `
            <p class="error-loading">Error al cargar los productos. Por favor, intenta nuevamente más tarde.</p>
        `;
    }
});

// Función auxiliar para escapar HTML (evitar inyección)
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}