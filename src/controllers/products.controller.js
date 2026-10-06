// Capa HTTP: valida la entrada y responde. No contiene SQL.
const service = require('../services/products.service');
const { HttpError } = require('../middleware/errors');

function parseId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'ID inválido');
  return id;
}

function validateProduct(body) {
  const name = String(body.name ?? '').trim();
  const sku = String(body.sku ?? '').trim().toUpperCase();
  const category = String(body.category ?? '').trim() || 'General';
  const price = Number(body.price);
  const stock = Number(body.stock ?? 0);
  const min_stock = Number(body.min_stock ?? 5);

  if (!name) throw new HttpError(400, 'El nombre es obligatorio');
  if (!sku) throw new HttpError(400, 'El SKU es obligatorio');
  if (!Number.isFinite(price) || price < 0) throw new HttpError(400, 'Precio inválido');
  if (!Number.isInteger(stock) || stock < 0) throw new HttpError(400, 'Stock inválido');
  if (!Number.isInteger(min_stock) || min_stock < 0) throw new HttpError(400, 'Stock mínimo inválido');

  return { name, sku, category, price, stock, min_stock };
}

// Convierte el error de SKU duplicado de SQLite en un mensaje claro
function handleUnique(err) {
  if (String(err.message).includes('UNIQUE constraint failed')) {
    throw new HttpError(409, 'Ya existe un producto con ese SKU');
  }
  throw err;
}

function list(req, res) {
  res.json(service.list(req.query.q));
}

function stats(req, res) {
  res.json(service.stats());
}

function create(req, res) {
  const data = validateProduct(req.body);
  try {
    res.status(201).json(service.create(data));
  } catch (err) {
    handleUnique(err);
  }
}

function update(req, res) {
  const id = parseId(req);
  if (!service.get(id)) throw new HttpError(404, 'Producto no encontrado');
  const data = validateProduct(req.body);
  try {
    res.json(service.update(id, data));
  } catch (err) {
    handleUnique(err);
  }
}

function adjustStock(req, res) {
  const id = parseId(req);
  const product = service.get(id);
  if (!product) throw new HttpError(404, 'Producto no encontrado');

  const delta = Number(req.body.delta);
  if (!Number.isInteger(delta) || delta === 0) throw new HttpError(400, 'Cantidad inválida');
  if (product.stock + delta < 0) throw new HttpError(400, 'El stock no puede quedar negativo');

  res.json(service.adjustStock(id, delta));
}

function remove(req, res) {
  const id = parseId(req);
  if (!service.remove(id)) throw new HttpError(404, 'Producto no encontrado');
  res.status(204).end();
}

module.exports = { list, stats, create, update, adjustStock, remove };
