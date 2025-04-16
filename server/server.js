const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mercadopago = require('mercadopago');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Firebase Admin
const serviceAccount = require('./path/to/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Configuración de Mercado Pago
mercadopago.configure({
  access_token: 'TU_ACCESS_TOKEN_DE_MERCADO_PAGO'
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Rutas
app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});