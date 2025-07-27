
// Mostrar el modal al hacer clic en 'REGISTRASE'
document.getElementById('btn-registrarse').onclick = function() {
  document.getElementById('modal-registro').style.display = 'block';
};
// Ocultar el modal al hacer clic en la X
document.getElementById('cerrar-modal').onclick = function() {
  document.getElementById('modal-registro').style.display = 'none';
};
// Ocultar el modal si se hace clic fuera del contenido
document.getElementById('modal-registro').onclick = function(event) {
  if (event.target === this) {
    this.style.display = 'none';
  }
};

// Validación y guardado en localStorage del formulario de registro
const formRegistro = document.getElementById('form-registro');

// Crear elemento para mensajes
let mensajeRegistro = document.createElement('div');
mensajeRegistro.id = 'mensaje-registro';
mensajeRegistro.style.marginTop = '10px';
formRegistro.appendChild(mensajeRegistro);

formRegistro.onsubmit = async function(event) {
  event.preventDefault();
  mensajeRegistro.textContent = '';
  mensajeRegistro.style.color = 'red';

  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const contrasena = document.getElementById('contrasena').value;

  // Validaciones
  if (!nombre || !correo || !telefono || !direccion || !contrasena) {
    mensajeRegistro.textContent = 'Por favor, completa todos los campos.';
    return;
  }
  // Validar correo
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexCorreo.test(correo)) {
    mensajeRegistro.textContent = 'Correo electrónico no válido.';
    return;
  }
  // Validar contraseña
  if (contrasena.length < 6) {
    mensajeRegistro.textContent = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }

  // Validar teléfono
  const regexTelefono = /^\d{10}$/;
  if (!regexTelefono.test(telefono)) {
    mensajeRegistro.textContent = 'El teléfono debe tener exactamente 10 dígitos.';
    return;
  }

  // Validar dirección
  if (direccion.length < 10) {
    mensajeRegistro.textContent = 'La dirección debe tener al menos 10 caracteres.';
    return;
  }

  try {
    const response = await fetch('/api/usuarios/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre,
        correo,
        telefono,
        direccion,
        contrasena
      })
    });

    const data = await response.json();

    if (data.success) {
      mensajeRegistro.style.color = 'green';
      mensajeRegistro.textContent = data.mensaje;
      formRegistro.reset();
      setTimeout(() => {
        mensajeRegistro.textContent = '';
        document.getElementById('modal-registro').style.display = 'none';
        // Abrir modal de login automáticamente
        document.getElementById('modal-login').style.display = 'block';
      }, 1200);
    } else {
      mensajeRegistro.textContent = data.mensaje;
    }
  } catch (error) {
    console.error('Error en registro:', error);
    mensajeRegistro.textContent = 'Error de conexión. Intenta de nuevo.';
  }
};

// Mostrar el modal de login
const btnLogin = document.getElementById('btn-login');
const modalLogin = document.getElementById('modal-login');
const cerrarModalLogin = document.getElementById('cerrar-modal-login');

btnLogin.onclick = function() {
  modalLogin.style.display = 'block';
};
cerrarModalLogin.onclick = function() {
  modalLogin.style.display = 'none';
};
modalLogin.onclick = function(event) {
  if (event.target === this) {
    this.style.display = 'none';
  }
};

// Validación y autenticación de inicio de sesión
const formLogin = document.getElementById('form-login');
let mensajeLogin = document.createElement('div');
mensajeLogin.id = 'mensaje-login';
mensajeLogin.style.marginTop = '10px';
formLogin.appendChild(mensajeLogin);

formLogin.onsubmit = async function(event) {
  event.preventDefault();
  mensajeLogin.textContent = '';
  mensajeLogin.style.color = 'red';

  const correo = document.getElementById('login-correo').value.trim();
  const contrasena = document.getElementById('login-contrasena').value;

  if (!correo || !contrasena) {
    mensajeLogin.textContent = 'Por favor, completa todos los campos.';
    return;
  }
  // Validar correo
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexCorreo.test(correo)) {
    mensajeLogin.textContent = 'Correo electrónico no válido.';
    return;
  }

  try {
    const response = await fetch('/api/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo,
        contrasena
      })
    });

    const data = await response.json();

    if (data.success) {
      mensajeLogin.style.color = 'green';
      mensajeLogin.textContent = data.mensaje;
      formLogin.reset();
      // Guardar usuario logueado
      localStorage.setItem('usuarioLogueado', JSON.stringify(data.usuario));
      setTimeout(() => {
        mensajeLogin.textContent = '';
        modalLogin.style.display = 'none';
        // Redirigir al dashboard
        window.location.href = 'dashboard.html';
      }, 1200);
    } else {
      mensajeLogin.textContent = data.mensaje;
    }
  } catch (error) {
    console.error('Error en login:', error);
    mensajeLogin.textContent = 'Error de conexión. Intenta de nuevo.';
  }
};