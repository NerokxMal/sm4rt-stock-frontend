let currentEditingCategoriaId = null;

async function loadCategorias() {
    try {
        const categorias = await categoriasAPI.obtenerTodas();

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        categorias.forEach(categoria => {
            html += `
                <tr>
                    <td>${categoria.id}</td>
                    <td>${categoria.nombre}</td>
                    <td>${categoria.descripcion || '-'}</td>
                    <td class="actions">
                        <button class="btn btn-edit btn-small" onclick="editCategoria(${categoria.id})">✏️ Editar</button>
                        <button class="btn btn-danger btn-small" onclick="deleteCategoria(${categoria.id})">🗑️ Eliminar</button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;

        document.getElementById('content').innerHTML = html;
        document.getElementById('add-btn').style.display = 'block';

        // CORRECCIÓN: Usamos una función de flecha para que no se pase el evento 'e' como categoriaId
        document.getElementById('add-btn').onclick = () => showCategoriaModal();

    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

async function showCategoriaModal(categoriaId = null) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('form');

    // Si categoriaId no es un número válido (o es un objeto de evento), lo tratamos como nulo
    if (typeof categoriaId !== 'number') {
        categoriaId = null;
    }

    currentEditingCategoriaId = categoriaId;

    let categoria = null;
    if (categoriaId) {
        categoria = await categoriasAPI.obtenerPorId(categoriaId);
        modalTitle.textContent = 'Editar Categoría';
    } else {
        modalTitle.textContent = 'Nueva Categoría';
    }

    form.innerHTML = `
        <div class="form-group">
            <label>Nombre *</label>
            <input type="text" name="nombre" value="${categoria?.nombre || ''}" required>
        </div>
        <div class="form-group">
            <label>Descripción</label>
            <textarea name="descripcion">${categoria?.descripcion || ''}</textarea>
        </div>
        <div class="form-actions">
            <button type="button" class="btn" onclick="closeModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar</button>
        </div>
    `;

    form.onsubmit = saveCategoria;
    modal.classList.add('show');
}

async function saveCategoria(e) {
    e.preventDefault();
    const form = document.getElementById('form');
    const formData = new FormData(form);

    const data = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion')
    };

    try {
        if (currentEditingCategoriaId) {
            await categoriasAPI.actualizar(currentEditingCategoriaId, data);
            showAlert('Categoría actualizada correctamente', 'success');
        } else {
            await categoriasAPI.crear(data);
            showAlert('Categoría creada correctamente', 'success');
        }
        closeModal();
        loadCategorias();
    } catch (error) {
        console.error('Error al guardar:', error);
    }
}

async function editCategoria(id) {
    showCategoriaModal(id);
}

async function deleteCategoria(id) {
    if (confirm('¿Seguro que deseas eliminar esta categoría?')) {
        try {
            await categoriasAPI.eliminar(id);
            showAlert('Categoría eliminada correctamente', 'success');
            loadCategorias();
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    }
}