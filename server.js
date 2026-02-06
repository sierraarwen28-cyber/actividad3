const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middlewares globales
app.use(bodyParser.json());

// Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { leerArchivo, escribirArchivo } = require('./utils/fileManager');

const RUTA_USUARIOS = './usuarios.json';

//REGISTRO
app.post('/register', async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ mensaje: 'Datos incompletos' });
    }

    const usuarios = await leerArchivo(RUTA_USUARIOS);

    const existe = usuarios.find(u => u.usuario === usuario);
    if (existe) {
        return res.status(400).json({ mensaje: 'Usuario ya existe' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    usuarios.push({ usuario, password: passwordHash });
    await escribirArchivo(RUTA_USUARIOS, usuarios);

    res.status(201).json({ mensaje: 'Usuario registrado' });
});

//LOGIN
app.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    const usuarios = await leerArchivo(RUTA_USUARIOS);
    const user = usuarios.find(u => u.usuario === usuario);

    if (!user) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const valido = await bcrypt.compare(password, user.password);

    if (!valido) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ usuario }, 'clave_secreta', { expiresIn: '1h' });

    res.json({ token });
});

//RUTAS
const autenticarToken = require('./middleware/auth');
const RUTA_TAREAS = './tareas.json';

//TAREAS
app.get('/tareas', autenticarToken, async (req, res) => {
    const tareas = await leerArchivo(RUTA_TAREAS);
    //console.log(tareas);
    res.json(tareas);
});

app.post('/tareas', autenticarToken, async (req, res) => {
    //console.log(req.body);
    const { titulo, descripcion } = req.body;

    if (!titulo || !descripcion) {
        return res.status(400).json({ mensaje: 'Datos incompletos' });
    }

    const tareas = await leerArchivo(RUTA_TAREAS);

    const nuevaTarea = {
    id: Date.now(),
    titulo,
    descripcion
    };

    tareas.push(nuevaTarea);
    await escribirArchivo(RUTA_TAREAS, tareas);

    res.status(201).json(nuevaTarea);
});

    app.put('/tareas/:id', autenticarToken, async (req, res) => {
    const { id } = req.params;
    const tareas = await leerArchivo(RUTA_TAREAS);

    const tarea = tareas.find(t => t.id == id);
    if (!tarea) {
        return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }

    tarea.titulo = req.body.titulo || tarea.titulo;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;

    await escribirArchivo(RUTA_TAREAS, tareas);
    res.json(tarea);
});

app.delete('/tareas/:id', autenticarToken, async (req, res) => {
    const { id } = req.params;
    let tareas = await leerArchivo(RUTA_TAREAS);

    const nuevasTareas = tareas.filter(t => t.id != id);

    if (tareas.length === nuevasTareas.length) {
        return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }

    await escribirArchivo(RUTA_TAREAS, nuevasTareas);
    res.json({ mensaje: 'Tarea eliminada' });
});

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);
