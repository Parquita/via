// Mostrar información del usuario logueado
document.addEventListener('DOMContentLoaded', function() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (usuario) {
    const nombreElement = document.getElementById('nombre-usuario');
    if (nombreElement) nombreElement.textContent = usuario.nombre;

    const correoElement = document.getElementById('correo-usuario');
    if (correoElement) correoElement.textContent = usuario.correo;

    const telefonoElement = document.getElementById('telefono-usuario');
    if (telefonoElement) telefonoElement.textContent = usuario.telefono || '-';

    const direccionElement = document.getElementById('direccion-usuario');
    if (direccionElement) direccionElement.textContent = usuario.direccion || '-';
  }

  // Actualizar estadísticas del usuario
  actualizarEstadisticasUsuario();

  // Inicializar funcionalidades según el tipo de usuario
  const tipoUsuario = usuario ? usuario.tipoUsuario : '';

  if (tipoUsuario === 'conductor') {
    inicializarDashboardConductor();
  } else if (tipoUsuario === 'pasajero') {
    inicializarDashboardPasajero();
  }
});

// Función para actualizar estadísticas del usuario
function actualizarEstadisticasUsuario() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (!usuario) return;
  
  // Obtener viajes completados
  const viajesCompletados = JSON.parse(localStorage.getItem('viajesCompletados')) || [];
  
  // Contar viajes completados según el tipo de usuario
  let viajesRealizados = 0;
  
  if (usuario.tipoUsuario === 'conductor') {
    // Para conductores: contar viajes que ellos completaron
    viajesRealizados = viajesCompletados.filter(viaje => viaje.conductorId === usuario.id).length;
  } else if (usuario.tipoUsuario === 'pasajero') {
    // Para pasajeros: contar viajes que ellos solicitaron y fueron completados
    viajesRealizados = viajesCompletados.filter(viaje => viaje.pasajeroId === usuario.id).length;
  }
  
  // Actualizar el contador en el dashboard
  const numViajesElement = document.getElementById('num-viajes');
  if (numViajesElement) {
    numViajesElement.textContent = viajesRealizados;
  }
  
  // También puedes actualizar la puntuación si tienes esos datos
  const puntuacionEstrellasElement = document.getElementById('puntuacion-estrellas');
  if (puntuacionEstrellasElement) puntuacionEstrellasElement.textContent = '★★★★★';

  const valorPuntuacionElement = document.getElementById('valor-puntuacion');
  if (valorPuntuacionElement) valorPuntuacionElement.textContent = '5.0';
}

// ===== FUNCIONALIDADES PARA CONDUCTORES =====
function inicializarDashboardConductor() {
  // Cargar viajes pendientes al inicio
  cargarViajesPendientes();
  
  // Cargar viajes activos al inicio
  cargarViajesActivos();
  
  // Actualizar viajes pendientes cada 5 segundos
  setInterval(cargarViajesPendientes, 5000);
  
  // Actualizar viajes activos cada 10 segundos
  setInterval(cargarViajesActivos, 10000);
}

// Función para cargar viajes pendientes
function cargarViajesPendientes() {
  const listaViajes = document.getElementById('lista-viajes-pendientes');
  if (!listaViajes) return;

  // Obtener viajes pendientes del localStorage (simulación)
  const viajesPendientes = JSON.parse(localStorage.getItem('viajesPendientes')) || [];
  
  if (viajesPendientes.length === 0) {
    listaViajes.innerHTML = `
      <div class="viajes-vacios">
        <i class="fas fa-clock"></i>
        <h4>No hay viajes pendientes</h4>
        <p>Los viajes solicitados por pasajeros aparecerán aquí</p>
      </div>
    `;
    return;
  }

  listaViajes.innerHTML = viajesPendientes.map(viaje => `
    <div class="viaje-item" data-viaje-id="${viaje.id}">
      <div class="info-pasajero">
        <div class="nombre-pasajero">${viaje.nombrePasajero}</div>
        <div class="puntuacion-pasajero">
          <span class="puntuacion-estrellas">${'★'.repeat(Math.floor(viaje.puntuacion))}${'☆'.repeat(5 - Math.floor(viaje.puntuacion))}</span>
          <span class="valor-puntuacion">${viaje.puntuacion.toFixed(1)}</span>
        </div>
      </div>
      <div class="acciones-viaje">
        <button class="btn-aceptar" onclick="aceptarViaje('${viaje.id}')">
          <i class="fas fa-check"></i> Aceptar
        </button>
        <button class="btn-rechazar" onclick="rechazarViaje('${viaje.id}')">
          <i class="fas fa-times"></i> Rechazar
        </button>
      </div>
    </div>
  `).join('');
}

