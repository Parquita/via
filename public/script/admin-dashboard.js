// ===== DASHBOARD ADMINISTRADOR VIA =====

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
  // Gráfico de viajes por día
  const viajesCtx = document.getElementById('viajesChart');
  if (viajesCtx) {
    new Chart(viajesCtx, {
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
    new Chart(usuariosCtx, {
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
    new Chart(ingresosCtx, {
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
  console.log(`Mostrando perfil de: ${nombre}`);
  // Implementar modal de perfil
}

function editarUsuario(nombre) {
  console.log(`Editando usuario: ${nombre}`);
  // Implementar modal de edición
}

function aprobarConductor(nombre) {
  if (confirm(`¿Estás seguro de aprobar a ${nombre} como conductor?`)) {
    console.log(`Conductor aprobado: ${nombre}`);
    // Implementar lógica de aprobación
    mostrarNotificacion('Conductor aprobado exitosamente', 'success');
  }
}

function rechazarConductor(nombre) {
  if (confirm(`¿Estás seguro de rechazar a ${nombre} como conductor?`)) {
    console.log(`Conductor rechazado: ${nombre}`);
    // Implementar lógica de rechazo
    mostrarNotificacion('Conductor rechazado', 'info');
  }
}

function suspenderUsuario(nombre) {
  if (confirm(`¿Estás seguro de suspender a ${nombre}?`)) {
    console.log(`Usuario suspendido: ${nombre}`);
    // Implementar lógica de suspensión
    mostrarNotificacion('Usuario suspendido', 'warning');
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

// Agregar event listener al botón de logout
document.addEventListener('DOMContentLoaded', function() {
  const btnLogout = document.querySelector('.btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', cerrarSesion);
  }
});

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
