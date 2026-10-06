# 📦 Inventario Tienda (prototipo)

Sistema de inventario sencillo para una tienda pequeña.
**Node.js + Express + SQLite (integrado en Node)**, con interfaz web en HTML/CSS/JS puro (sin pasos de compilación).

## Requisitos
- [Node.js](https://nodejs.org) 22.13 o superior

## Cómo ejecutarlo
```bash
npm install
npm start
```
Abre http://localhost:3000. La primera vez se crean productos de ejemplo.

Modo desarrollo (reinicia al guardar): `npm run dev`

## Funciones
- Listar, buscar, crear, editar y eliminar productos
- Sumar / restar stock con un clic
- Alerta de **stock bajo** (stock ≤ mínimo)
- Resumen: productos, unidades, stock bajo y valor del inventario

## Estructura
```
inventario-tienda/
├── server.js                  # Punto de entrada: levanta el servidor
├── src/
│   ├── app.js                 # Configura Express (middlewares y rutas)
│   ├── config.js              # Puerto y rutas de archivos
│   ├── routes/                # Qué URL llama a qué controlador
│   ├── controllers/           # Valida la entrada y responde (HTTP)
│   ├── services/              # Lógica de datos y SQL
│   ├── db/                    # Conexión, tablas y datos de ejemplo
│   └── middleware/            # Manejo de errores
├── public/                    # Interfaz web
│   ├── index.html
│   ├── css/styles.css
│   └── js/                    # api.js (servidor) · render.js (HTML) · main.js (eventos)
└── data/                      # Aquí se guarda inventario.db (se crea sola)
```

## API
| Método | Ruta                       | Descripción                |
|--------|----------------------------|----------------------------|
| GET    | `/api/products?q=texto`    | Lista / busca productos    |
| GET    | `/api/products/stats`      | Resumen del inventario     |
| POST   | `/api/products`            | Crea un producto           |
| PUT    | `/api/products/:id`        | Edita un producto          |
| PATCH  | `/api/products/:id/stock`  | Ajusta stock (`{delta: 1}`)|
| DELETE | `/api/products/:id`        | Elimina un producto        |

## Siguientes pasos sugeridos
- Login de usuarios
- Historial de movimientos de stock
- Ventas y reportes
- Exportar a Excel/CSV
