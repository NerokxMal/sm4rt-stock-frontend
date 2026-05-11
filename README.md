# 🖥️ sm4rt-stock-frontend

> Frontend SSR del sistema de inventario **sm4rt-stock** (Astro + TypeScript).

![Astro](https://img.shields.io/badge/Astro-6.x-FF5D01?style=flat-square&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

---

## 📋 Descripción

Interfaz de usuario para la API `sm4rt-stock`, con enfoque en operación diaria de inventario:

- login JWT,
- navegación y vistas controladas por permisos,
- dashboard, productos, categorías, histórico y configuración,
- exportaciones CSV/PDF,
- ajustes manuales de stock,
- matriz de permisos para administración,
- búsqueda global desde el header.

---

## 🚀 Stack

| Tecnología | Uso |
|---|---|
| Astro 6 (SSR) | Render del lado servidor |
| TypeScript | Tipado y mantenimiento |
| CSS puro | UI sin framework externo |

---

## ✨ Funcionalidades

- **Autenticación** con `token`, `role` y `permissions` (cookie + localStorage)
- **Sidebar dinámica por permisos** (solo muestra módulos habilitados)
- **Badge de stock crítico** en menú de productos
- **Búsqueda global** (`/buscar?q=...`) agrupada por tipo
- **Productos**
  - crear/editar/eliminar según permisos
  - ajuste manual de stock con motivo
  - historial por producto
  - exportación CSV/PDF
- **Histórico**
  - filtros por fecha/tipo/producto
  - soporte de movimientos `AJUSTE`
  - exportación CSV/PDF
- **Categorías**
  - categorías padre/hijas (jerarquía)
- **Configuración (ADMIN)**
  - tabla de usuarios
  - cambio de rol/estado
  - matriz de permisos con toggles
  - crear usuario
  - cambio de contraseña propia

---

## ⚙️ Instalación

### Prerrequisitos

- Node.js `>=22.12.0`
- Backend `sm4rt-stock` ejecutándose

### 1) Clonar

```bash
git clone https://github.com/NerokxMal/sm4rt-stock-frontend.git
cd sm4rt-stock-frontend
```

### 2) Instalar dependencias

```bash
npm install
```

### 3) Configurar entorno

Crea `.env`:

```env
PUBLIC_API_URL=http://localhost:8080
```

### 4) Ejecutar en desarrollo

```bash
npm run dev
```

Disponible normalmente en `http://localhost:4321`.

---

## 🔐 Flujo de seguridad (frontend)

1. `POST /auth/login` devuelve `token`, `role`, `permissions`.
2. Se guardan en:
   - cookie (para SSR/middleware),
   - localStorage (para fetch en cliente).
3. `middleware.ts` bloquea acceso sin cookie de sesión.
4. El backend sigue siendo la fuente real de autorización (`401/403`).

---

## 📁 Estructura principal

```text
src/
├── layouts/
│   └── Layout.astro        # Sidebar, header, búsqueda global, estilos globales
├── lib/
│   ├── api.ts              # Tipos + helpers API
│   └── session.ts          # Parseo y utilidades de permisos
├── middleware.ts           # Protección de rutas SSR por cookie
└── pages/
    ├── login.astro
    ├── index.astro         # Dashboard
    ├── productos.astro
    ├── categorias.astro
    ├── historico.astro
    └── configuracion.astro
```

---

## 🧞 Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | servidor de desarrollo |
| `npm run build` | build de producción |
| `npm run preview` | previsualizar build |

> Nota: si Astro muestra `NoAdapterInstalled` en build, debes configurar un adapter de despliegue (Node/Vercel/Netlify) según tu target.

---

## 🌐 Backend relacionado

🔗 [sm4rt-stock](https://github.com/NerokxMal/sm4rt-stock) — Spring Boot + JWT + permisos granulares.

---

## 👨‍💻 Autor

**Malcom García**

- LinkedIn: [malcom-nk-garcia](https://www.linkedin.com/in/malcom-nk-garcia)
- GitHub: [NerokxMal](https://github.com/NerokxMal)

---

## 📄 Licencia

MIT
