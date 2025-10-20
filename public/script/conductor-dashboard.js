// ===== DASHBOARD CONDUCTOR VIA =====

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar dashboard
  inicializarDashboardConductor();

  // Configurar navegación
  configurarNavegacion();

  // Configurar gráficos
  inicializarGraficos();

  // Cargar datos iniciales
  cargarDatosDashboard();

  // Actualizar tiempo en tiempo real
  actualizarTiempoOnline();
  setInterval(actualizarTiempoOnline, 60000); // Cada minuto

  // Simular notificaciones de nuevos viajes
  simularNotificacionesViajes();

  // Configurar controles del mapa
  configurarControlesMapa();

  // Agregar event listener al botón de toggle status
  const btnToggleStatus = document.getElementById('btn-toggle-status');
  if (btnToggleStatus) {
    btnToggleStatus.addEventListener('click', toggleStatus);
  }
});

// ===== INICIALIZACIÓN =====
function inicializarDashboardConductor() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (usuario && usuario.tipoUsuario === 'conductor') {
    document.getElementById('driver-nombre').textContent = usuario.nombre;
    actualizarEstadisticasUsuario();
  } else {
    // Redirigir si no es conductor
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
      headerTitle.textContent = 'Dashboard del Conductor';
      headerSubtitle.textContent = 'Gestiona tus viajes y ganancias';
      break;
    case 'Mis Viajes':
      headerTitle.textContent = 'Historial de Viajes';
      headerSubtitle.textContent = 'Revisa todos tus viajes realizados';
      break;
    case 'Ganancias':
      headerTitle.textContent = 'Análisis de Ganancias';
      headerSubtitle.textContent = 'Monitorea tus ingresos y rendimiento';
      break;
    case 'Mi Perfil':
      headerTitle.textContent = 'Mi Perfil de Conductor';
      headerSubtitle.textContent = 'Gestiona tu información personal';
      break;
    case 'Configuración':
      headerTitle.textContent = 'Configuración del Conductor';
      headerSubtitle.textContent = 'Ajusta tus preferencias de trabajo';
      break;
  }
}

// ===== ESTADO DEL CONDUCTOR =====
function toggleStatus() {
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  const btnToggle = document.getElementById('btn-toggle-status');
  
  if (statusIndicator.classList.contains('online')) {
    // Cambiar a offline
    statusIndicator.classList.remove('online');
    statusIndicator.classList.add('offline');
    statusText.textContent = 'Desconectado';
    btnToggle.classList.add('offline');
    
    // Ocultar notificaciones de viajes
    ocultarNotificacionesViajes();
    
    mostrarNotificacion('Te has desconectado de la plataforma', 'info');
  } else {
    // Cambiar a online
    statusIndicator.classList.remove('offline');
    statusIndicator.classList.add('online');
    statusText.textContent = 'En Línea';
    btnToggle.classList.remove('offline');
    
    // Mostrar notificaciones de viajes
    mostrarNotificacionesViajes();
    
    mostrarNotificacion('Te has conectado a la plataforma', 'success');
  }
}

