// ===== DASHBOARD PASAJERO VIA =====

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar dashboard
  inicializarDashboardPasajero();
  
  // Configurar navegación
  configurarNavegacion();
  
  // Configurar funcionalidades del formulario
  configurarFormularioViaje();
  
  // Cargar datos iniciales
  cargarDatosDashboard();
  
  // Actualizar fecha y hora
  actualizarFechaHora();
  setInterval(actualizarFechaHora, 1000);
  
  // Cargar notificaciones
  cargarNotificaciones();
  
  // Configurar selectores de tipo de viaje
  configurarSelectoresViaje();
  
  // Configurar contador de pasajeros
  configurarContadorPasajeros();
  
  // Cargar viajes recientes
  cargarViajesRecientes();
  
  // Cargar métodos de pago
  cargarMetodosPago();
  
  // Cargar lugares favoritos
  cargarLugaresFavoritos();
  
  // Configurar búsqueda de usuarios
  configurarBusquedaUsuarios();
});

// ===== INICIALIZACIÓN =====
function inicializarDashboardPasajero() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (usuario && usuario.tipoUsuario === 'pasajero') {
    document.getElementById('passenger-nombre').textContent = usuario.nombre;
    actualizarEstadisticasUsuario();
  } else {
    // Redirigir si no es pasajero
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
    case 'Inicio':
      headerTitle.textContent = '¡Hola! ¿A dónde vamos?';
      headerSubtitle.textContent = 'Solicita tu viaje de forma rápida y segura';
      break;
    case 'Mis Viajes':
      headerTitle.textContent = 'Historial de Viajes';
      headerSubtitle.textContent = 'Revisa todos tus viajes realizados';
      break;
    case 'Pagos':
      headerTitle.textContent = 'Métodos de Pago';
      headerSubtitle.textContent = 'Gestiona tus formas de pago';
      break;
    case 'Favoritos':
      headerTitle.textContent = 'Lugares Favoritos';
      headerSubtitle.textContent = 'Accede rápidamente a tus destinos frecuentes';
      break;
    case 'Mi Perfil':
      headerTitle.textContent = 'Mi Perfil';
      headerSubtitle.textContent = 'Gestiona tu información personal';
      break;
  }
}

// ===== FORMULARIO DE VIAJE =====
function configurarFormularioViaje() {
  // Configurar fecha y hora por defecto
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  document.getElementById('trip-date').value = tomorrow.toISOString().split('T')[0];
  document.getElementById('trip-time').value = '08:00';
  
  // Eventos para inputs de ubicación
  const originInput = document.getElementById('origin-input');
  const destinationInput = document.getElementById('destination-input');
  
  originInput.addEventListener('input', actualizarResumenViaje);
  destinationInput.addEventListener('input', actualizarResumenViaje);
  
  // Configurar búsqueda de ubicaciones
  configurarAutocompletado(originInput);
  configurarAutocompletado(destinationInput);
}

function configurarSelectoresViaje() {
  const tripTypeButtons = document.querySelectorAll('.trip-type-btn');
  
  tripTypeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remover clase active de todos los botones
      tripTypeButtons.forEach(btn => btn.classList.remove('active'));
      
      // Agregar clase active al botón clickeado
      this.classList.add('active');
      
      // Actualizar resumen del viaje
      actualizarResumenViaje();
    });
  });
}

function configurarContadorPasajeros() {
  const passengerCount = document.getElementById('passenger-count');
  const btnIncrement = document.querySelector('.btn-count:last-child');
  const btnDecrement = document.querySelector('.btn-count:first-child');
  
  btnIncrement.addEventListener('click', function() {
    let count = parseInt(passengerCount.textContent);
    if (count < 6) {
      passengerCount.textContent = count + 1;
      actualizarResumenViaje();
    }
  });
  
  btnDecrement.addEventListener('click', function() {
    let count = parseInt(passengerCount.textContent);
    if (count > 1) {
      passengerCount.textContent = count - 1;
      actualizarResumenViaje();
    }
  });
}

