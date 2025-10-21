// ===== DASHBOARD ADMINISTRADOR VIA =====

// Variables globales para los gráficos
let viajesChart = null;
let usuariosChart = null;
let ingresosChart = null;

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar dashboard
  inicializarDashboardAdmin();

  // Configurar navegación
  configurarNavegacion();

  // Configurar gráficos
  inicializarGraficos();

  // Cargar datos iniciales
  cargarDatosDashboard();

  // Actualizar fecha y hora
  actualizarFechaHora();
  setInterval(actualizarFechaHora, 1000);

  // Cargar notificaciones
  cargarNotificaciones();

  // Agregar event listener al botón de logout
  const btnLogout = document.querySelector('.btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', cerrarSesion);
  }

  // Event listener para el formulario de editar usuario
  const editForm = document.getElementById('edit-user-form');
  if (editForm) {
    editForm.addEventListener('submit', function(e) {
      e.preventDefault();
      guardarCambiosUsuario();
    });
  }
});

// ===== INICIALIZACIÓN =====
function inicializarDashboardAdmin() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (usuario && usuario.tipoUsuario === 'admin') {
    document.getElementById('admin-nombre').textContent = usuario.nombre;
  } else {
    // Redirigir si no es admin
    window.location.href = '../index.html';
  }
}

// ===== NAVEGACIÓN =====
function configurarNavegacion() {
  const navItems = document.querySelectorAll('.nav-item');
  const contentSections = document.querySelectorAll('.content-section');
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remover clase active de todos los items
      navItems.forEach(nav => nav.classList.remove('active'));
      contentSections.forEach(section => section.classList.remove('active'));
      
      // Agregar clase active al item clickeado
      this.classList.add('active');
      
      // Mostrar sección correspondiente
      const targetSection = this.getAttribute('data-section');
      document.getElementById(`${targetSection}-section`).classList.add('active');
      
      // Actualizar título del header
      actualizarTituloHeader(this.textContent.trim());
    });
  });
}

function actualizarTituloHeader(titulo) {
  const headerTitle = document.getElementById('header-title');
  const headerSubtitle = document.querySelector('.header-subtitle');
  
  switch(titulo) {
    case 'Dashboard':
      headerTitle.textContent = 'Dashboard General';
      headerSubtitle.textContent = 'Resumen de la plataforma VIA';
      break;
    case 'Usuarios':
      headerTitle.textContent = 'Gestión de Usuarios';
      headerSubtitle.textContent = 'Administra usuarios de la plataforma';
      break;
    case 'Viajes':
      headerTitle.textContent = 'Gestión de Viajes';
      headerSubtitle.textContent = 'Monitorea y gestiona todos los viajes';
      break;
    case 'Reportes':
      headerTitle.textContent = 'Reportes y Analytics';
      headerSubtitle.textContent = 'Análisis detallado de la plataforma';
      break;
    case 'Configuración':
      headerTitle.textContent = 'Configuración del Sistema';
      headerSubtitle.textContent = 'Ajusta parámetros de la plataforma';
      break;
  }
}

