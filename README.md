# 🖥️ sm4rt-stock-frontend

> Interfaz web para la gestión de inventario de sm4rt-stock, desarrollada en HTML, CSS y JavaScript vanilla.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## 📋 Descripción

**sm4rt-stock-frontend** es la interfaz de usuario del sistema de inventario sm4rt-stock. Consume la API REST del backend para mostrar un dashboard con métricas clave, y permite gestionar productos y categorías mediante una interfaz limpia con sidebar de navegación y modales.

Sin frameworks ni dependencias externas — solo HTML, CSS y JavaScript puro.

---

## ✨ Funcionalidades

- **Dashboard** con métricas en tiempo real: total de productos, valor del inventario, productos con stock bajo y total de categorías
- **CRUD completo de Productos**: crear, ver, editar y eliminar con formulario en modal
- **CRUD completo de Categorías**: misma experiencia que productos
- **Alertas visuales** de éxito/error con desaparición automática
- **Indicador de stock bajo** — resalta en rojo productos con menos de 5 unidades
- **Formato de moneda colombiana** (COP) en precios e inventario total
- **Diseño responsive** para móviles y escritorio

---

## 🗂️ Estructura del proyecto

```
sm4rt-stock-frontend/
├── index.html          # Estructura principal de la app (SPA)
├── style.css           # Estilos globales y variables de diseño
└── js/
    ├── api.js          # Capa de comunicación con el backend (fetch)
    ├── productos.js    # Lógica de vista y CRUD de productos
    ├── categorias.js   # Lógica de vista y CRUD de categorías
    └── main.js         # Navegación, modal, dashboard e inicialización
```

---

## ⚙️ Configuración

### Prerrequisito

El backend de sm4rt-stock debe estar corriendo antes de usar el frontend.

🔗 [sm4rt-stock (backend)](https://github.com/NerokxMal/sm4rt-stock)

### URL de la API

La URL base está definida al inicio de `js/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080';
```

Si el backend corre en otro host o puerto, cambia esta constante.

### Ejecutar el frontend

No requiere instalación ni build. Basta con abrir `index.html` en el navegador, o servirlo con cualquier servidor estático:

```bash
# Con Python
python -m http.server 3000

# Con Node.js (npx)
npx serve .
```

Luego abre `http://localhost:3000` en tu navegador.

---

## 🏗️ Diseño y arquitectura

### Paleta de colores

| Variable | Valor | Uso |
|---|---|---|
| `--primary` | `#D84910` | Color principal, botones, cabeceras de tabla |
| `--primary-light` | `#FF7043` | Hover de botones primarios |
| `--dark` | `#1A1A1A` | Fondo del sidebar, texto principal |
| `--light` | `#F7F4F0` | Fondo general de la app |
| `--gray` | `#9E9E9E` | Texto secundario |
| `--border` | `#E0DDD9` | Bordes de inputs y tablas |

### Flujo de datos

```
Usuario → main.js (navegación) → productos.js / categorias.js (vista)
                                        ↕
                                     api.js (fetch)
                                        ↕
                              Backend REST (localhost:8080)
```

Cada módulo JS tiene responsabilidad única: `api.js` solo hace peticiones HTTP, `productos.js` y `categorias.js` gestionan su sección respectiva, y `main.js` orquesta la navegación y el dashboard.

---

## 📡 Endpoints que consume

Todos los endpoints públicos (GET) no requieren token. Las operaciones de escritura (POST, PUT, DELETE) requieren que el backend tenga JWT configurado y el header `Authorization: Bearer <token>` en cada petición.

> El frontend actual **no implementa login** — está pensado para uso local con el backend sin restricciones de escritura, o como punto de partida para agregar autenticación.

---

## 🖼️ Vistas

### Dashboard
Muestra 4 tarjetas con métricas calculadas desde los datos del backend:
- Total de productos registrados
- Valor total del inventario (precio × stock)
- Productos con stock menor a 5 unidades
- Total de categorías

### Productos
Tabla con todas las columnas (ID, nombre, categoría, precio, stock) y botones de editar/eliminar por fila. El botón "Nuevo" abre un modal con formulario de creación que incluye selector de categorías.

### Categorías
Tabla con ID, nombre y descripción. Modal de creación/edición con los campos correspondientes.

---

## 🔧 Posibles mejoras

- Agregar pantalla de login para obtener y almacenar el JWT
- Búsqueda y filtrado de productos desde la tabla
- Paginación para inventarios grandes
- Exportación a CSV o PDF

---

## 👨‍💻 Autor

**Malcom García**
- LinkedIn: [malcom-nk-garcia](https://www.linkedin.com/in/malcom-nk-garcia)
- GitHub: [NerokxMal](https://github.com/NerokxMal)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