// Función para cargar viajes activos
function cargarViajesActivos() {
  const listaViajesActivos = document.getElementById('lista-viajes-activos');
  if (!listaViajesActivos) return;

  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (!usuario) return;

  // Obtener viajes activos del localStorage
  const viajesActivos = JSON.parse(localStorage.getItem('viajesActivos')) || [];
  
  // Filtrar viajes del conductor actual
  const viajesDelConductor = viajesActivos.filter(viaje => viaje.conductorId === usuario.id);
  
  if (viajesDelConductor.length === 0) {
    listaViajesActivos.innerHTML = `
      <div class="viajes-vacios">
        <i class="fas fa-car"></i>
        <h4>No hay viajes activos</h4>
        <p>Acepta un viaje para que aparezca aquí</p>
      </div>
    `;
    return;
  }

  listaViajesActivos.innerHTML = viajesDelConductor.map(viaje => {
    const tiempoTranscurrido = calcularTiempoTranscurrido(viaje.fechaSolicitud);
    
    return `
      <div class="viaje-activo-item" data-viaje-id="${viaje.id}">
        <div class="info-viaje-activo">
          <div class="nombre-viaje-activo">${viaje.nombrePasajero}</div>
          <div class="detalles-viaje">
            <div class="detalle-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>Origen: ${viaje.origen}</span>
            </div>
            <div class="detalle-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>Destino: ${viaje.destino}</span>
            </div>
            <div class="detalle-item">
              <i class="fas fa-star"></i>
              <span>Puntuación: ${viaje.puntuacion.toFixed(1)}</span>
            </div>
            <div class="tiempo-transcurrido">
              <i class="fas fa-clock"></i>
              <span>${tiempoTranscurrido}</span>
            </div>
          </div>
        </div>
        <div class="acciones-viaje-activo">
          <span class="estado-activo">En curso</span>
          <button class="btn-completar" onclick="completarViaje('${viaje.id}')">
            <i class="fas fa-check-double"></i> Completar
          </button>
          <button class="btn-cancelar" onclick="cancelarViaje('${viaje.id}')">
            <i class="fas fa-times"></i> Cancelar
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Función para calcular tiempo transcurrido
function calcularTiempoTranscurrido(fechaSolicitud) {
  const ahora = new Date();
  const solicitud = new Date(fechaSolicitud);
  const diferencia = ahora - solicitud;
  
  const minutos = Math.floor(diferencia / (1000 * 60));
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  
  if (dias > 0) {
    return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
  } else if (horas > 0) {
    return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
  } else if (minutos > 0) {
    return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
  } else {
    return 'Hace unos momentos';
  }
}

// Función para aceptar un viaje
function aceptarViaje(viajeId) {
  const viajesPendientes = JSON.parse(localStorage.getItem('viajesPendientes')) || [];
  const viajeIndex = viajesPendientes.findIndex(v => v.id === viajeId);
  
  if (viajeIndex !== -1) {
    const viaje = viajesPendientes[viajeIndex];
    viaje.estado = 'aceptado';
    viaje.conductorId = JSON.parse(localStorage.getItem('usuarioLogueado')).id;
    
    // Mover a viajes activos
    const viajesActivos = JSON.parse(localStorage.getItem('viajesActivos')) || [];
    viajesActivos.push(viaje);
    localStorage.setItem('viajesActivos', JSON.stringify(viajesActivos));
    
    // Remover de pendientes
    viajesPendientes.splice(viajeIndex, 1);
    localStorage.setItem('viajesPendientes', JSON.stringify(viajesPendientes));
    
    // Actualizar las vistas
    cargarViajesPendientes();
    cargarViajesActivos();
    
    // Actualizar estadísticas del usuario
    actualizarEstadisticasUsuario();
    
    // Mostrar notificación
    mostrarNotificacion('Viaje aceptado exitosamente', 'success');
  }
}

// Función para rechazar un viaje
function rechazarViaje(viajeId) {
  const viajesPendientes = JSON.parse(localStorage.getItem('viajesPendientes')) || [];
  const viajeIndex = viajesPendientes.findIndex(v => v.id === viajeId);
  
  if (viajeIndex !== -1) {
    const viaje = viajesPendientes[viajeIndex];
    viaje.estado = 'rechazado';
    
    // Mover a historial de viajes rechazados
    const viajesRechazados = JSON.parse(localStorage.getItem('viajesRechazados')) || [];
    viajesRechazados.push(viaje);
    localStorage.setItem('viajesRechazados', JSON.stringify(viajesRechazados));
    
    // Remover de pendientes
    viajesPendientes.splice(viajeIndex, 1);
    localStorage.setItem('viajesPendientes', JSON.stringify(viajesPendientes));
    
    // Actualizar la vista
    cargarViajesPendientes();
    
    // Mostrar notificación
    mostrarNotificacion('Viaje rechazado', 'info');
  }
}

// Función para completar un viaje activo
function completarViaje(viajeId) {
  const viajesActivos = JSON.parse(localStorage.getItem('viajesActivos')) || [];
  const viajeIndex = viajesActivos.findIndex(v => v.id === viajeId);
  
  if (viajeIndex !== -1) {
    const viaje = viajesActivos[viajeIndex];
    viaje.estado = 'completado';
    viaje.fechaCompletado = new Date().toISOString();
    
    // Mover a historial de viajes completados
    const viajesCompletados = JSON.parse(localStorage.getItem('viajesCompletados')) || [];
    viajesCompletados.push(viaje);
    localStorage.setItem('viajesCompletados', JSON.stringify(viajesCompletados));
    
    // Remover de activos
    viajesActivos.splice(viajeIndex, 1);
    localStorage.setItem('viajesActivos', JSON.stringify(viajesActivos));
    
    // Actualizar las vistas
    cargarViajesActivos();
    actualizarEstadisticasUsuario();
    
    // Mostrar notificación
    mostrarNotificacion('¡Viaje completado exitosamente!', 'success');
  }
}

// Función para cancelar un viaje activo
function cancelarViaje(viajeId) {
  const viajesActivos = JSON.parse(localStorage.getItem('viajesActivos')) || [];
  const viajeIndex = viajesActivos.findIndex(v => v.id === viajeId);
  
  if (viajeIndex !== -1) {
    const viaje = viajesActivos[viajeIndex];
    viaje.estado = 'cancelado';
    viaje.fechaCancelado = new Date().toISOString();
    
    // Mover a historial de viajes cancelados
    const viajesCancelados = JSON.parse(localStorage.getItem('viajesCancelados')) || [];
    viajesCancelados.push(viaje);
    localStorage.setItem('viajesCancelados', JSON.stringify(viajesCancelados));
    
    // Remover de activos
    viajesActivos.splice(viajeIndex, 1);
    localStorage.setItem('viajesActivos', JSON.stringify(viajesActivos));
    
    // Actualizar las vistas
    cargarViajesActivos();
    actualizarEstadisticasUsuario();
    
    // Mostrar notificación
    mostrarNotificacion('Viaje cancelado', 'info');
  }
}

// ===== FUNCIONALIDADES PARA PASAJEROS =====
function inicializarDashboardPasajero() {
  const btnPedirViaje = document.getElementById('btn-pedir-viaje');
  if (btnPedirViaje) {
    btnPedirViaje.addEventListener('click', solicitarViaje);
  }
}

// Función para solicitar un viaje
function solicitarViaje() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  
  // Crear nuevo viaje
  const nuevoViaje = {
    id: Date.now().toString(),
    pasajeroId: usuario.id,
    nombrePasajero: usuario.nombre,
    puntuacion: 4.5, // Puntuación del pasajero
    estado: 'pendiente',
    fechaSolicitud: new Date().toISOString(),
    origen: 'Ubicación actual',
    destino: 'Destino solicitado'
  };
  
  // Agregar a viajes pendientes
  const viajesPendientes = JSON.parse(localStorage.getItem('viajesPendientes')) || [];
  viajesPendientes.push(nuevoViaje);
  localStorage.setItem('viajesPendientes', JSON.stringify(viajesPendientes));
  
  // Mostrar notificación
  mostrarNotificacion('Viaje solicitado. Buscando conductor...', 'success');
  
  // Cambiar texto del botón
  const btnPedirViaje = document.getElementById('btn-pedir-viaje');
  if (btnPedirViaje) {
    btnPedirViaje.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    btnPedirViaje.disabled = true;
    
    // Restaurar botón después de 3 segundos
    setTimeout(() => {
      btnPedirViaje.innerHTML = '<i class="fas fa-car"></i> Pedir Viaje';
      btnPedirViaje.disabled = false;
    }, 3000);
  }
}

// ===== FUNCIONES UTILITARIAS =====
function mostrarNotificacion(mensaje, tipo = 'info') {
  // Crear elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.className = `notificacion notificacion-${tipo}`;
  notificacion.innerHTML = `
    <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${mensaje}</span>
  `;
  
  // Agregar estilos
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
  
  // Agregar al DOM
  document.body.appendChild(notificacion);
  
  // Remover después de 3 segundos
  setTimeout(() => {
    notificacion.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.parentNode.removeChild(notificacion);
      }
    }, 300);
  }, 3000);
}

// Agregar estilos CSS para las animaciones
const dashboardStyle = document.createElement('style');
dashboardStyle.textContent = `
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
document.head.appendChild(dashboardStyle);
