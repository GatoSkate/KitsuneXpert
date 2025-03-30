const express = require('express');
const stripe = require('stripe')('pk_test_51R8DeWFZo61QJdZ2jkL7ze6LDkPrx9UUdCzR1IM9ZfEJ3gB1WrUisbqjHyhB9oT7y9h4XZqU3ZnQe09hFxyy7Ee500Azp5x16d');

const app = express();
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
    const { cart, email } = req.body;
    
    const lineItems = cart.map(item => ({
        price_data: {
            currency: 'usd',
            product_data: { name: item.name },
            unit_amount: Math.round(item.price * 100), // Stripe usa centavos
        },
        quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: 'https://tudominio.com/success',
        cancel_url: 'https://tudominio.com/cart',
        customer_email: email,
    });

    res.json({ id: session.id });
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));