// ===== GRÁFICOS =====
function inicializarGraficos() {
  // Gráfico de ganancias semanales
  const earningsCtx = document.getElementById('earningsChart');
  if (earningsCtx) {
    new Chart(earningsCtx, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
          label: 'Ganancias ($)',
          data: [45.80, 52.30, 38.90, 67.20, 89.50, 76.80, 54.20],
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
  
  // Gráfico de desglose de ganancias
  const breakdownCtx = document.getElementById('earningsBreakdownChart');
  if (breakdownCtx) {
    new Chart(breakdownCtx, {
      type: 'bar',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
          label: 'Ganancias por Día',
          data: [45.80, 52.30, 38.90, 67.20, 89.50, 76.80, 54.20],
          backgroundColor: '#f15339',
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
  
  // Cargar viajes activos
  cargarViajesActivos();
  
  // Cargar historial de viajes
  cargarHistorialViajes();
  
  // Cargar datos de ganancias
  cargarDatosGanancias();
  
  // Cargar perfil del conductor
  cargarPerfilConductor();
}

function cargarMetricas() {
  // Simular datos de métricas
  const metricas = {
    viajesHoy: 8,
    gananciasHoy: 45.80,
    ratingPromedio: 4.9,
    tiempoOnline: '6h 23m'
  };
  
  // Actualizar valores en el DOM
  Object.keys(metricas).forEach(key => {
    const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
    if (element) {
      if (key === 'gananciasHoy') {
        element.textContent = `$${metricas[key]}`;
      } else {
        element.textContent = metricas[key];
      }
    }
  });
}

function cargarViajesActivos() {
  const viajesActivos = [
    {
      id: 'TRP001',
      pasajero: 'Juan Pérez',
      origen: 'Centro Comercial',
      destino: 'Zona Norte',
      estado: 'En Curso',
      tiempoEstimado: '8 min'
    }
  ];
  
  const activeTripsList = document.getElementById('active-trips-list');
  if (activeTripsList) {
    if (viajesActivos.length === 0) {
      activeTripsList.innerHTML = `
        <div class="no-active-trips">
          <i class="fas fa-car"></i>
          <p>No tienes viajes activos</p>
          <small>Los viajes aceptados aparecerán aquí</small>
        </div>
      `;
    } else {
      activeTripsList.innerHTML = viajesActivos.map(viaje => `
        <div class="active-trip-item">
          <div class="trip-header">
            <h4>Viaje #${viaje.id}</h4>
            <span class="trip-status ${viaje.estado.toLowerCase().replace(' ', '-')}">${viaje.estado}</span>
          </div>
          <div class="trip-details">
            <div class="passenger-info">
              <img src="../style/image/cosa.jpg" alt="Pasajero" class="passenger-avatar">
              <span>${viaje.pasajero}</span>
            </div>
            <div class="route-info">
              <div class="route-point">
                <i class="fas fa-map-marker-alt origin"></i>
                <span>${viaje.origen}</span>
              </div>
              <div class="route-point">
                <i class="fas fa-map-marker-alt destination"></i>
                <span>${viaje.destino}</span>
              </div>
            </div>
            <div class="trip-actions">
              <button class="btn-complete-trip" onclick="completarViaje('${viaje.id}')">
                <i class="fas fa-check"></i>
                Completar
              </button>
              <button class="btn-cancel-trip" onclick="cancelarViaje('${viaje.id}')">
                <i class="fas fa-times"></i>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

function cargarHistorialViajes() {
  const historialViajes = [
    {
      fecha: '15/01/2024',
      pasajero: 'María González',
      origen: 'Zona Sur',
      destino: 'Centro',
      distancia: '3.2 km',
      ganancia: '$9.80',
      rating: 5,
      estado: 'Completado'
    },
    {
      fecha: '14/01/2024',
      pasajero: 'Carlos López',
      origen: 'Este',
      destino: 'Oeste',
      distancia: '4.5 km',
      ganancia: '$12.50',
      rating: 4,
      estado: 'Completado'
    }
  ];
  
  const tripsTableBody = document.getElementById('trips-table-body');
  if (tripsTableBody) {
    tripsTableBody.innerHTML = historialViajes.map(viaje => `
      <tr>
        <td>${viaje.fecha}</td>
        <td>${viaje.pasajero}</td>
        <td>${viaje.origen}</td>
        <td>${viaje.destino}</td>
        <td>${viaje.distancia}</td>
        <td>${viaje.ganancia}</td>
        <td>
          <span class="rating-stars">
            ${'★'.repeat(viaje.rating)}${'☆'.repeat(5 - viaje.rating)}
          </span>
          <span class="rating-value">${viaje.rating}.0</span>
        </td>
        <td><span class="trip-status ${viaje.estado.toLowerCase()}">${viaje.estado}</span></td>
      </tr>
    `).join('');
  }
}

function cargarDatosGanancias() {
  // Simular datos de ganancias
  const ganancias = {
    gananciasTotales: 1247.80,
    promedioViaje: 8.45,
    horasTrabajadas: '147h 32m'
  };
  
  // Actualizar valores en el DOM
  Object.keys(ganancias).forEach(key => {
    const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
    if (element) {
      if (key === 'gananciasTotales' || key === 'promedioViaje') {
        element.textContent = `$${ganancias[key]}`;
      } else {
        element.textContent = ganancias[key];
      }
    }
  });
}

function cargarPerfilConductor() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (usuario) {
    document.getElementById('profile-nombre').textContent = usuario.nombre;
    document.getElementById('profile-email').textContent = usuario.correo;
    document.getElementById('profile-phone').textContent = usuario.telefono || '+57 300 123 4567';
  }
}

// ===== FUNCIONES UTILITARIAS =====
function actualizarTiempoOnline() {
  // Simular actualización del tiempo online
  const tiempoOnlineElement = document.getElementById('tiempo-online');
  if (tiempoOnlineElement) {
    const tiempoActual = tiempoOnlineElement.textContent;
    // Aquí se implementaría la lógica real de cálculo de tiempo
  }
}

function actualizarEstadisticasUsuario() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (!usuario) return;
  
  // Obtener viajes completados del localStorage
  const viajesCompletados = JSON.parse(localStorage.getItem('viajesCompletados')) || [];
  const viajesRealizados = viajesCompletados.filter(viaje => viaje.conductorId === usuario.id).length;
  
  // Actualizar contador de viajes
  const numViajesElement = document.getElementById('num-viajes');
  if (numViajesElement) {
    numViajesElement.textContent = viajesRealizados;
  }
}

// ===== FUNCIONES DE VIAJES =====
function completarViaje(viajeId) {
  if (confirm('¿Confirmas que has completado este viaje?')) {
    // Implementar lógica de completar viaje
    console.log(`Viaje ${viajeId} completado`);
    
    // Actualizar estado del viaje
    const viajeElement = document.querySelector(`[data-viaje-id="${viajeId}"]`);
    if (viajeElement) {
      viajeElement.remove();
    }
    
    // Actualizar estadísticas
    actualizarEstadisticasUsuario();
    
    mostrarNotificacion('¡Viaje completado exitosamente!', 'success');
    
    // Recargar viajes activos
    cargarViajesActivos();
  }
}

function cancelarViaje(viajeId) {
  if (confirm('¿Estás seguro de cancelar este viaje?')) {
    // Implementar lógica de cancelar viaje
    console.log(`Viaje ${viajeId} cancelado`);
    
    // Actualizar estado del viaje
    const viajeElement = document.querySelector(`[data-viaje-id="${viajeId}"]`);
    if (viajeElement) {
      viajeElement.remove();
    }
    
    mostrarNotificacion('Viaje cancelado', 'warning');
    
    // Recargar viajes activos
    cargarViajesActivos();
  }
}

// ===== FUNCIONES DE NOTIFICACIONES =====
function simularNotificacionesViajes() {
  // Simular notificaciones de nuevos viajes cada 30 segundos
  setInterval(() => {
    if (document.getElementById('status-indicator').classList.contains('online')) {
      mostrarNotificacionViaje();
    }
  }, 30000);
}

function ocultarNotificacionesViajes() {
  // Detener las notificaciones de viajes cuando el conductor está offline
  // Aquí se implementaría la lógica para detener las notificaciones
  console.log('Notificaciones de viajes ocultas');
}

function mostrarNotificacionesViajes() {
  // Reanudar las notificaciones de viajes cuando el conductor está online
  // Aquí se implementaría la lógica para mostrar las notificaciones
  console.log('Notificaciones de viajes mostradas');
}

function mostrarNotificacionViaje() {
  const modal = document.getElementById('new-trip-modal');
  if (modal) {
    // Simular datos de viaje
    const viajeSimulado = {
      pasajero: 'Ana Martínez',
      rating: 4.8,
      origen: 'Centro Comercial',
      destino: 'Zona Norte',
      distancia: '2.5 km',
      precio: '$8.50',
      duracion: '8 min'
    };
    
    // Actualizar modal con datos del viaje
    document.getElementById('modal-passenger-name').textContent = viajeSimulado.pasajero;
    document.getElementById('modal-passenger-rating').textContent = viajeSimulado.rating;
    document.getElementById('modal-origin').textContent = viajeSimulado.origen;
    document.getElementById('modal-destination').textContent = viajeSimulado.destino;
    document.getElementById('modal-distance').textContent = viajeSimulado.distancia;
    document.getElementById('modal-fare').textContent = viajeSimulado.precio;
    document.getElementById('modal-duration').textContent = viajeSimulado.duracion;
    
    // Mostrar modal
    modal.style.display = 'block';
  }
}

function aceptarViajeModal() {
  const modal = document.getElementById('new-trip-modal');
  if (modal) {
    modal.style.display = 'none';
    
    // Agregar viaje a la lista de activos
    const nuevoViaje = {
      id: 'TRP' + Date.now().toString().slice(-4),
      pasajero: document.getElementById('modal-passenger-name').textContent,
      origen: document.getElementById('modal-origin').textContent,
      destino: document.getElementById('modal-destination').textContent,
      estado: 'En Curso',
      tiempoEstimado: document.getElementById('modal-duration').textContent
    };
    
    // Aquí se implementaría la lógica real de aceptar viaje
    
    mostrarNotificacion('¡Viaje aceptado! Dirígete al origen', 'success');
    
    // Recargar viajes activos
    cargarViajesActivos();
  }
}

function rechazarViajeModal() {
  const modal = document.getElementById('new-trip-modal');
  if (modal) {
    modal.style.display = 'none';
    mostrarNotificacion('Viaje rechazado', 'info');
  }
}

function closeNewTripModal() {
  const modal = document.getElementById('new-trip-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// ===== FUNCIONES DE CONFIGURACIÓN =====
function editarPerfil() {
  console.log('Editando perfil del conductor');
  // Implementar modal de edición de perfil
  mostrarNotificacion('Función de edición en desarrollo', 'info');
}

function exportarViajes() {
  console.log('Exportando historial de viajes...');
  // Implementar exportación a CSV/Excel
  mostrarNotificacion('Exportación iniciada', 'info');
}

function generarReporteGanancias() {
  console.log('Generando reporte de ganancias...');
  // Implementar generación de reporte
  mostrarNotificacion('Reporte generado exitosamente', 'success');
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
    background: ${tipo === 'success' ? '#10b981' : tipo === 'error' ? '#ef4444' : tipo === 'warning' ? '#f59e0b' : '#3b82f6'};
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

// ===== FUNCIONES DE MAPA =====
function configurarControlesMapa() {
  const mapControls = document.querySelectorAll('.btn-map-control');
  
  mapControls.forEach(control => {
    control.addEventListener('click', function() {
      // Remover clase active de todos los controles
      mapControls.forEach(btn => btn.classList.remove('active'));
      
      // Agregar clase active al control clickeado
      this.classList.add('active');
      
      // Cambiar vista del mapa
      const vista = this.getAttribute('data-view');
      cambiarVistaMapa(vista);
    });
  });
}

function cambiarVistaMapa(vista) {
  console.log(`Cambiando vista del mapa a: ${vista}`);
  // Aquí se implementaría la lógica real de cambio de vista del mapa
  
  const mapOverlay = document.querySelector('.map-overlay p');
  if (mapOverlay) {
    switch(vista) {
      case 'heatmap':
        mapOverlay.textContent = 'Mostrando zonas de alta demanda';
        break;
      case 'traffic':
        mapOverlay.textContent = 'Mostrando información de tráfico';
        break;
    }
  }
}

// ===== FUNCIONES DE CERRADO DE SESIÓN =====
function cerrarSesion() {
    // Remover usuario de ambos storages
    sessionStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('usuarioLogueado');
    // Redirigir a la página principal
    window.location.href = '../index.html';
  
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
  
  .status-indicator.online {
    background-color: #10b981;
  }
  
  .status-indicator.offline {
    background-color: #6b7280;
  }
  
  .btn-toggle-status.offline {
    background-color: #6b7280;
  }
`;
document.head.appendChild(style);
