// Capa de acceso a datos: aquí vive todo el SQL.
const db = require('../db/database');

function list(search = '') {
  const term = `%${String(search).trim()}%`;
  return db
    .prepare(
      `SELECT * FROM products
       WHERE name LIKE @term OR sku LIKE @term OR category LIKE @term
       ORDER BY name COLLATE NOCASE`
    )
    .all({ term });
}

function get(id) {
  return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
}

function create({ name, sku, category, price, stock, min_stock }) {
  const info = db
    .prepare(
      `INSERT INTO products (name, sku, category, price, stock, min_stock)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(name, sku, category, price, stock, min_stock);
  return get(Number(info.lastInsertRowid));
}

function update(id, { name, sku, category, price, stock, min_stock }) {
  db.prepare(
    `UPDATE products
     SET name = ?, sku = ?, category = ?, price = ?, stock = ?, min_stock = ?
     WHERE id = ?`
  ).run(name, sku, category, price, stock, min_stock, id);
  return get(id);
}

function adjustStock(id, delta) {
  db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(delta, id);
  return get(id);
}

function remove(id) {
  return db.prepare('DELETE FROM products WHERE id = ?').run(id).changes > 0;
}

function stats() {
  return db
    .prepare(
      `SELECT
         COUNT(*)                             AS products,
         COALESCE(SUM(stock), 0)              AS units,
         COALESCE(SUM(stock <= min_stock), 0) AS low_stock,
         COALESCE(SUM(stock * price), 0)      AS inventory_value
       FROM products`
    )
    .get();
}

module.exports = { list, get, create, update, adjustStock, remove, stats };
