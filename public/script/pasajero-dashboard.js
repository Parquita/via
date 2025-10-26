// ===== DASHBOARD PASAJERO VIA =====

// Supabase client setup
// Using global Supabase from CDN

const supabaseUrl = 'https://rjfsuxiaoovjyljaarhg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnN1eGlhb292anlsamFhcmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDU1NzksImV4cCI6MjA3MzAyMTU3OX0.NtlbSC92JOLvG76OwggSNsHwYv-1ve9ebB_D4DXW9UE';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Map variables
let map;
let markers = [];
let clickCount = 0;
let geocoder;

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

  // Inicializar mapa
  inicializarMapa();

  // Configurar event listeners para modales
  configurarEventListenersModales();
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
    // Calcular distancia real usando coordenadas de marcadores
    const distance = calcularDistanciaReal();
    const time = calcularTiempoReal(distance);
    const price = calcularPrecioReal(distance, time, passengers);

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
            <span>Distancia: ${distance.toFixed(1)} km</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-clock"></i>
            <span>Tiempo estimado: ${time} min</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-users"></i>
            <span>Pasajeros: ${passengers}</span>
          </div>
          <div class="detail-item price">
            <i class="fas fa-dollar-sign"></i>
            <span>Precio estimado: $${price} COP</span>
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
    case 'standard': return 8000; // COP por km
    case 'premium': return 12000; // COP por km
    case 'pool': return 6000; // COP por km
    default: return 8000;
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

// ===== FUNCIONES DE CÁLCULO REAL =====
function calcularDistanciaReal() {
  if (markers.length < 2) return 0;

  const lat1 = markers[0].getLatLng().lat;
  const lng1 = markers[0].getLatLng().lng;
  const lat2 = markers[1].getLatLng().lat;
  const lng2 = markers[1].getLatLng().lng;

  // Fórmula de Haversine para calcular distancia entre dos puntos
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  return distance;
}

function calcularTiempoReal(distance) {
  // Asumir velocidad promedio de 30 km/h en ciudad
  const velocidadPromedio = 30; // km/h
  const tiempoHoras = distance / velocidadPromedio;
  const tiempoMinutos = tiempoHoras * 60;

  // Agregar tiempo base de 3 minutos para recoger/pagar
  return Math.round(tiempoMinutos + 3);
}

