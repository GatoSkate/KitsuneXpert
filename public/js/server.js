const express = require('express');
const stripe = require('stripe')('sk_test_51R8DeWFZo61QJdZ2...'); // Usa tu clave SECRETA
const app = express();
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
    const { cart, email } = req.body;
    
    const lineItems = cart.map(item => ({
        price_data: {
            currency: 'clp', // Moneda chilena
            product_data: { name: item.name },
            unit_amount: item.price, // Precio en CLP (ej: 10000 = $10.000)
        },
        quantity: item.quantity || 1, // Asegura la cantidad
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: 'https://tudominio.com/success', // Cambia a tu URL real
        cancel_url: 'https://tudominio.com/cart', // Cambia a tu URL real
        customer_email: email,
    });

    res.json({ id: session.id });
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));