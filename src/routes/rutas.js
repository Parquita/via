const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rjfsuxiaoovjyljaarhg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnN1eGlhb292anlsamFhcmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDU1NzksImV4cCI6MjA3MzAyMTU3OX0.NtlbSC92JOLvG76OwggSNsHwYv-1ve9ebB_D4DXW9UE';
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Ruta base
router.get('/', (req, res) => {
  res.send('API VIA - CRUD Usuarios (Supabase)');
});

// ✅ Ruta de bienvenida con logging
router.get('/welcome', (req, res) => {
  const logger = require('../logger');
  logger.info(`Welcome endpoint accessed: ${req.method} ${req.path}`);
  res.json({
    message: 'Welcome to the VIA API Service!',
    timestamp: new Date().toISOString()
  });
});

// ✅ READ - Obtener todos los viajes
router.get('/viajes', async (req, res) => {
  const { data, error } = await supabase
    .from('viajes')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('❌ Error al obtener viajes:', error.message);
    return res.status(500).json({ error: 'Error al obtener los viajes.', details: error.message });
  }

  res.json(data);
});


// ✅ CREATE - Agregar usuario
router.post('/usuarios/add', async (req, res) => {
  const { nombre, correo, contrasena, rol_id, verificacion_antecedentes, estado, contacto_emergencia } = req.body;

  if (!nombre || !correo || !contrasena || !rol_id || !verificacion_antecedentes || !contacto_emergencia) {
    return res.status(400).json({ error: 'Faltan datos obligatorios del usuario.' });
  }

  const { data, error } = await supabase
    .from('usuarios')
    .insert([
      {
        nombre,
        correo,
        contrasena,
        rol_id,
        verificacion_antecedentes,
        estado: estado || 'pending',
        contacto_emergencia
      }
    ])
    .select('id');

  if (error) {
    console.error('❌ Error al insertar usuario:', error.message);
    return res.status(500).json({ error: 'Error al guardar el usuario.', details: error.message });
  }

  res.status(201).json({
    message: '✅ Usuario agregado con éxito.',
    id: data[0].id
  });
});


// ✅ READ - Obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('❌ Error al obtener usuarios:', error.message);
    return res.status(500).json({ error: 'Error al obtener los usuarios.', details: error.message });
  }

  res.json(data);
});


// ✅ UPDATE - Actualizar usuario
router.put('/usuarios/update/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, contrasena, estado } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ error: 'Faltan datos obligatorios (nombre o correo).' });
  }

  const { data, error } = await supabase
    .from('usuarios')
    .update({
      nombre,
      correo,
      contrasena,
      estado: estado || 'pending'
    })
    .eq('id', id)
    .select('*');

  if (error) {
    console.error('❌ Error al actualizar usuario:', error.message);
    return res.status(500).json({ error: 'Error al actualizar el usuario.', details: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  res.json({ message: '✅ Usuario actualizado con éxito.', usuario: data[0] });
});


// ✅ DELETE - Eliminar usuario
router.delete('/usuarios/delete/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id)
    .select('id');

  if (error) {
    console.error('❌ Error al eliminar usuario:', error.message);
    return res.status(500).json({ error: 'Error al eliminar el usuario.', details: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  res.json({ message: '✅ Usuario eliminado con éxito.', id: data[0].id });
});

module.exports = router;
