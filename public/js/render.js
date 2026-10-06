// Funciones que solo dibujan HTML a partir de datos.
const money = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const svg = (path) =>
  `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const ICONS = {
  box: svg('<path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3.3 7.5L12 12.5l8.7-5M12 22V12.5"/>'),
  layers: svg('<path d="M12 2l10 5-10 5L2 7l10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>'),
  alert: svg('<path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/>'),
  coins: svg('<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/>'),
};

// Color estable por categoría (para el avatar del producto)
const PALETTE = ['#5b4ee8', '#0ea5a4', '#e0662f', '#d6336c', '#2f9e44', '#1c7ed6', '#9c36b5', '#c58a00'];
function colorFor(text) {
  let h = 0;
  for (const ch of String(text)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function renderStats(el, s) {
  el.innerHTML = `
    <div class="stat"><div class="stat-icon">${ICONS.box}</div><div><span>Productos</span><strong>${s.products}</strong></div></div>
    <div class="stat ok"><div class="stat-icon">${ICONS.layers}</div><div><span>Unidades en stock</span><strong>${s.units}</strong></div></div>
    <div class="stat ${s.low_stock ? 'alert' : 'warn'}"><div class="stat-icon">${ICONS.alert}</div><div><span>Stock bajo</span><strong>${s.low_stock}</strong></div></div>
    <div class="stat"><div class="stat-icon">${ICONS.coins}</div><div><span>Valor del inventario</span><strong>${money.format(s.inventory_value)}</strong></div></div>
  `;
}

export function renderProducts(tbody, emptyEl, products) {
  emptyEl.hidden = products.length > 0;
  tbody.innerHTML = products
    .map((p) => {
      const out = p.stock === 0;
      const low = !out && p.stock <= p.min_stock;
      const state = out ? 'out' : low ? 'low' : '';
      const label = out ? 'Agotado' : `${p.stock} uds`;
      const pct = Math.min(100, Math.round((p.stock / Math.max(p.min_stock * 3, 1)) * 100));
      return `
        <tr data-id="${p.id}">
          <td>
            <div class="product-cell">
              <div class="avatar" style="background:${colorFor(p.category)}">${escapeHtml(p.name.trim().charAt(0).toUpperCase() || '?')}</div>
              <div>
                <span class="product-name">${escapeHtml(p.name)}</span>
                <span class="product-sku">${escapeHtml(p.sku)}</span>
              </div>
            </div>
          </td>
          <td><span class="tag">${escapeHtml(p.category)}</span></td>
          <td class="num">${money.format(p.price)}</td>
          <td class="center">
            <div class="stock-ctrl">
              <button data-action="dec" title="Restar 1" aria-label="Restar 1">−</button>
              <div class="stock-info">
                <span class="badge ${state}">${label}</span>
                <div class="bar ${state}"><i style="width:${out ? 0 : Math.max(pct, 6)}%"></i></div>
              </div>
              <button data-action="inc" title="Sumar 1" aria-label="Sumar 1">+</button>
            </div>
          </td>
          <td class="right">
            <button class="btn btn-sm" data-action="edit">Editar</button>
            <button class="btn btn-sm btn-danger" data-action="delete">Eliminar</button>
          </td>
        </tr>`;
    })
    .join('');
}