function actualizarResumenViaje() {
  const origin = document.getElementById('origin-input').value;
  const destination = document.getElementById('destination-input').value;
  const tripType = document.querySelector('.trip-type-btn.active').getAttribute('data-type');
  const passengers = document.getElementById('passenger-count').textContent;
  
  const previewContent = document.getElementById('trip-preview-content');
  
  if (origin && destination) {
    // Calcular precio estimado (simulación)
    const basePrice = getBasePrice(tripType);
    const distance = calcularDistanciaEstimada(origin, destination);
    const totalPrice = (basePrice * distance * parseInt(passengers)).toFixed(2);
    
    previewContent.innerHTML = `
      <div class="trip-summary">
        <div class="summary-header">
          <h4>Resumen del Viaje</h4>
          <span class="trip-type-badge ${tripType}">${getTripTypeName(tripType)}</span>
        </div>
        
        <div class="route-summary">
          <div class="route-point">
            <i class="fas fa-map-marker-alt origin"></i>
            <span>${origin}</span>
          </div>
          <div class="route-line"></div>
          <div class="route-point">
            <i class="fas fa-map-marker-alt destination"></i>
            <span>${destination}</span>
          </div>
        </div>
        
        <div class="trip-details">
          <div class="detail-item">
            <i class="fas fa-route"></i>
            <span>Distancia estimada: ${distance.toFixed(1)} km</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-clock"></i>
            <span>Tiempo estimado: ${calcularTiempoEstimado(distance)} min</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-users"></i>
            <span>Pasajeros: ${passengers}</span>
          </div>
          <div class="detail-item price">
            <i class="fas fa-dollar-sign"></i>
            <span>Precio estimado: $${totalPrice}</span>
          </div>
        </div>
      </div>
    `;
  } else {
    previewContent.innerHTML = `
      <div class="preview-placeholder">
        <i class="fas fa-route"></i>
        <p>Ingresa origen y destino para ver el resumen</p>
      </div>
    `;
  }
}

function getBasePrice(tripType) {
  switch(tripType) {
    case 'standard': return 2.5;
    case 'premium': return 4.0;
    case 'pool': return 1.8;
    default: return 2.5;
  }
}

function getTripTypeName(tripType) {
  switch(tripType) {
    case 'standard': return 'Estándar';
    case 'premium': return 'Premium';
    case 'pool': return 'Compartido';
    default: return 'Estándar';
  }
}

function calcularDistanciaEstimada(origin, destination) {
  // Simulación de cálculo de distancia
  const origins = ['Centro', 'Norte', 'Sur', 'Este', 'Oeste'];
  const destinations = ['Centro', 'Norte', 'Sur', 'Este', 'Oeste'];
  
  const originIndex = origins.findIndex(o => origin.includes(o));
  const destIndex = destinations.findIndex(d => destination.includes(d));
  
  if (originIndex === -1 || destIndex === -1) return 3.5;
  
  const distances = [
    [0, 4.2, 3.8, 2.9, 3.1],
    [4.2, 0, 7.5, 6.8, 5.2],
    [3.8, 7.5, 0, 4.1, 6.9],
    [2.9, 6.8, 4.1, 0, 5.7],
    [3.1, 5.2, 6.9, 5.7, 0]
  ];
  
  return distances[originIndex][destIndex];
}

function calcularTiempoEstimado(distancia) {
  // Simulación: 2 minutos por km + 5 minutos base
  return Math.round(distancia * 2 + 5);
}

function configurarAutocompletado(input) {
  const suggestions = [
    'Centro Comercial Andino',
    'Centro Comercial Santafé',
    'Zona T',
    'Chapinero',
    'Usaquén',
    'Suba',
    'Kennedy',
    'Bosa',
    'Fontibón',
    'Engativá',
    'Barrios Unidos',
    'Teusaquillo',
    'Mártires',
    'Antonio Nariño',
    'Puente Aranda',
    'La Candelaria',
    'San Cristóbal',
    'Usme',
    'Sumapaz',
    'Ciudad Bolívar'
  ];
  
  input.addEventListener('input', function() {
    const value = this.value.toLowerCase();
    const filtered = suggestions.filter(s => s.toLowerCase().includes(value));
    
    // Aquí se implementaría el autocompletado real
    if (value.length > 2 && filtered.length > 0) {
      // Mostrar sugerencias
    }
  });
}

// ===== FUNCIONES DE UBICACIÓN =====
function usarUbicacionActual() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        // Simular obtención de dirección
        const direccion = obtenerDireccionPorCoordenadas(latitude, longitude);
        document.getElementById('origin-input').value = direccion;
        
        mostrarNotificacion('Ubicación actual obtenida', 'success');
        actualizarResumenViaje();
      },
      function(error) {
        mostrarNotificacion('No se pudo obtener tu ubicación', 'error');
      }
    );
  } else {
    mostrarNotificacion('Tu navegador no soporta geolocalización', 'error');
  }
}

