const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,
  DB_PATH: path.join(__dirname, '..', 'data', 'inventario.db'),
  PUBLIC_DIR: path.join(__dirname, '..', 'public'),
};
