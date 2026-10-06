function createSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL,
      sku        TEXT    NOT NULL UNIQUE,
      category   TEXT    NOT NULL DEFAULT 'General',
      price      REAL    NOT NULL CHECK (price >= 0),
      stock      INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
      min_stock  INTEGER NOT NULL DEFAULT 5 CHECK (min_stock >= 0),
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

// Datos de ejemplo para ver algo al abrir el prototipo por primera vez
function seedIfEmpty(db) {
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM products').get();
  if (total > 0) return;

  const insert = db.prepare(
    'INSERT INTO products (name, sku, category, price, stock, min_stock) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const demo = [
    ['Arroz 1kg', 'ARR-001', 'Abarrotes', 4.5, 40, 10],
    ['Aceite 1L', 'ACE-001', 'Abarrotes', 9.9, 12, 8],
    ['Leche entera 1L', 'LEC-001', 'Lácteos', 4.2, 3, 10],
    ['Galletas de soda', 'GAL-001', 'Snacks', 1.8, 60, 20],
    ['Gaseosa 500ml', 'GAS-001', 'Bebidas', 2.5, 7, 15],
    ['Detergente 500g', 'DET-001', 'Limpieza', 6.8, 18, 6],
  ];
  db.exec('BEGIN');
  try {
    demo.forEach((row) => insert.run(...row));
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

module.exports = { createSchema, seedIfEmpty };
