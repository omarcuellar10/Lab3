document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencia al formulario y a la tabla
    const formulario = document.getElementById('addForm');
    const tablaUsuarios = document.getElementById('userList');

//




//





    // Función para cargar los usuarios desde el servidor
    function cargarUsuarios() {



        fetch('http://localhost:3000/usuarios')
            .then(response => response.json())
            .then(data => {
                // Limpiar la tabla antes de agregar los nuevos usuarios
                tablaUsuarios.innerHTML = '';

                // Iterar sobre los usuarios y agregarlos a la tabla
                data.forEach(usuario => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${usuario.id}</td>
                        <td>${usuario.nombre}</td>
                        <td>${usuario.email}</td>
                        <td><button onclick="eliminarUsuario(${usuario.id})">Eliminar</button></td>
                        <td><a class="a-as-btn" href="editarUsuario.html?idUsuario=${usuario.id}">Editar</a></td>
                    `;
                    tablaUsuarios.appendChild(row);
                });
            })
            .catch(error => console.error('Error al cargar usuarios:', error));
    }






    // Función para agregar un nuevo usuario
    formulario.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe

        // Obtener los datos del formulario
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
	
        // Enviar los datos al servidor para agregar el usuario
        fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email })
        })
        .then(response => response.json())
        .then(data => {
            // Llamar a la función para cargar los usuarios nuevamente después de agregar uno nuevo
            cargarUsuarios();
            // Limpiar los campos del formulario
            document.getElementById('nombre').value = '';
            document.getElementById('email').value = '';
        })
        .catch(error => console.error('Error al agregar usuario:', error));
    });

    // Función para eliminar un usuario
    window.eliminarUsuario = function(id) {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            fetch(`http://localhost:3000/usuarios/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                // Llamar a la función para cargar los usuarios nuevamente después de eliminar uno
                cargarUsuarios();
            })
            .catch(error => console.error('Error al eliminar usuario:', error));
        }
    };

    // Cargar los usuarios al cargar la página
    cargarUsuarios();
});
