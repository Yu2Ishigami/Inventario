const express = require('express');
const { PUBLIC_DIR } = require('./config');
const productsRoutes = require('./routes/products.routes');
const { notFound, errorHandler } = require('./middleware/errors');

const app = express();

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

app.use('/api/products', productsRoutes);
app.use('/api', notFound);
app.use(errorHandler);

module.exports = app;
