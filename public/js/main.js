import { api } from './api.js';
import { renderStats, renderProducts } from './render.js';

const $ = (sel) => document.querySelector(sel);
const els = {
  stats: $('#stats'),
  body: $('#products-body'),
  empty: $('#empty'),
  search: $('#search'),
  dialog: $('#dialog'),
  form: $('#product-form'),
  title: $('#dialog-title'),
  error: $('#form-error'),
  toast: $('#toast'),
};

let products = [];

// ---------- Utilidades ----------
function toast(msg) {
  els.toast.textContent = msg;
  els.toast.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => (els.toast.hidden = true), 2500);
}

async function refresh() {
  const [list, stats] = await Promise.all([api.list(els.search.value), api.stats()]);
  products = list;
  renderProducts(els.body, els.empty, products);
  renderStats(els.stats, stats);
}

function debounce(fn, ms = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

// ---------- Formulario ----------
function openForm(product = null) {
  els.form.reset();
  els.error.hidden = true;
  els.title.textContent = product ? 'Editar producto' : 'Nuevo producto';
  els.form.elements.id.value = product?.id ?? '';
  if (product) {
    for (const key of ['name', 'sku', 'category', 'price', 'stock', 'min_stock']) {
      els.form.elements[key].value = product[key];
    }
  }
  els.dialog.showModal();
}

els.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(els.form));
  const id = data.id;
  delete data.id;

  try {
    if (id) await api.update(id, data);
    else await api.create(data);
    els.dialog.close();
    toast(id ? 'Producto actualizado' : 'Producto creado');
    await refresh();
  } catch (err) {
    els.error.textContent = err.message;
    els.error.hidden = false;
  }
});

// ---------- Eventos ----------
$('#btn-new').addEventListener('click', () => openForm());
$('#btn-cancel').addEventListener('click', () => els.dialog.close());
els.search.addEventListener('input', debounce(refresh));

els.body.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = Number(btn.closest('tr').dataset.id);
  const product = products.find((p) => p.id === id);

  try {
    switch (btn.dataset.action) {
      case 'inc': await api.adjustStock(id, 1); break;
      case 'dec': await api.adjustStock(id, -1); break;
      case 'edit': return openForm(product);
      case 'delete':
        if (!confirm(`¿Eliminar "${product.name}"?`)) return;
        await api.remove(id);
        toast('Producto eliminado');
        break;
    }
    await refresh();
  } catch (err) {
    toast(err.message);
  }
});

refresh();
