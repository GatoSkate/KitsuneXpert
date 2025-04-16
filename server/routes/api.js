const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');

// Endpoint para crear preferencia de pago
router.post('/create-preference', async (req, res) => {
    try {
        const { items } = req.body;
        
        const preference = {
            items: items.map(item => ({
                title: item.name,
                unit_price: item.price,
                quantity: item.quantity,
                picture_url: item.image
            })),
            back_urls: {
                success: 'http://tudominio.com/success',
                failure: 'http://tudominio.com/failure',
                pending: 'http://tudominio.com/pending'
            },
            auto_return: 'approved'
        };
        
        const response = await mercadopago.preferences.create(preference);
        res.json({ id: response.body.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear preferencia de pago' });
    }
});

module.exports = router;