function obtenerDireccionPorCoordenadas(lat, lng) {
  // Simulación de geocodificación inversa
  const direcciones = [
    'Calle 72 #11-86, Bogotá',
    'Carrera 15 #93-47, Bogotá',
    'Avenida 19 #120-71, Bogotá',
    'Calle 127 #19-35, Bogotá',
    'Carrera 7 #26-20, Bogotá'
  ];
  
  return direcciones[Math.floor(Math.random() * direcciones.length)];
}

function mostrarFavoritos() {
  const destinationInput = document.getElementById('destination-input');
  const favoritos = cargarFavoritosDelStorage();
  
  if (favoritos.length > 0) {
    const favorito = favoritos[Math.floor(Math.random() * favoritos.length)];
    destinationInput.value = favorito.nombre;
    actualizarResumenViaje();
    mostrarNotificacion('Destino favorito seleccionado', 'info');
  } else {
    mostrarNotificacion('No tienes lugares favoritos guardados', 'info');
  }
}

// ===== SOLICITUD DE VIAJE =====
function solicitarViaje() {
  const origin = document.getElementById('origin-input').value.trim();
  const destination = document.getElementById('destination-input').value.trim();
  
  if (!origin || !destination) {
    mostrarNotificacion('Por favor, ingresa origen y destino', 'error');
    return;
  }
  
  // Cambiar estado del botón
  const btnRequestTrip = document.getElementById('btn-request-trip');
  btnRequestTrip.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
  btnRequestTrip.disabled = true;
  
  // Simular búsqueda de conductor
  setTimeout(() => {
    mostrarConfirmacionViaje();
  }, 2000);
}

function mostrarConfirmacionViaje() {
  const modal = document.getElementById('trip-confirmation-modal');
  if (modal) {
    // Obtener datos del viaje
    const origin = document.getElementById('origin-input').value;
    const destination = document.getElementById('destination-input').value;
    const tripType = document.querySelector('.trip-type-btn.active').getAttribute('data-type');
    const passengers = document.getElementById('passenger-count').textContent;
    
    // Simular datos del conductor
    const conductor = {
      nombre: 'Carlos Rodríguez',
      rating: 4.9,
      vehiculo: 'Toyota Corolla - ABC123'
    };
    
    // Actualizar modal
    document.getElementById('modal-driver-name').textContent = conductor.nombre;
    document.getElementById('modal-driver-rating').textContent = conductor.rating;
    document.getElementById('modal-vehicle-info').textContent = conductor.vehiculo;
    document.getElementById('modal-trip-origin').textContent = origin;
    document.getElementById('modal-trip-destination').textContent = destination;
    
    // Calcular métricas
    const distance = calcularDistanciaEstimada(origin, destination);
    const price = (getBasePrice(tripType) * distance * parseInt(passengers)).toFixed(2);
    const time = calcularTiempoEstimado(distance);
    
    document.getElementById('modal-trip-distance').textContent = `${distance.toFixed(1)} km`;
    document.getElementById('modal-trip-price').textContent = `$${price}`;
    document.getElementById('modal-trip-duration').textContent = `${time} min`;
    
    // Mostrar modal
    modal.style.display = 'block';
  }
}

function confirmarViaje() {
  const modal = document.getElementById('trip-confirmation-modal');
  if (modal) {
    modal.style.display = 'none';
    
    // Crear viaje
    const nuevoViaje = {
      id: 'TRP' + Date.now().toString().slice(-4),
      origen: document.getElementById('origin-input').value,
      destino: document.getElementById('destination-input').value,
      conductor: document.getElementById('modal-driver-name').textContent,
      precio: document.getElementById('modal-trip-price').textContent,
      estado: 'En Curso',
      fecha: new Date().toISOString()
    };
    
    // Guardar en localStorage
    const viajes = JSON.parse(localStorage.getItem('viajesPasajero')) || [];
    viajes.push(nuevoViaje);
    localStorage.setItem('viajesPasajero', JSON.stringify(viajes));
    
    // Limpiar formulario
    document.getElementById('origin-input').value = '';
    document.getElementById('destination-input').value = '';
    
    // Restaurar botón
    const btnRequestTrip = document.getElementById('btn-request-trip');
    btnRequestTrip.innerHTML = '<i class="fas fa-search"></i> Buscar Conductor';
    btnRequestTrip.disabled = false;
    
    // Actualizar resumen
    actualizarResumenViaje();
    
    // Mostrar notificación
    mostrarNotificacion('¡Viaje confirmado! Tu conductor está en camino', 'success');
    
    // Recargar viajes recientes
    cargarViajesRecientes();
  }
}

