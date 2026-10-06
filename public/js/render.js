// Funciones que solo dibujan HTML a partir de datos.
const money = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function renderStats(el, s) {
  el.innerHTML = `
    <div class="stat"><span>Productos</span><strong>${s.products}</strong></div>
    <div class="stat"><span>Unidades en stock</span><strong>${s.units}</strong></div>
    <div class="stat ${s.low_stock ? 'alert' : ''}"><span>Stock bajo</span><strong>${s.low_stock}</strong></div>
    <div class="stat"><span>Valor del inventario</span><strong>${money.format(s.inventory_value)}</strong></div>
  `;
}

export function renderProducts(tbody, emptyEl, products) {
  emptyEl.hidden = products.length > 0;
  tbody.innerHTML = products
    .map((p) => {
      const low = p.stock <= p.min_stock;
      return `
        <tr data-id="${p.id}">
          <td>${escapeHtml(p.name)}<small>${escapeHtml(p.sku)}</small></td>
          <td>${escapeHtml(p.category)}</td>
          <td class="num">${money.format(p.price)}</td>
          <td class="center">
            <div class="stock-ctrl">
              <button data-action="dec" title="Restar 1">−</button>
              <span class="badge ${low ? 'low' : ''}">${p.stock}</span>
              <button data-action="inc" title="Sumar 1">+</button>
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
