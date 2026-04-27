// NAVEGACIÓN
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        // Desactivar todos
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        const page = this.dataset.page;
        document.getElementById('page-title').textContent =
            page === 'dashboard' ? 'Dashboard' :
                page === 'productos' ? 'Productos' :
                    'Categorías';

        if (page === 'dashboard') {
            loadDashboard();
        } else if (page === 'productos') {
            loadProductos();
        } else if (page === 'categorias') {
            loadCategorias();
        }
    });
});

// MODAL
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');

closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

function closeModal() {
    modal.classList.remove('show');
}

// DASHBOARD
async function loadDashboard() {
    try {
        const productos = await productosAPI.obtenerTodos();
        const categorias = await categoriasAPI.obtenerTodas();

        const totalProductos = productos.length;
        const totalValor = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
        const stockBajo = productos.filter(p => p.stock < 5).length;

        const html = `
            <div class="dashboard-grid">
                <div class="card">
                    <h3>Total Productos</h3>
                    <div class="number">${totalProductos}</div>
                </div>
                <div class="card">
                    <h3>Valor Total Inventario</h3>
                    <div class="number">${formatCurrency(totalValor)}</div>
                </div>
                <div class="card">
                    <h3>Stock Bajo</h3>
                    <div class="number" style="color: #C62828;">${stockBajo}</div>
                </div>
                <div class="card">
                    <h3>Total Categorías</h3>
                    <div class="number">${categorias.length}</div>
                </div>
            </div>
        `;

        document.getElementById('content').innerHTML = html;
        document.getElementById('add-btn').style.display = 'none';
    } catch (error) {
        console.error('Error al cargar dashboard:', error);
    }
}

// INICIALIZAR
loadDashboard();