function cancelarViaje() {
  const modal = document.getElementById('trip-confirmation-modal');
  if (modal) {
    modal.style.display = 'none';
    
    // Restaurar botón
    const btnRequestTrip = document.getElementById('btn-request-trip');
    btnRequestTrip.innerHTML = '<i class="fas fa-search"></i> Buscar Conductor';
    btnRequestTrip.disabled = false;
    
    mostrarNotificacion('Viaje cancelado', 'info');
  }
}

function closeTripConfirmationModal() {
  const modal = document.getElementById('trip-confirmation-modal');
  if (modal) {
    modal.style.display = 'none';
    
    // Restaurar botón
    const btnRequestTrip = document.getElementById('btn-request-trip');
    btnRequestTrip.innerHTML = '<i class="fas fa-search"></i> Buscar Conductor';
    btnRequestTrip.disabled = false;
  }
}

// ===== DATOS DEL DASHBOARD =====
function cargarDatosDashboard() {
  // Cargar métricas
  cargarMetricas();
  
  // Cargar historial de viajes
  cargarHistorialViajes();
  
  // Cargar perfil del pasajero
  cargarPerfilPasajero();
}

function cargarMetricas() {
  // Simular datos de métricas
  const metricas = {
    viajesTotales: 47,
    ratingPromedio: 4.8,
    gastoTotal: 247.50,
    diasActivo: 23
  };
  
  // Actualizar valores en el DOM
  Object.keys(metricas).forEach(key => {
    const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
    if (element) {
      if (key === 'gastoTotal') {
        element.textContent = `$${metricas[key]}`;
      } else {
        element.textContent = metricas[key];
      }
    }
  });
}

function cargarViajesRecientes() {
  const viajesRecientes = [
    {
      fecha: '15/01/2024',
      conductor: 'Carlos Rodríguez',
      origen: 'Centro Comercial',
      destino: 'Zona Norte',
      precio: '$8.50',
      rating: 5
    },
    {
      fecha: '14/01/2024',
      conductor: 'Ana Martínez',
      origen: 'Zona Sur',
      destino: 'Centro',
      precio: '$12.80',
      rating: 4
    }
  ];
  
  const recentTripsGrid = document.getElementById('recent-trips-grid');
  if (recentTripsGrid) {
    recentTripsGrid.innerHTML = viajesRecientes.map(viaje => `
      <div class="recent-trip-card">
        <div class="trip-header">
          <div class="trip-date">${viaje.fecha}</div>
          <div class="trip-rating">
            ${'★'.repeat(viaje.rating)}${'☆'.repeat(5 - viaje.rating)}
          </div>
        </div>
        <div class="trip-route">
          <div class="route-point">
            <i class="fas fa-map-marker-alt origin"></i>
            <span>${viaje.origen}</span>
          </div>
          <div class="route-line"></div>
          <div class="route-point">
            <i class="fas fa-map-marker-alt destination"></i>
            <span>${viaje.destino}</span>
          </div>
        </div>
        <div class="trip-footer">
          <div class="conductor-info">
            <img src="../style/image/cosa.jpg" alt="Conductor" class="conductor-avatar">
            <span>${viaje.conductor}</span>
          </div>
          <div class="trip-price">${viaje.precio}</div>
        </div>
      </div>
    `).join('');
  }
}

