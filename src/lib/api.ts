// ─── TIPOS ────────────────────────────────────────────────────────
// TypeScript nos permite definir la "forma" de los objetos que
// devuelve el backend. Si el backend cambia algo, TypeScript
// nos avisará con un error en lugar de fallar silenciosamente.
// Esto es una de las grandes ventajas de TypeScript sobre JavaScript puro.

export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string | null; // | null significa que puede ser null
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: number;
    stock: number;
    categoria: Categoria | null; // Un producto puede no tener categoría
}

// ─── CONFIGURACIÓN ────────────────────────────────────────────────
// En Astro las variables de entorno públicas empiezan con PUBLIC_
// para distinguirlas de las secretas (que solo vive en el servidor).
// Por ahora usamos un valor por defecto para desarrollo local.
const API_BASE_URL = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8080';

// ─── FUNCIÓN BASE ─────────────────────────────────────────────────
// Igual que tu api.js original, pero con tipos TypeScript.
// El genérico <T> significa "esta función devuelve lo que le digas".
// Por ejemplo: fetchAPI<Producto[]>('/productos') devuelve Producto[]
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options, // Spread: mezcla las opciones por defecto con las que recibimos
    });

    if (!response.ok) {
        // Intentamos leer el mensaje de error del backend
        const error = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(error.error ?? `Error ${response.status}`);
    }

    if (response.status === 204) return null as T; // 204 = sin contenido (DELETE)

    return response.json();
}

// ─── PRODUCTOS ────────────────────────────────────────────────────
export const productosAPI = {
    obtenerTodos: () =>
        fetchAPI<Producto[]>('/productos'),

    obtenerPorId: (id: number) =>
        fetchAPI<Producto>(`/productos/${id}`),

    crear: (data: Omit<Producto, 'id'>, token: string) =>
        // Omit<Producto, 'id'> = Producto sin el campo id (el backend lo genera)
        fetchAPI<Producto>('/productos', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // JWT para endpoints protegidos
            },
        }),

    actualizar: (id: number, data: Omit<Producto, 'id'>, token: string) =>
        fetchAPI<Producto>(`/productos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }),

    eliminar: (id: number, token: string) =>
        fetchAPI<null>(`/productos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }),
};

// ─── CATEGORÍAS ───────────────────────────────────────────────────
export const categoriasAPI = {
    obtenerTodas: () =>
        fetchAPI<Categoria[]>('/categorias'),

    obtenerPorId: (id: number) =>
        fetchAPI<Categoria>(`/categorias/${id}`),

    crear: (data: Omit<Categoria, 'id'>, token: string) =>
        fetchAPI<Categoria>('/categorias', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }),

    actualizar: (id: number, data: Omit<Categoria, 'id'>, token: string) =>
        fetchAPI<Categoria>(`/categorias/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }),

    eliminar: (id: number, token: string) =>
        fetchAPI<null>(`/categorias/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }),
};

// ─── AUTH ─────────────────────────────────────────────────────────
export const authAPI = {
    login: (username: string, password: string) =>
        fetchAPI<{ token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        }),

    register: (username: string, password: string) =>
        fetchAPI<{ token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        }),
};