const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,
  // INVENTARIO_DB lo define la versión de escritorio; sin ella se usa data/inventario.db
  DB_PATH: process.env.INVENTARIO_DB || path.join(__dirname, '..', 'data', 'inventario.db'),
  PUBLIC_DIR: path.join(__dirname, '..', 'public'),
};