function cargarHistorialViajes() {
  const historialViajes = [
    {
      fecha: '15/01/2024',
      conductor: 'Carlos Rodríguez',
      origen: 'Centro Comercial',
      destino: 'Zona Norte',
      precio: '$8.50',
      estado: 'Completado',
      rating: 5
    },
    {
      fecha: '14/01/2024',
      conductor: 'Ana Martínez',
      origen: 'Zona Sur',
      destino: 'Centro',
      precio: '$12.80',
      estado: 'Completado',
      rating: 4
    }
  ];
  
  const tripsTableBody = document.getElementById('trips-table-body');
  if (tripsTableBody) {
    tripsTableBody.innerHTML = historialViajes.map(viaje => `
      <tr>
        <td>${viaje.fecha}</td>
        <td>${viaje.conductor}</td>
        <td>${viaje.origen}</td>
        <td>${viaje.destino}</td>
        <td>${viaje.precio}</td>
        <td><span class="trip-status ${viaje.estado.toLowerCase()}">${viaje.estado}</span></td>
        <td>
          <span class="rating-stars">
            ${'★'.repeat(viaje.rating)}${'☆'.repeat(5 - viaje.rating)}
          </span>
          <span class="rating-value">${viaje.rating}.0</span>
        </td>
        <td>
          <div class="trip-actions">
            <button class="btn-action ver" onclick="verDetalleViaje('${viaje.fecha}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-action repetir" onclick="repetirViaje('${viaje.fecha}')">
              <i class="fas fa-redo"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

function cargarMetodosPago() {
  const historialPagos = [
    {
      fecha: '15/01/2024',
      descripcion: 'Viaje Centro → Norte',
      metodo: 'Visa ****1234',
      monto: '$8.50',
      estado: 'Completado'
    },
    {
      fecha: '14/01/2024',
      descripcion: 'Viaje Sur → Centro',
      metodo: 'Mastercard ****5678',
      monto: '$12.80',
      estado: 'Completado'
    }
  ];
  
  const paymentHistoryBody = document.getElementById('payment-history-body');
  if (paymentHistoryBody) {
    paymentHistoryBody.innerHTML = historialPagos.map(pago => `
      <tr>
        <td>${pago.fecha}</td>
        <td>${pago.descripcion}</td>
        <td>${pago.metodo}</td>
        <td>${pago.monto}</td>
        <td><span class="payment-status ${pago.estado.toLowerCase()}">${pago.estado}</span></td>
      </tr>
    `).join('');
  }
}

function cargarLugaresFavoritos() {
  const favoritos = [
    {
      nombre: 'Centro Comercial Andino',
      direccion: 'Calle 82 #11-86',
      tipo: 'shopping',
      frecuencia: 12
    },
    {
      nombre: 'Oficina',
      direccion: 'Carrera 15 #93-47',
      tipo: 'work',
      frecuencia: 20
    },
    {
      nombre: 'Casa',
      direccion: 'Calle 127 #19-35',
      tipo: 'home',
      frecuencia: 25
    }
  ];
  
  const favoritesGrid = document.getElementById('favorites-grid');
  if (favoritesGrid) {
    favoritesGrid.innerHTML = favoritos.map(favorito => `
      <div class="favorite-card ${favorito.tipo}">
        <div class="favorite-icon">
          <i class="fas fa-${getFavoriteIcon(favorito.tipo)}"></i>
        </div>
        <div class="favorite-info">
          <h4>${favorito.nombre}</h4>
          <p>${favorito.direccion}</p>
          <small>${favorito.frecuencia} viajes</small>
        </div>
        <div class="favorite-actions">
          <button class="btn-use-favorite" onclick="usarFavorito('${favorito.nombre}')">
            <i class="fas fa-route"></i>
          </button>
          <button class="btn-edit-favorite" onclick="editarFavorito('${favorito.nombre}')">
            <i class="fas fa-edit"></i>
          </button>
        </div>
      </div>
    `).join('');
  }
}

function getFavoriteIcon(tipo) {
  switch(tipo) {
    case 'home': return 'home';
    case 'work': return 'briefcase';
    case 'shopping': return 'shopping-bag';
    case 'restaurant': return 'utensils';
    default: return 'map-marker-alt';
  }
}

function cargarPerfilPasajero() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (usuario) {
    document.getElementById('profile-nombre').textContent = usuario.nombre;
    document.getElementById('profile-email').textContent = usuario.correo;
    document.getElementById('profile-phone').textContent = usuario.telefono || '+57 300 123 4567';
  }
}

// ===== FUNCIONES UTILITARIAS =====
function actualizarFechaHora() {
  const now = new Date();
  const currentTime = document.getElementById('current-time');
  
  if (currentTime) {
    currentTime.textContent = now.toLocaleTimeString('es-ES');
  }
}

function actualizarEstadisticasUsuario() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (!usuario) return;
  
  // Obtener viajes del localStorage
  const viajes = JSON.parse(localStorage.getItem('viajesPasajero')) || [];
  const viajesRealizados = viajes.filter(viaje => viaje.estado === 'Completado').length;
  
  // Actualizar contador de viajes
  const totalViajesElement = document.getElementById('total-viajes');
  if (totalViajesElement) {
    totalViajesElement.textContent = viajesRealizados;
  }
}

function cargarNotificaciones() {
  const notificaciones = [
    {
      titulo: 'Viaje completado',
      mensaje: 'Tu viaje a Zona Norte ha sido completado',
      tiempo: 'Hace 5 min',
      tipo: 'success'
    }
  ];
  
  const notificationCount = document.getElementById('notification-count');
  if (notificationCount) {
    notificationCount.textContent = notificaciones.length;
  }
}

// ===== FUNCIONES DE ACCIÓN =====
function verDetalleViaje(fecha) {
  console.log(`Viendo detalle del viaje del ${fecha}`);
  // Implementar modal de detalle
  mostrarNotificacion('Función en desarrollo', 'info');
}

function repetirViaje(fecha) {
  console.log(`Repitiendo viaje del ${fecha}`);
  // Implementar lógica de repetición
  mostrarNotificacion('Viaje agregado al formulario', 'success');
}

function usarFavorito(nombre) {
  document.getElementById('destination-input').value = nombre;
  actualizarResumenViaje();
  mostrarNotificacion('Destino favorito seleccionado', 'success');
}

function editarFavorito(nombre) {
  console.log(`Editando favorito: ${nombre}`);
  // Implementar modal de edición
  mostrarNotificacion('Función en desarrollo', 'info');
}

function agregarFavorito() {
  console.log('Agregando nuevo favorito');
  // Implementar modal de agregar favorito
  mostrarNotificacion('Función en desarrollo', 'info');
}

function agregarMetodoPago() {
  console.log('Agregando método de pago');
  // Implementar modal de agregar método de pago
  mostrarNotificacion('Función en desarrollo', 'info');
}

function editarMetodoPago(methodId) {
  console.log(`Editando método de pago: ${methodId}`);
  // Implementar modal de edición
  mostrarNotificacion('Función en desarrollo', 'info');
}

function eliminarMetodoPago(methodId) {
  if (confirm('¿Estás seguro de eliminar este método de pago?')) {
    console.log(`Eliminando método de pago: ${methodId}`);
    // Implementar lógica de eliminación
    mostrarNotificacion('Método de pago eliminado', 'success');
  }
}

function verTodosLosViajes() {
  // Cambiar a la sección de viajes
  const navItem = document.querySelector('[data-section="viajes"]');
  if (navItem) {
    navItem.click();
  }
}

function exportarHistorial() {
  console.log('Exportando historial de viajes...');
  // Implementar exportación
  mostrarNotificacion('Exportación iniciada', 'info');
}

function editarPerfil() {
  console.log('Editando perfil del pasajero');
  // Implementar modal de edición
  mostrarNotificacion('Función en desarrollo', 'info');
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

// ===== FUNCIONES DE BÚSQUEDA =====
function configurarBusquedaUsuarios() {
  const searchInput = document.getElementById('search-usuarios');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      // Implementar búsqueda en tiempo real
      console.log('Buscando:', searchTerm);
    });
  }
}

// ===== FUNCIONES DE CERRADO DE SESIÓN =====
function cerrarSesion() {
  if (confirm('¿Estás seguro de cerrar sesión?')) {
    sessionStorage.removeItem('usuarioLogueado');
    window.location.href = '../index.html';
  }
}

// ===== FUNCIONES DE FAVORITOS =====
function cargarFavoritosDelStorage() {
  // Simular favoritos del localStorage
  return [
    { nombre: 'Centro Comercial Andino', direccion: 'Calle 82 #11-86' },
    { nombre: 'Oficina', direccion: 'Carrera 15 #93-47' },
    { nombre: 'Casa', direccion: 'Calle 127 #19-35' }
  ];
}

// ===== ESTILOS CSS DINÁMICOS =====
const dinamicstyle = document.createElement('style');
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
  
  .trip-type-badge.standard {
    background-color: #3b82f6;
  }
  
  .trip-type-badge.premium {
    background-color: #f59e0b;
  }
  
  .trip-type-badge.pool {
    background-color: #10b981;
  }
  
  .favorite-card.home {
    border-left: 4px solid #ef4444;
  }
  
  .favorite-card.work {
    border-left: 4px solid #3b82f6;
  }
  
  .favorite-card.shopping {
    border-left: 4px solid #8b5cf6;
  }
  
  .favorite-card.restaurant {
    border-left: 4px solid #f59e0b;
  }
`;
document.head.appendChild(style);