document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('idUsuario');

    fetch(`http://localhost:3000/usuarios/${id}`)
        .then(response => response.json())
        .then(usuario => {
            document.getElementById('editId').value = usuario.id;
            document.getElementById('editNombre').value = usuario.nombre;
            document.getElementById('editEmail').value = usuario.email;
        })
        .catch(error => console.error('Error al cargar datos del usuario:', error));

    const editForm = document.getElementById('editForm');

    editForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const id = document.getElementById('editId').value;
        const nombre = document.getElementById('editNombre').value;
        const email = document.getElementById('editEmail').value;

        fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email })
        })
        .then(response => response.json())
        .then(data => {
            window.location.href = 'index.html'; // Redirigir a la página principal después de editar
        })
        .catch(error => console.error('Error al editar usuario:', error));
    });
});