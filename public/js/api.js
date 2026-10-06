// Todas las llamadas al servidor viven aquí.
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error de servidor');
  return data;
}

export const api = {
  list: (q = '') => request(`/api/products?q=${encodeURIComponent(q)}`),
  stats: () => request('/api/products/stats'),
  create: (p) => request('/api/products', { method: 'POST', body: JSON.stringify(p) }),
  update: (id, p) => request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  adjustStock: (id, delta) =>
    request(`/api/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ delta }) }),
  remove: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),
};
