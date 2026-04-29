# 🖥️ sm4rt-stock-frontend

> Interfaz web para la gestión de inventario de sm4rt-stock, desarrollada con Astro y TypeScript.

![Astro](https://img.shields.io/badge/Astro-6.x-FF5D01?style=flat-square&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

---

## 📋 Descripción

**sm4rt-stock-frontend** es la interfaz de usuario del sistema de inventario sm4rt-stock. Construida con Astro en modo SSR, consume la API REST del backend para mostrar un dashboard con métricas clave y gestionar productos y categorías con login protegido por JWT.

Sin frameworks de UI externos — Astro, TypeScript y CSS puro.

---

## 🚀 Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Astro | 6.x | Framework SSR |
| TypeScript | 5.x | Tipado estático |
| CSS Variables | — | Sistema de diseño |
| Space Mono / DM Sans | — | Tipografía (Google Fonts) |

---

## ✨ Funcionalidades

- **Login con JWT** — autenticación con cookie + localStorage, protección de rutas via middleware
- **Dashboard SSR** — métricas calculadas en el servidor (total productos, valor inventario, stock bajo, categorías)
- **CRUD de Productos** — crear, editar y eliminar con modal y formulario dinámico
- **CRUD de Categorías** — misma experiencia que productos
- **Cierre de sesión** — limpia cookie y localStorage, redirige al login
- **Indicador de stock bajo** — resalta en rojo productos con menos de 5 unidades
- **Responsive** — adaptado para móvil y escritorio

---

## 🗂️ Estructura del proyecto

```
sm4rt-stock-frontend/
├── src/
│   ├── layouts/
│   │   └── Layout.astro        # Sidebar, header, estilos globales
│   ├── lib/
│   │   └── api.ts              # Tipos TypeScript + capa de comunicación con el backend
│   ├── middleware.ts            # Protección de rutas via cookie JWT
│   └── pages/
│       ├── index.astro         # Dashboard (100% SSR)
│       ├── login.astro         # Página de login (sin sidebar)
│       ├── productos.astro     # CRUD de productos
│       └── categorias.astro    # CRUD de categorías
├── public/
│   └── favicon.svg
├── .env                        # Variables de entorno (no se sube a git)
├── .env.example
└── astro.config.mjs
```

---

## ⚙️ Instalación y configuración

### Prerrequisito

El backend de sm4rt-stock debe estar corriendo antes de usar el frontend.

🔗 [sm4rt-stock (backend)](https://github.com/NerokxMal/sm4rt-stock)

### 1. Clonar el repositorio

```bash
git clone https://github.com/NerokxMal/sm4rt-stock-frontend.git
cd sm4rt-stock-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env`:

```env
PUBLIC_API_URL=http://localhost:8080
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Disponible en `http://localhost:4321`

---

## 🏗️ Arquitectura

### ¿Por qué Astro en modo SSR?

Astro genera HTML en el servidor por defecto. Para este proyecto:

- El **Dashboard** y las **tablas** se renderizan completamente en el servidor — el navegador recibe HTML listo, sin esperar JavaScript
- Los **modales y formularios** son las únicas partes que necesitan JavaScript en el cliente, gracias al sistema de "islands" de Astro

### Flujo de autenticación

```
Usuario visita cualquier ruta
        ↓
middleware.ts verifica cookie "token"
        ↓
¿Existe cookie? → SÍ → renderiza la página
                → NO → redirect /login
        ↓
Login exitoso → guarda token en:
  · localStorage  (para fetch del cliente)
  · cookie        (para que el middleware lo lea en el servidor)
        ↓
Redirect → Dashboard
```

### Cómo se pasan datos del servidor al cliente

En Astro, el frontmatter (`---`) corre en el servidor. Para que el JavaScript del cliente acceda a esos datos usamos `define:vars`:

```astro
---
const productos = await productosAPI.obtenerTodos();
const productosJSON = JSON.stringify(productos);
---

<script is:inline define:vars={{ productosJSON, apiUrl: import.meta.env.PUBLIC_API_URL }}>
  const productos = JSON.parse(productosJSON);
  // ahora el cliente tiene los datos
</script>
```

---

## 🔐 Seguridad

El middleware verifica la **cookie** `token` en cada request al servidor. Si no existe, redirige a `/login`. La cookie se crea con expiración de 24h (igual que el JWT del backend).

> El frontend **no verifica la firma del JWT** — eso lo hace el backend en cada petición protegida. El middleware solo comprueba que la cookie existe para no exponer páginas a usuarios sin sesión.

---

## 📝 Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PUBLIC_API_URL` | URL base del backend | `http://localhost:8080` |

Las variables con prefijo `PUBLIC_` son accesibles en el cliente vía `import.meta.env`.

---

## 🧞 Comandos

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Build de producción en `./dist/` |
| `npm run preview` | Preview del build local |

---

## 🔧 Mejoras pendientes

- Búsqueda en tiempo real de productos (el backend ya expone `/productos/buscar`)
- Paginación para inventarios grandes
- Toast notifications en lugar de `confirm()` nativo
- Sistema de roles ADMIN / USER
- Despliegue en Vercel / Netlify

---

## 🌐 Backend

🔗 [sm4rt-stock](https://github.com/NerokxMal/sm4rt-stock) — Spring Boot + JWT + MySQL

---

## 👨‍💻 Autor

**Malcom García**
- LinkedIn: [malcom-nk-garcia](https://www.linkedin.com/in/malcom-nk-garcia)
- GitHub: [NerokxMal](https://github.com/NerokxMal)

---

## 📄 Licencia

MIT