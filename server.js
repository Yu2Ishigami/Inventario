const app = require('./src/app');
const { PORT } = require('./src/config');

app.listen(PORT, () => {
  console.log(`Inventario listo en http://localhost:${PORT}`);
});