function calcularPrecioReal(distance, time, passengers) {
  // Validar y convertir parámetros
  const distanceNum = parseFloat(distance) || 0;
  const timeNum = parseFloat(time) || 0;
  const passengersNum = parseInt(passengers) || 1;

  // Validar que los valores sean positivos
  if (distanceNum <= 0 || timeNum <= 0 || passengersNum <= 0) {
    return 0;
  }

  const tripType = document.querySelector('.trip-type-btn.active')?.getAttribute('data-type') || 'standard';
  const basePrice = getBasePrice(tripType);

  // Precio base por distancia
  const distancePrice = basePrice * distanceNum;

  // Componente por tiempo (menor)
  const timePrice = (basePrice * 0.3) * (timeNum / 60); // precio por hora

  // Multiplicar por número de pasajeros
  const totalPrice = (distancePrice + timePrice) * passengersNum;

  return Math.round(totalPrice);
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

async function confirmarViaje() {
  const modal = document.getElementById('trip-confirmation-modal');
  if (modal) {
    modal.style.display = 'none';

    // Obtener usuario logueado
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (!usuario) {
      mostrarNotificacion('Error: Usuario no encontrado', 'error');
      return;
    }

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

    try {
      // Insertar en Supabase
      const { data, error } = await supabase
        .from('viajes')
        .insert([nuevoViaje])
        .select();

      if (error) {
        console.error('Error al guardar viaje en base de datos:', error);
        mostrarNotificacion('Error al guardar viaje en base de datos', 'error');
        return;
      }

      console.log('Viaje guardado en base de datos:', data);

      // Guardar en localStorage también (para compatibilidad)
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
    } catch (err) {
      console.error('Error inesperado:', err);
      mostrarNotificacion('Error inesperado al confirmar viaje', 'error');
    }
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

async function cargarMetricas() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (!usuario) return;

  try {
    // Obtener todos los viajes desde Supabase
    const { data: viajes, error } = await supabase
      .from('viajes')
      .select('*');

    if (error) {
      console.error('Error al cargar métricas:', error);
      mostrarNotificacion('Error al cargar métricas', 'error');
      return;
    }

    // Calcular métricas reales
    const viajesCompletados = viajes.filter(viaje => viaje.estado === 'Completado');
    const viajesTotales = viajesCompletados.length;

    // Calcular rating promedio
    const ratings = viajesCompletados.map(v => v.rating || 5).filter(r => r > 0);
    const ratingPromedio = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;

    // Calcular gasto total
    const gastoTotal = viajesCompletados.reduce((total, viaje) => {
      const precio = parseFloat(viaje.precio ? viaje.precio.replace('$', '') : '0');
      return total + (isNaN(precio) ? 0 : precio);
    }, 0);

    // Calcular días activo (desde el primer viaje hasta hoy)
    const fechas = viajes.map(v => new Date(v.fecha));
    const fechaMasAntigua = fechas.length > 0 ? new Date(Math.min(...fechas)) : new Date();
    const diasActivo = Math.ceil((new Date() - fechaMasAntigua) / (1000 * 60 * 60 * 24));

    const metricas = {
      viajesTotales: viajesTotales,
      ratingPromedio: ratingPromedio,
      gastoTotal: gastoTotal.toFixed(2),
      diasActivo: diasActivo
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
  } catch (err) {
    console.error('Error inesperado al cargar métricas:', err);
    mostrarNotificacion('Error al cargar métricas', 'error');
  }
}

async function cargarViajesRecientes() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (!usuario) return;

  try {
    // Obtener viajes recientes desde Supabase
    const { data: viajesRecientes, error } = await supabase
      .from('viajes')
      .select('*')
      .order('hora_inicio', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error al cargar viajes recientes:', error);
      mostrarNotificacion('Error al cargar viajes recientes', 'error');
      return;
    }

    const recentTripsGrid = document.getElementById('recent-trips-grid');
    if (recentTripsGrid) {
      if (viajesRecientes && viajesRecientes.length > 0) {
        recentTripsGrid.innerHTML = viajesRecientes.map(viaje => {
          const fecha = new Date(viaje.fecha).toLocaleDateString('es-ES');
          const rating = viaje.rating || 5; // Valor por defecto si no hay rating

          return `
            <div class="recent-trip-card">
              <div class="trip-header">
                <div class="trip-date">${fecha}</div>
                <div class="trip-rating">
                  ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}
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
          `;
        }).join('');
      } else {
        // Si no hay viajes, mostrar mensaje
        recentTripsGrid.innerHTML = `
          <div class="no-trips-message">
            <i class="fas fa-route"></i>
            <p>No tienes viajes recientes</p>
          </div>
        `;
      }
    }
  } catch (err) {
    console.error('Error inesperado al cargar viajes recientes:', err);
    mostrarNotificacion('Error al cargar viajes recientes', 'error');
  }
}

async function cargarHistorialViajes() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (!usuario) return;

  try {
    // Obtener historial completo de viajes desde Supabase
    const { data: historialViajes, error } = await supabase
      .from('viajes')
      .select('*')
      .order('hora_inicio', { ascending: false });

    if (error) {
      console.error('Error al cargar historial de viajes:', error);
      mostrarNotificacion('Error al cargar historial de viajes', 'error');
      return;
    }

    const tripsTableBody = document.getElementById('trips-table-body');
    if (tripsTableBody) {
      if (historialViajes && historialViajes.length > 0) {
        tripsTableBody.innerHTML = historialViajes.map(viaje => {
          const fecha = new Date(viaje.fecha).toLocaleDateString('es-ES');
          const rating = viaje.rating || 5; // Valor por defecto si no hay rating

          return `
            <tr>
              <td>${fecha}</td>
              <td>${viaje.conductor}</td>
              <td>${viaje.origen}</td>
              <td>${viaje.destino}</td>
              <td>${viaje.precio}</td>
              <td><span class="trip-status ${viaje.estado.toLowerCase()}">${viaje.estado}</span></td>
              <td>
                <span class="rating-stars">
                  ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}
                </span>
                <span class="rating-value">${rating}.0</span>
              </td>
              <td>
                <div class="trip-actions">
                  <button class="btn-action ver" onclick="verDetalleViaje('${viaje.id}')">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-action repetir" onclick="repetirViaje('${viaje.id}')">
                    <i class="fas fa-redo"></i>
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      } else {
        // Si no hay viajes, mostrar mensaje
        tripsTableBody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 2rem;">
              <i class="fas fa-route" style="font-size: 2rem; color: #ccc; margin-bottom: 1rem;"></i>
              <p>No tienes viajes registrados</p>
            </td>
          </tr>
        `;
      }
    }
  } catch (err) {
    console.error('Error inesperado al cargar historial de viajes:', err);
    mostrarNotificacion('Error al cargar historial de viajes', 'error');
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

// ===== FUNCIONES DE MAPA =====
function inicializarMapa() {
  // Intentar obtener ubicación actual del usuario
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // Inicializar mapa centrado en la ubicación del usuario
        inicializarMapaEnCoordenadas(lat, lng);
      },
      function(error) {
        console.log('No se pudo obtener ubicación, usando Medellín por defecto');
        // Si no se puede obtener ubicación, usar Medellín
        inicializarMapaEnCoordenadas(6.2442, -75.5812);
      }
    );
  } else {
    // Si no hay soporte de geolocalización, usar Medellín
    inicializarMapaEnCoordenadas(6.2442, -75.5812);
  }
}

function inicializarMapaEnCoordenadas(lat, lng) {
  // Inicializar mapa centrado en las coordenadas proporcionadas
  map = L.map('trip-map').setView([lat, lng], 13);

  // Agregar capa de tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Agregar control de escala
  L.control.scale().addTo(map);

  // Evento de clic en el mapa
  map.on('click', function(e) {
    colocarMarcador(e.latlng);
  });

  // Limpiar marcadores al cambiar inputs
  document.getElementById('origin-input').addEventListener('input', limpiarMarcadores);
  document.getElementById('destination-input').addEventListener('input', limpiarMarcadores);
}

async function colocarMarcador(latlng) {
  if (clickCount >= 2) {
    // Limpiar marcadores si ya hay 2
    limpiarMarcadores();
    clickCount = 0;
  }

  const marker = L.marker(latlng, {
    draggable: true,
    icon: clickCount === 0 ?
      L.divIcon({
        className: 'custom-marker origin-marker',
        html: '<i class="fas fa-map-marker-alt"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      }) :
      L.divIcon({
        className: 'custom-marker destination-marker',
        html: '<i class="fas fa-map-marker-alt"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      })
  }).addTo(map);

  // Evento de drag para actualizar inputs
  marker.on('dragend', async function(e) {
    await actualizarInputDesdeMarcador(e.target, e.target.getLatLng());
  });

  markers.push(marker);

  // Automáticamente obtener y establecer la dirección aproximada
  const inputId = clickCount === 0 ? 'origin-input' : 'destination-input';
  await obtenerDireccionAproximada(latlng, inputId);

  // Mostrar notificación de dirección seleccionada
  mostrarNotificacion('Dirección seleccionada automáticamente', 'success');

  clickCount++;

  // Actualizar resumen del viaje después de colocar el marcador
  setTimeout(() => {
    actualizarResumenViaje();
  }, 100);
}

async function obtenerDireccionAproximada(latlng, inputId) {
  const lat = latlng.lat;
  const lng = latlng.lng;

  try {
    // Intentar usar Nominatim API para geocodificación inversa (OpenStreetMap)
    // Nota: Esta API puede tener restricciones CORS, por lo que implementamos fallback
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout de 5 segundos

    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=es`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Error en la geocodificación');
    }

    const data = await response.json();

    if (data && data.display_name) {
      // Limpiar y formatear la dirección obtenida
      let direccion = data.display_name;

      // Si hay información de dirección más detallada, usarla
      if (data.address) {
        const addr = data.address;
        const partes = [];

        // Construir dirección en formato colombiano
        if (addr.road) {
          // Convertir nombres de calles comunes
          let calle = addr.road;
          if (calle.toLowerCase().includes('street')) {
            calle = calle.replace(/street/i, 'Calle');
          } else if (calle.toLowerCase().includes('avenue') || calle.toLowerCase().includes('ave')) {
            calle = calle.replace(/avenue|ave/i, 'Avenida');
          }

          partes.push(calle);
        }

        if (addr.house_number) {
          partes.push('#' + addr.house_number);
        }

        if (addr.neighbourhood || addr.suburb) {
          partes.push(addr.neighbourhood || addr.suburb);
        }

        if (addr.city || addr.town || addr.village) {
          partes.push(addr.city || addr.town || addr.village);
        }

        if (addr.state || addr.region) {
          partes.push(addr.state || addr.region);
        }

        if (addr.country) {
          partes.push(addr.country);
        }

        if (partes.length > 0) {
          direccion = partes.join(', ');
        }
      }

      // Limitar longitud y limpiar caracteres extraños
      direccion = direccion.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '');
      if (direccion.length > 100) {
        direccion = direccion.substring(0, 97) + '...';
      }

      document.getElementById(inputId).value = direccion;
    } else {
      // Fallback a dirección simulada si no se encuentra dirección
      const direccionSimulada = generarDireccionSimulada(lat, lng);
      document.getElementById(inputId).value = direccionSimulada;
    }
  } catch (error) {
    console.warn('Error obteniendo dirección desde API externa, usando dirección simulada:', error.message);
    // Fallback a dirección simulada en caso de error (CORS, timeout, etc.)
    const direccionSimulada = generarDireccionSimulada(lat, lng);
    document.getElementById(inputId).value = direccionSimulada;
    // No mostrar notificación de error para evitar molestar al usuario
  }
}

// Función para generar una dirección simulada basada en coordenadas
function generarDireccionSimulada(lat, lng) {
  // Crear un hash determinístico basado en las coordenadas para consistencia
  const hash = Math.abs(Math.floor((lat * lng * 10000) % 1000));

  // Determinar ciudad aproximada basada en coordenadas conocidas
  let ciudad = 'Colombia';

  if (lat >= 6.0 && lat <= 6.5 && lng >= -75.8 && lng <= -75.3) {
    // Medellín
    if (lat >= 6.20 && lat <= 6.25 && lng >= -75.55 && lng <= -75.50) {
      ciudad = 'El Poblado, Medellín';
    } else if (lat >= 6.23 && lat <= 6.27 && lng >= -75.58 && lng <= -75.55) {
      ciudad = 'Laureles, Medellín';
    } else {
      ciudad = 'Centro, Medellín';
    }
  } else if (lat >= 4.5 && lat <= 4.8 && lng >= -74.2 && lng <= -74.0) {
    // Bogotá
    if (lat >= 4.65 && lat <= 4.70 && lng >= -74.05 && lng <= -74.03) {
      ciudad = 'Usaquén, Bogotá';
    } else if (lat >= 4.63 && lat <= 4.67 && lng >= -74.08 && lng <= -74.05) {
      ciudad = 'Chapinero, Bogotá';
    } else {
      ciudad = 'Centro, Bogotá';
    }
  }

  // Generar dirección simulada
  const tiposCalle = ['Calle', 'Carrera', 'Avenida', 'Diagonal'];
  const tipoCalle = tiposCalle[hash % tiposCalle.length];
  const numeroCalle = 10 + (hash % 90);
  const numeroCasa = 10 + ((hash * 7) % 90);

  return `${tipoCalle} ${numeroCalle} #${numeroCasa}-${10 + (hash % 90)}, ${ciudad}`;
}

function actualizarInputDesdeMarcador(marker, latlng) {
  const index = markers.indexOf(marker);
  const inputId = index === 0 ? 'origin-input' : 'destination-input';
  obtenerDireccionAproximada(latlng, inputId);
  actualizarResumenViaje();
}

function mostrarModalSeleccionCalle(latlng, inputId) {
  // Crear modal si no existe
  let modal = document.getElementById('street-selection-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'street-selection-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content street-selection-content">
        <div class="modal-header">
          <h3>Seleccionar Dirección</h3>
          <span class="close" id="close-street-modal">&times;</span>
        </div>
        <div class="modal-body">
          <p>Selecciona la dirección más cercana a tu ubicación:</p>
          <div id="street-options" class="street-options">
            <!-- Opciones se cargarán aquí -->
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" id="cancel-street-selection">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Agregar event listeners después de crear el modal
    document.getElementById('close-street-modal').addEventListener('click', cerrarModalSeleccionCalle);
    document.getElementById('cancel-street-selection').addEventListener('click', cerrarModalSeleccionCalle);
  }

  // Generar opciones de direcciones basadas en las coordenadas
  const opciones = generarOpcionesDirecciones(latlng);

  const streetOptions = modal.querySelector('#street-options');
  streetOptions.innerHTML = opciones.map((opcion, index) => `
    <div class="street-option" data-direccion="${opcion.direccion}" data-input="${inputId}">
      <div class="street-info">
        <strong>${opcion.direccion}</strong>
        <small>${opcion.distancia} metros de distancia</small>
      </div>
      <div class="street-select">
        <i class="fas fa-chevron-right"></i>
      </div>
    </div>
  `).join('');

  // Agregar event listeners a las opciones
  const streetOptionElements = streetOptions.querySelectorAll('.street-option');
  streetOptionElements.forEach(option => {
    option.addEventListener('click', function() {
      const direccion = this.getAttribute('data-direccion');
      const inputId = this.getAttribute('data-input');
      seleccionarDireccion(direccion, inputId);
    });
  });

  // Mostrar modal
  modal.style.display = 'block';
}

function generarOpcionesDirecciones(latlng) {
  const lat = latlng.lat;
  const lng = latlng.lng;

  // Crear un hash determinístico basado en las coordenadas
  const hash = Math.abs(Math.floor((lat * lng * 10000) % 1000));

  let opciones = [];

  // Determinar ciudad y zona
  if (lat >= 6.0 && lat <= 6.5 && lng >= -75.8 && lng <= -75.3) {
    // Medellín
    if (lat >= 6.20 && lat <= 6.25 && lng >= -75.55 && lng <= -75.50) {
      // El Poblado
      opciones = [
        { direccion: `Calle 10 #${15 + (hash % 85)}-${10 + (hash % 90)}, El Poblado, Medellín`, distancia: Math.floor(Math.random() * 50) + 10 },
        { direccion: `Carrera 43A #${15 + (hash % 85)}-${10 + (hash % 90)}, El Poblado, Medellín`, distancia: Math.floor(Math.random() * 50) + 20 },
        { direccion: `Calle 8 #${15 + (hash % 85)}-${10 + (hash % 90)}, El Poblado, Medellín`, distancia: Math.floor(Math.random() * 50) + 30 },
        { direccion: `Carrera 39 #${15 + (hash % 85)}-${10 + (hash % 90)}, El Poblado, Medellín`, distancia: Math.floor(Math.random() * 50) + 40 }
      ];
    } else if (lat >= 6.23 && lat <= 6.27 && lng >= -75.58 && lng <= -75.55) {
      // Laureles
      opciones = [
        { direccion: `Carrera 70 #${30 + (hash % 70)}-${10 + (hash % 90)}, Laureles, Medellín`, distancia: Math.floor(Math.random() * 50) + 10 },
        { direccion: `Calle 33 #${30 + (hash % 70)}-${10 + (hash % 90)}, Laureles, Medellín`, distancia: Math.floor(Math.random() * 50) + 20 },
        { direccion: `Carrera 65 #${30 + (hash % 70)}-${10 + (hash % 90)}, Laureles, Medellín`, distancia: Math.floor(Math.random() * 50) + 30 },
        { direccion: `Calle 30 #${30 + (hash % 70)}-${10 + (hash % 90)}, Laureles, Medellín`, distancia: Math.floor(Math.random() * 50) + 40 }
      ];
    } else {
      // Centro de Medellín
      opciones = [
        { direccion: `Carrera 52 #${45 + (hash % 55)}-${10 + (hash % 90)}, Centro, Medellín`, distancia: Math.floor(Math.random() * 50) + 10 },
        { direccion: `Calle 52 #${45 + (hash % 55)}-${10 + (hash % 90)}, Centro, Medellín`, distancia: Math.floor(Math.random() * 50) + 20 },
        { direccion: `Carrera 50 #${45 + (hash % 55)}-${10 + (hash % 90)}, Centro, Medellín`, distancia: Math.floor(Math.random() * 50) + 30 },
        { direccion: `Calle 50 #${45 + (hash % 55)}-${10 + (hash % 90)}, Centro, Medellín`, distancia: Math.floor(Math.random() * 50) + 40 }
      ];
    }
  } else if (lat >= 4.5 && lat <= 4.8 && lng >= -74.2 && lng <= -74.0) {
    // Bogotá
    if (lat >= 4.65 && lat <= 4.70 && lng >= -74.05 && lng <= -74.03) {
      // Usaquén
      opciones = [
        { direccion: `Carrera 7 #${115 + (hash % 25)}-${10 + (hash % 90)}, Usaquén, Bogotá`, distancia: Math.floor(Math.random() * 50) + 10 },
        { direccion: `Calle 127 #${115 + (hash % 25)}-${10 + (hash % 90)}, Usaquén, Bogotá`, distancia: Math.floor(Math.random() * 50) + 20 },
        { direccion: `Carrera 6 #${115 + (hash % 25)}-${10 + (hash % 90)}, Usaquén, Bogotá`, distancia: Math.floor(Math.random() * 50) + 30 },
        { direccion: `Calle 126 #${115 + (hash % 25)}-${10 + (hash % 90)}, Usaquén, Bogotá`, distancia: Math.floor(Math.random() * 50) + 40 }
      ];
    } else if (lat >= 4.63 && lat <= 4.67 && lng >= -74.08 && lng <= -74.05) {
      // Chapinero
      opciones = [
        { direccion: `Carrera 7 #${55 + (hash % 25)}-${10 + (hash % 90)}, Chapinero, Bogotá`, distancia: Math.floor(Math.random() * 50) + 10 },
        { direccion: `Calle 67 #${55 + (hash % 25)}-${10 + (hash % 90)}, Chapinero, Bogotá`, distancia: Math.floor(Math.random() * 50) + 20 },
        { direccion: `Carrera 9 #${55 + (hash % 25)}-${10 + (hash % 90)}, Chapinero, Bogotá`, distancia: Math.floor(Math.random() * 50) + 30 },
        { direccion: `Calle 65 #${55 + (hash % 25)}-${10 + (hash % 90)}, Chapinero, Bogotá`, distancia: Math.floor(Math.random() * 50) + 40 }
      ];
    } else {
      // Centro de Bogotá
      opciones = [
        { direccion: `Carrera 7 #${10 + (hash % 25)}-${10 + (hash % 90)}, Centro, Bogotá`, distancia: Math.floor(Math.random() * 50) + 10 },
        { direccion: `Calle 72 #${10 + (hash % 25)}-${10 + (hash % 90)}, Centro, Bogotá`, distancia: Math.floor(Math.random() * 50) + 20 },
        { direccion: `Carrera 8 #${10 + (hash % 25)}-${10 + (hash % 90)}, Centro, Bogotá`, distancia: Math.floor(Math.random() * 50) + 30 },
        { direccion: `Calle 70 #${10 + (hash % 25)}-${10 + (hash % 90)}, Centro, Bogotá`, distancia: Math.floor(Math.random() * 50) + 40 }
      ];
    }
  } else {
    // Otras ubicaciones
    opciones = [
      { direccion: `Calle ${10 + (hash % 90)} #${10 + (hash % 90)}-${10 + (hash % 90)}, ${lat.toFixed(4)}, ${lng.toFixed(4)}`, distancia: Math.floor(Math.random() * 50) + 10 },
      { direccion: `Carrera ${10 + (hash % 90)} #${10 + (hash % 90)}-${10 + (hash % 90)}, ${lat.toFixed(4)}, ${lng.toFixed(4)}`, distancia: Math.floor(Math.random() * 50) + 20 },
      { direccion: `Avenida ${10 + (hash % 90)} #${10 + (hash % 90)}-${10 + (hash % 90)}, ${lat.toFixed(4)}, ${lng.toFixed(4)}`, distancia: Math.floor(Math.random() * 50) + 30 },
      { direccion: `Diagonal ${10 + (hash % 90)} #${10 + (hash % 90)}-${10 + (hash % 90)}, ${lat.toFixed(4)}, ${lng.toFixed(4)}`, distancia: Math.floor(Math.random() * 50) + 40 }
    ];
  }

  return opciones;
}

function seleccionarDireccion(direccion, inputId) {
  // Colocar la dirección seleccionada en el input correspondiente
  document.getElementById(inputId).value = direccion;

  // Cerrar modal
  cerrarModalSeleccionCalle();

  // Actualizar resumen si hay ambos puntos
  if (clickCount === 1) {
    actualizarResumenViaje();
  }

  // Mostrar notificación
  mostrarNotificacion('Dirección seleccionada correctamente', 'success');
}

function cerrarModalSeleccionCalle() {
  const modal = document.getElementById('street-selection-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function configurarEventListenersModales() {
  // Event listener for closing modals when clicking outside
  window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Event listeners for close buttons
  const closeButtons = document.querySelectorAll('.close');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });
}

function limpiarMarcadores() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
  clickCount = 0;
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
const pasajeroStyle = document.createElement('style');
pasajeroStyle.textContent = `
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
document.head.appendChild(pasajeroStyle);
