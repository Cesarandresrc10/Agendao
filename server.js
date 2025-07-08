const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Página de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Página de registro
app.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'registro.html'));
});

// Procesar formulario
app.post('/registrar', (req, res) => {
  const nuevo = {
    id: Date.now(),
    nombre: req.body.nombre,
    email: req.body.email,
    telefono: req.body.telefono,
    linkPersonalizado: `http://localhost:${PORT}/agendamiento/${Date.now()}`
  };

  const ruta = path.join(__dirname, 'data', 'usuarios.json');
  let usuarios = [];

  if (fs.existsSync(ruta)) {
    const data = fs.readFileSync(ruta, 'utf8');
    usuarios = JSON.parse(data);
  }

  usuarios.push(nuevo);
  fs.writeFileSync(ruta, JSON.stringify(usuarios, null, 2));

  res.send(`
    <h1>¡Registro exitoso!</h1>
    <p>Tu link personalizado es:</p>
    <a href="${nuevo.linkPersonalizado}">${nuevo.linkPersonalizado}</a>
    <br><br><a href="/">Volver al inicio</a>
  `);
});

// Ruta del agendamiento personalizado
app.get('/agendamiento/:id', (req, res) => {
  res.send(`<h1>Formulario de agendamiento para el negocio ID: ${req.params.id}</h1>`);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});