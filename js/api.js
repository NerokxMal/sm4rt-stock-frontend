// Configuración base de la API
const API_BASE_URL = 'http://localhost:8080';

// Función genérica para hacer peticiones
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, { ...defaultOptions, ...options });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Si la respuesta es vacía (204 No Content)
        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error en la petición:', error);
        showAlert(error.message, 'error');
        throw error;
    }
}

// ─── PRODUCTOS ───────────────────────────────────────────────────

const productosAPI = {
    obtenerTodos: () => fetchAPI('/productos'),
    obtenerPorId: (id) => fetchAPI(`/productos/${id}`),
    crear: (data) => fetchAPI('/productos', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    actualizar: (id, data) => fetchAPI(`/productos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    eliminar: (id) => fetchAPI(`/productos/${id}`, {
        method: 'DELETE'
    })
};

// ─── CATEGORÍAS ──────────────────────────────────────────────────

const categoriasAPI = {
    obtenerTodas: () => fetchAPI('/categorias'),
    obtenerPorId: (id) => fetchAPI(`/categorias/${id}`),
    crear: (data) => fetchAPI('/categorias', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    actualizar: (id, data) => fetchAPI(`/categorias/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    eliminar: (id) => fetchAPI(`/categorias/${id}`, {
        method: 'DELETE'
    })
};

// ─── UTILIDADES ──────────────────────────────────────────────────

function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    const content = document.getElementById('content');
    content.insertBefore(alert, content.firstChild);

    setTimeout(() => alert.remove(), 3000);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(value);
}