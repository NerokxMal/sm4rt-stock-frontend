let currentEditingId = null;

async function loadProductos() {
    try {
        const productos = await productosAPI.obtenerTodos();
        const categorias = await categoriasAPI.obtenerTodas();

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        productos.forEach(producto => {
            const categoria = producto.categoria ? producto.categoria.nombre : 'Sin categoría';
            const stockClass = producto.stock < 5 ? 'stock-bajo' : 'stock-alto';

            html += `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${categoria}</td>
                    <td>${formatCurrency(producto.precio)}</td>
                    <td class="${stockClass}">${producto.stock}</td>
                    <td class="actions">
                        <button class="btn btn-edit btn-small" onclick="editProducto(${producto.id})">✏️ Editar</button>
                        <button class="btn btn-danger btn-small" onclick="deleteProducto(${producto.id})">🗑️ Eliminar</button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;

        document.getElementById('content').innerHTML = html;
        document.getElementById('add-btn').style.display = 'block';
        document.getElementById('add-btn').onclick = () => showProductoModal(categorias);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

async function showProductoModal(categorias, productoId = null) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('form');

    currentEditingId = productoId;

    let producto = null;
    if (productoId) {
        producto = await productosAPI.obtenerPorId(productoId);
        modalTitle.textContent = 'Editar Producto';
    } else {
        modalTitle.textContent = 'Nuevo Producto';
    }

    const categoriaOptions = categorias.map(cat =>
        `<option value="${cat.id}" ${producto && producto.categoria && producto.categoria.id === cat.id ? 'selected' : ''}>${cat.nombre}</option>`
    ).join('');

    form.innerHTML = `
        <div class="form-group">
            <label>Nombre *</label>
            <input type="text" name="nombre" value="${producto?.nombre || ''}" required>
        </div>
        <div class="form-group">
            <label>Descripción</label>
            <textarea name="descripcion">${producto?.descripcion || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Precio *</label>
            <input type="number" name="precio" step="0.01" value="${producto?.precio || ''}" required>
        </div>
        <div class="form-group">
            <label>Stock *</label>
            <input type="number" name="stock" value="${producto?.stock || ''}" required>
        </div>
        <div class="form-group">
            <label>Categoría</label>
            <select name="categoria_id">
                <option value="">Sin categoría</option>
                ${categoriaOptions}
            </select>
        </div>
        <div class="form-actions">
            <button type="button" class="btn" onclick="closeModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar</button>
        </div>
    `;

    form.onsubmit = async (e) => {
        e.preventDefault();
        await saveProducto(categorias);
    };

    modal.classList.add('show');
}

async function saveProducto(categorias) {
    const form = document.getElementById('form');
    const formData = new FormData(form);

    const data = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        precio: parseFloat(formData.get('precio')),
        stock: parseInt(formData.get('stock')),
        categoria: formData.get('categoria_id') ? { id: parseInt(formData.get('categoria_id')) } : null
    };

    try {
        if (currentEditingId) {
            await productosAPI.actualizar(currentEditingId, data);
            showAlert('Producto actualizado correctamente', 'success');
        } else {
            await productosAPI.crear(data);
            showAlert('Producto creado correctamente', 'success');
        }
        closeModal();
        loadProductos();
    } catch (error) {
        console.error('Error al guardar:', error);
    }
}

async function editProducto(id) {
    const categorias = await categoriasAPI.obtenerTodas();
    showProductoModal(categorias, id);
}

async function deleteProducto(id) {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
        try {
            await productosAPI.eliminar(id);
            showAlert('Producto eliminado correctamente', 'success');
            loadProductos();
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    }
}