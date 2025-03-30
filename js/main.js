// Función para cargar productos desde JSON
async function loadProducts() {
    try {
        const response = await fetch('data/products.json'); // Ruta relativa desde shop.html
        if (!response.ok) throw new Error("Error al cargar productos");
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return []; // Retorna array vacío si hay error
    }
}

// Función global para añadir al carrito (debe coincidir con el onclick en HTML)
window.addToCart = function(productId) {
    // Asegúrate de que `products` está definido (puedes declararlo globalmente)
    const product = products.find(p => p.id === productId);
    if (product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
};

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').textContent = cart.length;
}