// ===== GRÁFICOS =====
function inicializarGraficos() {
  // Destruir gráficos existentes si ya están creados
  if (viajesChart) {
    viajesChart.destroy();
  }
  if (usuariosChart) {
    usuariosChart.destroy();
  }
  if (ingresosChart) {
    ingresosChart.destroy();
  }

  // Gráfico de viajes por día
  const viajesCtx = document.getElementById('viajesChart');
  if (viajesCtx) {
    viajesChart = new Chart(viajesCtx, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
          label: 'Viajes Completados',
          data: [45, 52, 38, 67, 89, 76, 54],
          borderColor: '#c81a65',
          backgroundColor: 'rgba(200, 26, 101, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Gráfico de distribución de usuarios
  const usuariosCtx = document.getElementById('usuariosChart');
  if (usuariosCtx) {
    usuariosChart = new Chart(usuariosCtx, {
      type: 'doughnut',
      data: {
        labels: ['Conductores', 'Pasajeros', 'Admins'],
        datasets: [{
          data: [45, 78, 3],
          backgroundColor: ['#c81a65', '#f15339', '#f9a61c'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  // Gráfico de ingresos
  const ingresosCtx = document.getElementById('ingresosChart');
  if (ingresosCtx) {
    ingresosChart = new Chart(ingresosCtx, {
      type: 'bar',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
          label: 'Ingresos Mensuales',
          data: [12500, 15800, 14200, 18900, 22100, 19800],
          backgroundColor: '#10b981',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
}

// ===== DATOS DEL DASHBOARD =====
function cargarDatosDashboard() {
  // Cargar métricas
  cargarMetricas();
  
  // Cargar actividad reciente
  cargarActividadReciente();
  
  // Cargar usuarios
  cargarUsuarios();
  
  // Cargar viajes
  cargarViajes();
  
  // Cargar conductores top
  cargarConductoresTop();
}

function cargarMetricas() {
  // Simular datos de métricas
  const metricas = {
    totalUsuarios: 2847,
    viajesHoy: 156,
    ingresosHoy: 2847,
    ratingPromedio: 4.8
  };
  
  // Actualizar valores en el DOM
  Object.keys(metricas).forEach(key => {
    const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
    if (element) {
      element.textContent = key.includes('ingresos') ? `$${metricas[key].toLocaleString()}` : metricas[key];
    }
  });
}

function cargarActividadReciente() {
  const actividades = [
    {
      tipo: 'usuario',
      mensaje: 'Nuevo conductor registrado: Carlos Rodríguez',
      tiempo: '2 min',
      icono: 'fas fa-user-plus'
    },
    {
      tipo: 'viaje',
      mensaje: 'Viaje completado: Centro → Norte',
      tiempo: '5 min',
      icono: 'fas fa-check-circle'
    },
    {
      tipo: 'pago',
      mensaje: 'Pago procesado: $12.50',
      tiempo: '8 min',
      icono: 'fas fa-credit-card'
    },
    {
      tipo: 'reporte',
      mensaje: 'Reporte de usuario: Juan Pérez',
      tiempo: '12 min',
      icono: 'fas fa-flag'
    }
  ];
  
  const activityList = document.getElementById('activity-list');
  if (activityList) {
    activityList.innerHTML = actividades.map(actividad => `
      <div class="activity-item ${actividad.tipo}">
        <div class="activity-icon">
          <i class="${actividad.icono}"></i>
        </div>
        <div class="activity-content">
          <div class="activity-message">${actividad.mensaje}</div>
          <div class="activity-time">${actividad.tiempo}</div>
        </div>
      </div>
    `).join('');
  }
}

function cargarUsuarios() {
  const usuarios = [
    {
      nombre: 'Juan Pérez',
      tipo: 'Pasajero',
      estado: 'Activo',
      ultimoAcceso: 'Hace 2 min',
      acciones: ['ver', 'editar', 'suspender']
    },
    {
      nombre: 'Carlos Rodríguez',
      tipo: 'Conductor',
      estado: 'Verificando',
      ultimoAcceso: 'Hace 15 min',
      acciones: ['ver', 'aprobar', 'rechazar']
    },
    {
      nombre: 'María González',
      tipo: 'Pasajero',
      estado: 'Activo',
      ultimoAcceso: 'Hace 1 hora',
      acciones: ['ver', 'editar', 'suspender']
    }
  ];
  
  const usersTableBody = document.getElementById('users-table-body');
  if (usersTableBody) {
    usersTableBody.innerHTML = usuarios.map(usuario => `
      <tr>
        <td>
          <div class="user-info">
            <img src="../style/image/cosa.jpg" alt="Usuario" class="user-avatar">
            <span>${usuario.nombre}</span>
          </div>
        </td>
        <td><span class="user-type ${usuario.tipo.toLowerCase()}">${usuario.tipo}</span></td>
        <td><span class="user-status ${usuario.estado.toLowerCase()}">${usuario.estado}</span></td>
        <td>${usuario.ultimoAcceso}</td>
        <td>
          <div class="user-actions">
            ${usuario.acciones.map(accion => 
              `<button class="btn-action ${accion}" onclick="ejecutarAccion('${accion}', '${usuario.nombre}')">
                <i class="fas fa-${accion === 'ver' ? 'eye' : accion === 'editar' ? 'edit' : accion === 'aprobar' ? 'check' : accion === 'rechazar' ? 'times' : 'ban'}"></i>
              </button>`
            ).join('')}
          </div>
        </td>
      </tr>
    `).join('');
  }
}

function cargarViajes() {
  const viajes = [
    {
      id: 'TRP001',
      conductor: 'Carlos Rodríguez',
      pasajero: 'Juan Pérez',
      estado: 'Completado',
      distancia: '2.5 km',
      precio: '$8.50',
      fecha: '15/01/2024'
    },
    {
      id: 'TRP002',
      conductor: 'Ana Martínez',
      pasajero: 'María González',
      estado: 'En Curso',
      distancia: '4.2 km',
      precio: '$12.80',
      fecha: '15/01/2024'
    }
  ];
  
  const tripsTableBody = document.getElementById('trips-table-body');
  if (tripsTableBody) {
    tripsTableBody.innerHTML = viajes.map(viaje => `
      <tr>
        <td>${viaje.id}</td>
        <td>${viaje.conductor}</td>
        <td>${viaje.pasajero}</td>
        <td><span class="trip-status ${viaje.estado.toLowerCase().replace(' ', '-')}">${viaje.estado}</span></td>
        <td>${viaje.distancia}</td>
        <td>${viaje.precio}</td>
        <td>${viaje.fecha}</td>
        <td>
          <div class="trip-actions">
            <button class="btn-action ver" onclick="verDetalleViaje('${viaje.id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-action editar" onclick="editarViaje('${viaje.id}')">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

function cargarConductoresTop() {
  const conductoresTop = [
    { nombre: 'Carlos Rodríguez', viajes: 156, rating: 4.9, ganancias: '$1,247' },
    { nombre: 'Ana Martínez', viajes: 142, rating: 4.8, ganancias: '$1,189' },
    { nombre: 'Luis García', viajes: 128, rating: 4.7, ganancias: '$1,056' }
  ];
  
  const topDrivers = document.getElementById('top-drivers');
  if (topDrivers) {
    topDrivers.innerHTML = conductoresTop.map((conductor, index) => `
      <div class="driver-rank">
        <div class="rank-number">${index + 1}</div>
        <div class="driver-info">
          <div class="driver-name">${conductor.nombre}</div>
          <div class="driver-stats">
            <span>${conductor.viajes} viajes</span>
            <span>★ ${conductor.rating}</span>
            <span>${conductor.ganancias}</span>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// ===== FUNCIONES UTILITARIAS =====
function actualizarFechaHora() {
  const now = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  const currentDate = document.getElementById('current-date');
  const currentTime = document.getElementById('current-time');
  
  if (currentDate) {
    currentDate.textContent = now.toLocaleDateString('es-ES', options);
  }
  
  if (currentTime) {
    currentTime.textContent = now.toLocaleTimeString('es-ES');
  }
}

function cargarNotificaciones() {
  const notificaciones = [
    {
      titulo: 'Nuevo conductor registrado',
      mensaje: 'Carlos Rodríguez ha completado su registro',
      tiempo: 'Hace 2 min',
      tipo: 'info'
    },
    {
      titulo: 'Reporte de usuario',
      mensaje: 'Juan Pérez ha reportado un problema',
      tiempo: 'Hace 15 min',
      tipo: 'warning'
    },
    {
      titulo: 'Sistema actualizado',
      mensaje: 'La plataforma ha sido actualizada exitosamente',
      tiempo: 'Hace 1 hora',
      tipo: 'success'
    }
  ];
  
  const notificationCount = document.getElementById('notification-count');
  if (notificationCount) {
    notificationCount.textContent = notificaciones.length;
  }
}

// ===== FUNCIONES DE ACCIÓN =====
function ejecutarAccion(accion, usuario) {
  switch(accion) {
    case 'ver':
      mostrarPerfilUsuario(usuario);
      break;
    case 'editar':
      editarUsuario(usuario);
      break;
    case 'aprobar':
      aprobarConductor(usuario);
      break;
    case 'rechazar':
      rechazarConductor(usuario);
      break;
    case 'suspender':
      suspenderUsuario(usuario);
      break;
  }
}

function verDetalleViaje(idViaje) {
  console.log(`Viendo detalle del viaje: ${idViaje}`);
  // Implementar modal de detalle
}

function editarViaje(idViaje) {
  console.log(`Editando viaje: ${idViaje}`);
  // Implementar modal de edición
}

function mostrarPerfilUsuario(nombre) {
  // Buscar usuario en los datos simulados
  const usuarios = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan.perez@email.com',
      telefono: '+57 300 123 4567',
      tipo: 'pasajero',
      estado: 'activo',
      fechaRegistro: '2024-01-15',
      viajesCompletados: 47,
      ratingPromedio: 4.8,
      ultimoAcceso: 'Hace 2 min',
      avatar: '../style/image/cosa.jpg'
    },
    {
      id: 2,
      nombre: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      telefono: '+57 301 234 5678',
      tipo: 'conductor',
      estado: 'verificado',
      fechaRegistro: '2024-01-10',
      viajesCompletados: 156,
      ratingPromedio: 4.9,
      ultimoAcceso: 'Hace 15 min',
      avatar: '../style/image/cosa.jpg',
      vehiculo: {
        marca: 'Toyota',
        modelo: 'Corolla 2022',
        placa: 'ABC123',
        color: 'Blanco'
      }
    },
    {
      id: 3,
      nombre: 'María González',
      email: 'maria.gonzalez@email.com',
      telefono: '+57 302 345 6789',
      tipo: 'pasajero',
      estado: 'activo',
      fechaRegistro: '2024-01-20',
      viajesCompletados: 23,
      ratingPromedio: 4.7,
      ultimoAcceso: 'Hace 1 hora',
      avatar: '../style/image/cosa.jpg'
    }
  ];

  const usuario = usuarios.find(u => u.nombre === nombre);
  if (!usuario) {
    mostrarNotificacion('Usuario no encontrado', 'error');
    return;
  }

  const modal = document.getElementById('user-profile-modal');
  const content = document.getElementById('user-profile-content');

  content.innerHTML = `
    <div class="user-profile-details">
      <div class="profile-header">
        <img src="${usuario.avatar}" alt="Avatar" class="profile-avatar-large">
        <div class="profile-info">
          <h3>${usuario.nombre}</h3>
          <p class="user-type-badge ${usuario.tipo}">${usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1)}</p>
          <p class="user-status-badge ${usuario.estado}">${usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1)}</p>
        </div>
      </div>

      <div class="profile-stats">
        <div class="stat-item">
          <span class="stat-label">Viajes Completados</span>
          <span class="stat-value">${usuario.viajesCompletados}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Rating Promedio</span>
          <span class="stat-value">${usuario.ratingPromedio} ★</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Último Acceso</span>
          <span class="stat-value">${usuario.ultimoAcceso}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Fecha de Registro</span>
          <span class="stat-value">${new Date(usuario.fechaRegistro).toLocaleDateString('es-ES')}</span>
        </div>
      </div>

      <div class="profile-contact">
        <h4>Información de Contacto</h4>
        <div class="contact-info">
          <p><strong>Email:</strong> ${usuario.email}</p>
          <p><strong>Teléfono:</strong> ${usuario.telefono}</p>
        </div>
      </div>

      ${usuario.tipo === 'conductor' && usuario.vehiculo ? `
        <div class="profile-vehicle">
          <h4>Información del Vehículo</h4>
          <div class="vehicle-info">
            <p><strong>Marca:</strong> ${usuario.vehiculo.marca}</p>
            <p><strong>Modelo:</strong> ${usuario.vehiculo.modelo}</p>
            <p><strong>Placa:</strong> ${usuario.vehiculo.placa}</p>
            <p><strong>Color:</strong> ${usuario.vehiculo.color}</p>
          </div>
        </div>
      ` : ''}

      <div class="profile-actions">
        <button class="btn-primary" onclick="editarUsuario('${usuario.nombre}')">
          <i class="fas fa-edit"></i>
          Editar Usuario
        </button>
        <button class="btn-secondary" onclick="closeUserProfileModal()">
          <i class="fas fa-times"></i>
          Cerrar
        </button>
      </div>
    </div>
  `;

  modal.style.display = 'block';
}

function closeUserProfileModal() {
  const modal = document.getElementById('user-profile-modal');
  modal.style.display = 'none';
}

function editarUsuario(nombre) {
  // Buscar usuario
  const usuarios = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan.perez@email.com', telefono: '+57 300 123 4567', tipo: 'pasajero', estado: 'activo' },
    { id: 2, nombre: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', telefono: '+57 301 234 5678', tipo: 'conductor', estado: 'verificado' },
    { id: 3, nombre: 'María González', email: 'maria.gonzalez@email.com', telefono: '+57 302 345 6789', tipo: 'pasajero', estado: 'activo' }
  ];

  const usuario = usuarios.find(u => u.nombre === nombre);
  if (!usuario) {
    mostrarNotificacion('Usuario no encontrado', 'error');
    return;
  }

  // Llenar formulario
  document.getElementById('edit-user-id').value = usuario.id;
  document.getElementById('edit-nombre').value = usuario.nombre;
  document.getElementById('edit-email').value = usuario.email;
  document.getElementById('edit-telefono').value = usuario.telefono;
  document.getElementById('edit-tipo').value = usuario.tipo;
  document.getElementById('edit-estado').value = usuario.estado;

  // Mostrar modal
  const modal = document.getElementById('edit-user-modal');
  modal.style.display = 'block';

  // Cerrar modal de perfil si está abierto
  closeUserProfileModal();
}

function closeEditUserModal() {
  const modal = document.getElementById('edit-user-modal');
  modal.style.display = 'none';
}

function aprobarConductor(nombre) {
  const modal = document.getElementById('conductor-action-modal');
  const title = document.getElementById('conductor-action-title');
  const content = document.getElementById('conductor-action-content');
  const confirmBtn = document.getElementById('btn-confirm-action');

  title.textContent = 'Aprobar Conductor';
  content.innerHTML = `
    <div class="conductor-action-info">
      <i class="fas fa-user-check" style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;"></i>
      <h4>¿Aprobar a ${nombre} como conductor?</h4>
      <p>Esta acción permitirá que ${nombre} pueda recibir viajes en la plataforma.</p>
      <div class="action-details">
        <p><strong>Acción:</strong> Aprobación de conductor</p>
        <p><strong>Usuario:</strong> ${nombre}</p>
        <p><strong>Estado resultante:</strong> Verificado</p>
      </div>
    </div>
  `;

  confirmBtn.textContent = 'Aprobar Conductor';
  confirmBtn.onclick = () => {
    // Simular aprobación
    console.log(`Conductor aprobado: ${nombre}`);
    closeConductorActionModal();
    mostrarNotificacion('Conductor aprobado exitosamente', 'success');
    // Recargar tabla de usuarios
    cargarUsuarios();
  };

  modal.style.display = 'block';
}

function rechazarConductor(nombre) {
  const modal = document.getElementById('conductor-action-modal');
  const title = document.getElementById('conductor-action-title');
  const content = document.getElementById('conductor-action-content');
  const confirmBtn = document.getElementById('btn-confirm-action');

  title.textContent = 'Rechazar Conductor';
  content.innerHTML = `
    <div class="conductor-action-info">
      <i class="fas fa-user-times" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
      <h4>¿Rechazar a ${nombre} como conductor?</h4>
      <p>Esta acción rechazará la solicitud de ${nombre} para ser conductor.</p>
      <div class="action-details">
        <p><strong>Acción:</strong> Rechazo de conductor</p>
        <p><strong>Usuario:</strong> ${nombre}</p>
        <p><strong>Estado resultante:</strong> Rechazado</p>
      </div>
    </div>
  `;

  confirmBtn.textContent = 'Rechazar Conductor';
  confirmBtn.onclick = () => {
    // Simular rechazo
    console.log(`Conductor rechazado: ${nombre}`);
    closeConductorActionModal();
    mostrarNotificacion('Conductor rechazado', 'info');
    // Recargar tabla de usuarios
    cargarUsuarios();
  };

  modal.style.display = 'block';
}

function closeConductorActionModal() {
  const modal = document.getElementById('conductor-action-modal');
  modal.style.display = 'none';
}

function suspenderUsuario(nombre) {
  if (confirm(`¿Estás seguro de suspender a ${nombre}? Esta acción limitará temporalmente el acceso del usuario a la plataforma.`)) {
    // Simular suspensión
    console.log(`Usuario suspendido: ${nombre}`);
    mostrarNotificacion('Usuario suspendido temporalmente', 'warning');
    // Recargar tabla de usuarios
    cargarUsuarios();
  }
}

// ===== FUNCIONES DE EXPORTACIÓN =====
function exportarUsuarios() {
  console.log('Exportando usuarios...');
  // Implementar exportación a CSV/Excel
  mostrarNotificacion('Exportación iniciada', 'info');
}

function generarReporteViajes() {
  console.log('Generando reporte de viajes...');
  // Implementar generación de reporte
  mostrarNotificacion('Reporte generado exitosamente', 'success');
}

function generarReporteCompleto() {
  console.log('Generando reporte completo...');
  // Implementar generación de reporte completo
  mostrarNotificacion('Reporte completo generado', 'success');
}

// ===== FUNCIONES DE NOTIFICACIONES =====
function toggleNotificaciones() {
  const modal = document.getElementById('notifications-modal');
  if (modal) {
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
  }
}

function closeNotificationsModal() {
  const modal = document.getElementById('notifications-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function mostrarNotificacion(mensaje, tipo = 'info') {
  const notificacion = document.createElement('div');
  notificacion.className = `notificacion notificacion-${tipo}`;
  notificacion.innerHTML = `
    <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${mensaje}</span>
  `;
  
  notificacion.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${tipo === 'success' ? '#10b981' : tipo === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.parentNode.removeChild(notificacion);
      }
    }, 300);
  }, 3000);
}

// ===== FUNCIONES DE CERRADO DE SESIÓN =====
function cerrarSesion() {
    // Remover usuario de ambos storages
    sessionStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('usuarioLogueado');
    // Redirigir a la página principal
    window.location.href = '../index.html';
 
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar dashboard
  inicializarDashboardAdmin();

  // Configurar navegación
  configurarNavegacion();

  // Configurar gráficos
  inicializarGraficos();

  // Cargar datos iniciales
  cargarDatosDashboard();

  // Actualizar fecha y hora
  actualizarFechaHora();
  setInterval(actualizarFechaHora, 1000);

  // Cargar notificaciones
  cargarNotificaciones();

  // Agregar event listener al botón de logout
  const btnLogout = document.querySelector('.btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', cerrarSesion);
  }

  // Event listener para el formulario de editar usuario
  const editForm = document.getElementById('edit-user-form');
  if (editForm) {
    editForm.addEventListener('submit', function(e) {
      e.preventDefault();
      guardarCambiosUsuario();
    });
  }
});

// Función para guardar cambios del usuario
function guardarCambiosUsuario() {
  const userId = document.getElementById('edit-user-id').value;
  const nombre = document.getElementById('edit-nombre').value;
  const email = document.getElementById('edit-email').value;
  const telefono = document.getElementById('edit-telefono').value;
  const tipo = document.getElementById('edit-tipo').value;
  const estado = document.getElementById('edit-estado').value;

  // Simular guardado
  console.log('Guardando cambios del usuario:', { userId, nombre, email, telefono, tipo, estado });

  // Cerrar modal
  closeEditUserModal();

  // Mostrar notificación
  mostrarNotificacion('Usuario actualizado exitosamente', 'success');

  // Recargar tabla de usuarios
  cargarUsuarios();
}

// ===== EVENTOS DE PERIODO DE GRÁFICOS =====
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('btn-chart-period')) {
    // Remover clase active de todos los botones
    document.querySelectorAll('.btn-chart-period').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Agregar clase active al botón clickeado
    e.target.classList.add('active');
    
    // Actualizar gráfico según el período
    const periodo = e.target.getAttribute('data-period');
    actualizarGraficoPorPeriodo(periodo);
  }
});

function actualizarGraficoPorPeriodo(periodo) {
  console.log(`Actualizando gráfico para período: ${periodo}`);
  // Implementar actualización de gráficos según período
}

// ===== ESTILOS CSS DINÁMICOS =====
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
