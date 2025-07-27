const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// POST /api/usuarios/registro
router.post('/registro', async (req, res) => {
  try {
    const { nombre, correo, telefono, direccion, contrasena } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ 
        success: false, 
        mensaje: 'Este correo ya está registrado.' 
      });
    }

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      telefono,
      direccion,
      contrasena
    });

    await nuevoUsuario.save();

    // Enviar respuesta sin la contraseña
    const usuarioResponse = {
      _id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      correo: nuevoUsuario.correo,
      telefono: nuevoUsuario.telefono,
      direccion: nuevoUsuario.direccion,
      puntuacion: nuevoUsuario.puntuacion,
      numViajes: nuevoUsuario.numViajes
    };

    res.status(201).json({
      success: true,
      mensaje: '¡Registro exitoso!',
      usuario: usuarioResponse
    });

  } catch (error) {
    console.error('Error en registro:', error);
    
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        mensaje: mensajes.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
});

// POST /api/usuarios/login
router.post('/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Correo o contraseña incorrectos.'
      });
    }

    // Verificar contraseña
    const contrasenaValida = await usuario.compararContrasena(contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({
        success: false,
        mensaje: 'Correo o contraseña incorrectos.'
      });
    }

    // Enviar respuesta sin la contraseña
    const usuarioResponse = {
      _id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      puntuacion: usuario.puntuacion,
      numViajes: usuario.numViajes
    };

    res.json({
      success: true,
      mensaje: '¡Inicio de sesión exitoso!',
      usuario: usuarioResponse
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
});

// GET /api/usuarios/:id
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-contrasena');
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      usuario
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
});

module.exports = router; 