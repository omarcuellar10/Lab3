const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('omar_crud.db');

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para manejar la solicitud GET a la raíz de la aplicación
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));


});




//



// Ruta para obtener un usuario específico por su ID
app.get('/usuarios/:id', (req, res) => {
    const userId = req.params.id;

    db.get('SELECT * FROM usuarios WHERE id = ?', userId, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        res.json(row);
    });
});

// Ruta para actualizar un usuario existente
app.put('/usuarios/:id', (req, res) => {
    const userId = req.params.id;
    const { nombre, email } = req.body;

    if (!nombre || !email) {
        res.status(400).json({ error: 'Nombre y email son requeridos' });
        return;
    }

    db.run('UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?', [nombre, email, userId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        res.json({ message: 'Usuario actualizado', changes: this.changes });
    });
});




//






// Ruta para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    db.all('SELECT * FROM usuarios', (err, rows) => {
        if (err) {
            console.error(err); // Agregar esta línea para imprimir el error en la consola
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Ruta para crear un nuevo usuario
app.post('/usuarios', (req, res) => {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
        res.status(400).json({ error: 'Nombre y email son requeridos' });
        return;
    }

    db.run('INSERT INTO usuarios (nombre, email) VALUES (?, ?)', [nombre, email], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, nombre, email });
    });
});

// Ruta para eliminar un usuario
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM usuarios WHERE id = ?', id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Usuario eliminado', changes: this.changes });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
