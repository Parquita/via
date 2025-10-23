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

// ✅ Ruta de health check para verificar estado del servidor
router.get('/health', async (req, res) => {
  try {
    // Verificar conexión a Supabase
    const { data, error } = await supabase
      .from('usuarios')
      .select('id')
      .limit(1);

    if (error) {
      throw new Error('Database connection failed');
    }

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        server: 'running'
      }
    });
  } catch (err) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: err.message,
      services: {
        database: 'disconnected',
        server: 'running'
      }
    });
  }
});

// ✅ GET - Métricas del conductor
router.get('/conductor/:id/metrics', async (req, res) => {
  const { id } = req.params;

  try {
    const { data: viajes, error } = await supabase
      .from('viajes')
      .select(`
        *,
        rutas!inner(ubicacion_inicio, ubicacion_fin, distancia_km),
        usuarios!inner(nombre),
        vehiculos!inner(*)
      `)
      .eq('vehiculos.usuario_id', id);

    if (error) throw error;

    const hoy = new Date().toISOString().split('T')[0];
    const viajesHoy = viajes.filter(v => v.hora_inicio.startsWith(hoy)).length;
    const gananciasHoy = viajes
      .filter(v => v.hora_inicio.startsWith(hoy) && v.estado === 'Completado')
      .reduce((total, viaje) => total + parseFloat(viaje.tarifa_dinamica || 0), 0);
    const ratings = viajes.filter(v => v.calificacion && v.estado === 'Completado').map(v => v.calificacion);
    const ratingPromedio = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;

    res.json({
      viajesHoy,
      gananciasHoy: gananciasHoy.toFixed(2),
      ratingPromedio,
      tiempoOnline: '6h 23m'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Viajes activos del conductor
router.get('/conductor/:id/viajes-activos', async (req, res) => {
  const { id } = req.params;

  try {
    const { data: viajes, error } = await supabase
      .from('viajes')
      .select(`
        *,
        rutas!inner(ubicacion_inicio, ubicacion_fin, distancia_km),
        usuarios!inner(nombre),
        vehiculos!inner(*)
      `)
      .eq('vehiculos.usuario_id', id)
      .in('estado', ['Solicitado', 'Aceptado', 'En Curso']);

    if (error) throw error;
    res.json(viajes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Historial de viajes del conductor
router.get('/conductor/:id/historial-viajes', async (req, res) => {
  const { id } = req.params;

  try {
    const { data: viajes, error } = await supabase
      .from('viajes')
      .select(`
        *,
        rutas!inner(ubicacion_inicio, ubicacion_fin, distancia_km),
        usuarios!inner(nombre),
        vehiculos!inner(*)
      `)
      .eq('vehiculos.usuario_id', id)
      .order('hora_inicio', { ascending: false });

    if (error) throw error;
    res.json(viajes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Datos de ganancias del conductor
router.get('/conductor/:id/ganancias', async (req, res) => {
  const { id } = req.params;

  try {
    const { data: viajes, error } = await supabase
      .from('viajes')
      .select(`
        *,
        rutas!inner(ubicacion_inicio, ubicacion_fin, distancia_km),
        usuarios!inner(nombre),
        vehiculos!inner(*)
      `)
      .eq('vehiculos.usuario_id', id)
      .eq('estado', 'Completado');

    if (error) throw error;

    const gananciasTotales = viajes.reduce((total, viaje) => total + parseFloat(viaje.tarifa_dinamica || 0), 0);
    const promedioViaje = viajes.length > 0 ? (gananciasTotales / viajes.length).toFixed(2) : 0;

    res.json({
      gananciasTotales: gananciasTotales.toFixed(2),
      promedioViaje,
      horasTrabajadas: '147h 32m'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Vehículo del conductor
router.get('/conductor/:id/vehicle', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('vehiculos')
      .select('id')
      .eq('usuario_id', id)
      .maybeSingle();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST - Obtener o crear ruta
router.post('/rutas/get-or-create', async (req, res) => {
  const { ubicacion_inicio, ubicacion_fin, distancia_km } = req.body;

  try {
    let { data: ruta, error } = await supabase
      .from('rutas')
      .select('id')
      .eq('ubicacion_inicio', ubicacion_inicio)
      .eq('ubicacion_fin', ubicacion_fin)
      .maybeSingle();

    if (error) throw error;

    if (!ruta) {
      const { data: nuevaRuta, error: insertError } = await supabase
        .from('rutas')
        .insert({
          ubicacion_inicio,
          ubicacion_fin,
          distancia_km
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      ruta = nuevaRuta;
    }

    res.json(ruta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST - Crear viaje
router.post('/viajes/create', async (req, res) => {
  const { usuario_id, vehiculo_id, ruta_id, tarifa_dinamica, estado, hora_inicio } = req.body;

  try {
    const { data, error } = await supabase
      .from('viajes')
      .insert({
        usuario_id,
        vehiculo_id,
        ruta_id,
        tarifa_dinamica,
        estado,
        hora_inicio
      })
      .select('*');

    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

// ✅ UPDATE - Aceptar viaje
router.put('/viajes/:id/accept', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('viajes')
    .update({ estado: 'Aceptado' })
    .eq('id', id)
    .select('*');

  if (error) {
    console.error('❌ Error al aceptar viaje:', error.message);
    return res.status(500).json({ error: 'Error al aceptar el viaje.', details: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Viaje no encontrado.' });
  }

  res.json({ message: '✅ Viaje aceptado con éxito.', viaje: data[0] });
});

// ✅ UPDATE - Rechazar viaje
router.put('/viajes/:id/reject', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('viajes')
    .update({ estado: 'Rechazado' })
    .eq('id', id)
    .select('*');

  if (error) {
    console.error('❌ Error al rechazar viaje:', error.message);
    return res.status(500).json({ error: 'Error al rechazar el viaje.', details: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Viaje no encontrado.' });
  }

  res.json({ message: '✅ Viaje rechazado con éxito.', viaje: data[0] });
});

// ✅ UPDATE - Iniciar viaje
router.put('/viajes/:id/start', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('viajes')
    .update({ estado: 'En Curso' })
    .eq('id', id)
    .select('*');

  if (error) {
    console.error('❌ Error al iniciar viaje:', error.message);
    return res.status(500).json({ error: 'Error al iniciar el viaje.', details: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Viaje no encontrado.' });
  }

  res.json({ message: '✅ Viaje iniciado con éxito.', viaje: data[0] });
});

// ✅ UPDATE - Completar viaje
router.put('/viajes/:id/complete', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('viajes')
    .update({ estado: 'Completado' })
    .eq('id', id)
    .select('*');

  if (error) {
    console.error('❌ Error al completar viaje:', error.message);
    return res.status(500).json({ error: 'Error al completar el viaje.', details: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Viaje no encontrado.' });
  }

  res.json({ message: '✅ Viaje completado con éxito.', viaje: data[0] });
});

// ✅ UPDATE - Cancelar viaje
router.put('/viajes/:id/cancel', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('viajes')
    .update({ estado: 'Cancelado' })
    .eq('id', id)
    .select('*');

  if (error) {
    console.error('❌ Error al cancelar viaje:', error.message);
    return res.status(500).json({ error: 'Error al cancelar el viaje.', details: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Viaje no encontrado.' });
  }

  res.json({ message: '✅ Viaje cancelado con éxito.', viaje: data[0] });
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
