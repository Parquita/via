const API_URL = 'http://localhost:3000/api';



// ===== MODAL DE REGISTRO =====
document.addEventListener('DOMContentLoaded', function () {
  const btnRegistrarse = document.getElementById('btn-registrarse');
  const btnRegistrarse1 = document.getElementById('btn-registrarse-1');
  const modalRegistro = document.getElementById('modal-registro');
  const cerrarModal = document.getElementById('cerrar-modal');

  // Mostrar el modal al hacer clic en 'REGISTRASE'
  if (btnRegistrarse) {
    btnRegistrarse.addEventListener('click', function () {
      modalRegistro.style.display = 'block';
      modalRegistro.classList.add('show');
    });
  }
  if (btnRegistrarse1) {
    btnRegistrarse1.addEventListener('click', function () {
      modalRegistro.style.display = 'block';
      modalRegistro.classList.add('show');
    });
  }
  // Ocultar el modal al hacer clic en la X
  if (cerrarModal) {
    cerrarModal.addEventListener('click', function () {
      modalRegistro.style.display = 'none';
      modalRegistro.classList.remove('show');
    });
  }

  // Ocultar el modal si se hace clic fuera del contenido
  if (modalRegistro) {
    modalRegistro.addEventListener('click', function (event) {
      if (event.target === this) {
        this.style.display = 'none';
        this.classList.remove('show');
      }
    });
  }
});

// Validación y guardado en localStorage del formulario de registro
document.addEventListener('DOMContentLoaded', function () {
  const formRegistro = document.getElementById('form-registro');

  if (formRegistro) {
    // Crear elemento para mensajes
    let mensajeRegistro = document.createElement('div');
    mensajeRegistro.id = 'mensaje-registro';
    mensajeRegistro.style.marginTop = '10px';
    formRegistro.appendChild(mensajeRegistro);

    formRegistro.addEventListener('submit', async function (event) {
      event.preventDefault();
      mensajeRegistro.textContent = '';
      mensajeRegistro.style.color = 'red';

      const nombre = document.getElementById('nombre').value.trim();
      const correo = document.getElementById('correo').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const direccion = document.getElementById('direccion').value.trim();
      const contrasena = document.getElementById('contrasena').value;
      const confirmarContrasena = document.getElementById('confirmar-contrasena').value;
      const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
      const tipoUsuario = document.getElementById('tipo-usuario').value;
      const ciudad = document.getElementById('ciudad').value.trim();
      const codigoPostal = document.getElementById('codigo-postal').value.trim();
      const documento = document.getElementById('documento').value.trim();
      const emergencia = document.getElementById('emergencia').value.trim();
      const terminos = document.getElementById('terminos').checked;
      const privacidad = document.getElementById('privacidad').checked;

      // Validaciones
      if (!nombre || !correo || !telefono || !direccion || !contrasena || !confirmarContrasena ||
        !fechaNacimiento || !tipoUsuario || !ciudad || !codigoPostal || !documento || !emergencia) {
        mensajeRegistro.textContent = 'Por favor, completa todos los campos obligatorios.';
        return;
      }

      if (!terminos || !privacidad) {
        mensajeRegistro.textContent = 'Debes aceptar los términos y condiciones y la política de privacidad.';
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

      // Validar confirmación de contraseña
      if (contrasena !== confirmarContrasena) {
        mensajeRegistro.textContent = 'Las contraseñas no coinciden.';
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

      // Validar teléfono de emergencia
      const regexTelefonoEmergencia = /^\d{10}$/;
      if (!regexTelefonoEmergencia.test(emergencia)) {
        mensajeRegistro.textContent = 'El teléfono de emergencia debe tener exactamente 10 dígitos.';
        return;
      }

      // === Enviar datos al backend para registro ===
      try {
        const response = await fetch(`${API_URL}/usuarios/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre,
            correo,
            contrasena,
            rol_id: tipoUsuario === 'conductor' ? 2 : tipoUsuario === 'admin' ? 1 : 3,
            verificacion_antecedentes: tipoUsuario === 'conductor' ? 'pendiente' : 'n/a',
            estado: 'activo'
          })
        });

        const result = await response.json();

        if (!response.ok) {
          mensajeRegistro.textContent = `❌ Error: ${result.error || 'No se pudo registrar el usuario.'}`;
          return;
        }

        mensajeRegistro.style.color = 'green';
        mensajeRegistro.textContent = '✅ ¡Registro exitoso!';

        formRegistro.reset();
        setTimeout(() => {
          mensajeRegistro.textContent = '';
          document.getElementById('modal-registro').style.display = 'none';
          document.getElementById('modal-login').style.display = 'block';
        }, 1200);
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        mensajeRegistro.textContent = 'Error de conexión con el servidor.';
      }

      mensajeRegistro.style.color = 'green';
      mensajeRegistro.textContent = '¡Registro exitoso!';
      formRegistro.reset();
      setTimeout(() => {
        mensajeRegistro.textContent = '';
        document.getElementById('modal-registro').style.display = 'none';
        // Abrir modal de login automáticamente
        document.getElementById('modal-login').style.display = 'block';
      }, 1200);
    });
  }
});

// ===== MODAL DE LOGIN =====
document.addEventListener('DOMContentLoaded', function () {
  const btnLogin = document.getElementById('btn-login');
  const modalLogin = document.getElementById('modal-login');
  const cerrarModalLogin = document.getElementById('cerrar-modal-login');

  // Mostrar el modal de login
  if (btnLogin) {
    btnLogin.addEventListener('click', function () {
      modalLogin.style.display = 'block';
      modalLogin.classList.add('show');
    });
  }

  // Ocultar el modal de login
  if (cerrarModalLogin) {
    cerrarModalLogin.addEventListener('click', function () {
      modalLogin.style.display = 'none';
      modalLogin.classList.remove('show');
    });
  }

  // Ocultar el modal si se hace clic fuera del contenido
  if (modalLogin) {
    modalLogin.addEventListener('click', function (event) {
      if (event.target === this) {
        this.style.display = 'none';
        this.classList.remove('show');
      }
    });
  }
});

// Validación y autenticación de inicio de sesión
document.addEventListener('DOMContentLoaded', function () {
  const formLogin = document.getElementById('form-login');

  if (formLogin) {
    let mensajeLogin = document.createElement('div');
    mensajeLogin.id = 'mensaje-login';
    mensajeLogin.style.marginTop = '10px';
    formLogin.appendChild(mensajeLogin);

    formLogin.addEventListener('submit',async function (event) {
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
      // === Consultar usuario desde Supabase vía backend ===
      try {
        const response = await fetch(`${API_URL}/usuarios`);
        const usuarios = await response.json();

        if (!Array.isArray(usuarios)) {
          mensajeLogin.textContent = 'Error al obtener los usuarios desde el servidor.';
          return;
        }

        const usuario = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);

        if (!usuario) {
          mensajeLogin.textContent = 'Correo o contraseña incorrectos.';
          return;
        }

        mensajeLogin.style.color = 'green';
        mensajeLogin.textContent = '¡Inicio de sesión exitoso!';
        formLogin.reset();

        // Agregar campo tipoUsuario basado en rol_id para compatibilidad con el dashboard
        usuario.tipoUsuario = usuario.rol_id === 1 ? 'admin' : usuario.rol_id === 2 ? 'conductor' : 'pasajero';

        // Guardar en sessionStorage y localStorage
        sessionStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));

        setTimeout(() => {
          mensajeLogin.textContent = '';
          // Redirigir al dashboard según el tipo de usuario
          const tipoUsuario = usuario.tipoUsuario;
          let dashboardUrl = `dashboard/${tipoUsuario}.html`;
          window.location.href = dashboardUrl;
        }, 1200);
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        mensajeLogin.textContent = 'Error de conexión con el servidor.';
      }
    });
  }
});

// ===== CAMBIO ENTRE MODALES =====
document.addEventListener('DOMContentLoaded', function () {
  const switchToLogin = document.getElementById('switch-to-login');
  const switchToRegister = document.getElementById('switch-to-register');
  const modalRegistro = document.getElementById('modal-registro');
  const modalLogin = document.getElementById('modal-login');

  if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      modalRegistro.style.display = 'none';
      modalRegistro.classList.remove('show');
      modalLogin.style.display = 'block';
      modalLogin.classList.add('show');
    });
  }

  if (switchToRegister) {
    switchToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      modalLogin.style.display = 'none';
      modalLogin.classList.remove('show');
      modalRegistro.style.display = 'block';
      modalRegistro.classList.add('show');
    });
  }
});

// ===== SPINNER DE CARGA VIA =====
document.addEventListener('DOMContentLoaded', function () {
  const spinnerContainer = document.getElementById('spinner-container');

  // Mostrar spinner al cargar la página
  spinnerContainer.style.display = 'flex';

  // Ocultar spinner después de 3 segundos (simulando carga)
  setTimeout(() => {
    spinnerContainer.classList.add('hidden');

    // Ocultar completamente después de la transición
    setTimeout(() => {
      spinnerContainer.style.display = 'none';
    }, 500);
  }, 3000);

  // Función para mostrar spinner manualmente
  window.showSpinner = function () {
    spinnerContainer.style.display = 'flex';
    spinnerContainer.classList.remove('hidden');
  };

  // Función para ocultar spinner manualmente
  window.hideSpinner = function () {
    spinnerContainer.classList.add('hidden');
    setTimeout(() => {
      spinnerContainer.style.display = 'none';
    }, 500);
  };
});

// ===== MENÚ MÓVIL =====
document.addEventListener('DOMContentLoaded', function () {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav');

  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }
});

// ===== EFECTOS DE SCROLL =====
document.addEventListener('DOMContentLoaded', function () {
  // Efecto de aparición al hacer scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  }, observerOptions);

  // Observar elementos para animación
  const animatedElements = document.querySelectorAll('.service-card, .feature-card, .about-content, .help-content');
  animatedElements.forEach(el => {
    observer.observe(el);
  });
});

// ===== CARRUSEL AUTOMÁTICO =====
document.addEventListener('DOMContentLoaded', function () {
  // Seleccionar elementos del carrusel del hero
  const heroCarousel = document.querySelector('.hero-carousel');
  const carouselTrack = heroCarousel ? heroCarousel.querySelector('.carousel-track') : document.querySelector('.carousel-track');
  const slides = heroCarousel ? heroCarousel.querySelectorAll('.carousel-slide') : document.querySelectorAll('.carousel-slide');
  const indicators = heroCarousel ? heroCarousel.querySelectorAll('.carousel-indicator') : document.querySelectorAll('.carousel-indicator');
  const prevBtn = heroCarousel ? heroCarousel.querySelector('.carousel-prev') : document.querySelector('.carousel-prev');
  const nextBtn = heroCarousel ? heroCarousel.querySelector('.carousel-next') : document.querySelector('.carousel-next');

  let currentSlide = 0;
  let autoPlayInterval;

  // Función para mostrar una slide específica
  function showSlide(index) {
    // Ocultar todas las slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Mostrar la slide actual
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
  }

  // Función para ir a la siguiente slide
  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  // Función para ir a la slide anterior
  function prevSlide() {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  // Función para iniciar el auto-play
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000); // Cambiar cada 5 segundos
  }

  // Función para detener el auto-play
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
  }

  // Event listeners para los botones
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoPlay();
      prevSlide();
      startAutoPlay(); // Reiniciar auto-play
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoPlay();
      nextSlide();
      startAutoPlay(); // Reiniciar auto-play
    });
  }

  // Event listeners para los indicadores
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      stopAutoPlay();
      showSlide(index);
      startAutoPlay(); // Reiniciar auto-play
    });
  });

  // Pausar auto-play al hacer hover sobre el carrusel
  if (carouselTrack) {
    carouselTrack.addEventListener('mouseenter', stopAutoPlay);
    carouselTrack.addEventListener('mouseleave', startAutoPlay);
  }

  // Iniciar auto-play cuando se carga la página
  if (slides.length > 0) {
    startAutoPlay();
  }

  // Función para mostrar slide específica (puede ser llamada desde otros lugares)
  window.showCarouselSlide = function (index) {
    if (index >= 0 && index < slides.length) {
      stopAutoPlay();
      showSlide(index);
      startAutoPlay();
    }
  };
});

// ===== FUNCIONALIDADES PARA PÁGINA AYUDA =====

// FAQ Interactivo
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = question.querySelector('i');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = answer.style.display === 'block';

        // Cerrar todas las respuestas
        faqItems.forEach(otherItem => {
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-question i');
          if (otherAnswer) {
            otherAnswer.style.display = 'none';
          }
          if (otherIcon) {
            otherIcon.style.transform = 'rotate(0deg)';
          }
        });

        // Abrir/cerrar la respuesta actual
        if (!isOpen) {
          answer.style.display = 'block';
          if (icon) {
            icon.style.transform = 'rotate(180deg)';
          }
        }
      });

      // Ocultar respuesta por defecto
      if (answer) {
        answer.style.display = 'none';
      }
    }
  });
}

// ===== FUNCIONALIDADES PARA FORMULARIOS =====

// Formulario de Contacto
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Obtener datos del formulario
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Validación básica
      if (!data.firstName || !data.email || !data.message) {
        showNotification('Por favor completa todos los campos obligatorios', 'error');
        return;
      }

      // Simular envío
      showNotification('Enviando mensaje...', 'info');

      setTimeout(() => {
        showNotification('¡Mensaje enviado exitosamente! Te responderemos pronto.', 'success');
        this.reset();
      }, 2000);
    });
  }
}

// Formulario de CV
function initCVForm() {
  const cvForm = document.getElementById('cvForm');
  if (cvForm) {
    cvForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Obtener datos del formulario
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Validación básica
      if (!data.fullName || !data.email || !data.phone || !data.city) {
        showNotification('Por favor completa todos los campos obligatorios', 'error');
        return;
      }

      // Simular envío
      showNotification('Enviando CV...', 'info');

      setTimeout(() => {
        showNotification('¡CV enviado exitosamente! Te contactaremos pronto.', 'success');
        this.reset();
      }, 2000);
    });
  }
}

// Formulario de Prensa
function initPressForm() {
  const pressForm = document.getElementById('pressForm');
  if (pressForm) {
    pressForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Obtener datos del formulario
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Validación básica
      if (!data.mediaName || !data.contactPerson || !data.email || !data.message) {
        showNotification('Por favor completa todos los campos obligatorios', 'error');
        return;
      }

      // Simular envío
      showNotification('Enviando solicitud...', 'info');

      setTimeout(() => {
        showNotification('¡Solicitud enviada exitosamente! Te contactaremos pronto.', 'success');
        this.reset();
      }, 2000);
    });
  }
}

// Formulario de Suscripción
function initSubscribeForm() {
  const subscribeForm = document.getElementById('subscribeForm');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Obtener datos del formulario
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Validación básica
      if (!data.subscribeEmail) {
        showNotification('Por favor ingresa tu correo electrónico', 'error');
        return;
      }

      // Simular suscripción
      showNotification('Suscribiendo...', 'info');

      setTimeout(() => {
        showNotification('¡Te has suscrito exitosamente! Recibirás nuestras actualizaciones pronto.', 'success');
        this.reset();
      }, 2000);
    });
  }
}

// ===== SISTEMA DE NOTIFICACIONES =====

function showNotification(message, type = 'info') {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

  // Agregar estilos
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${getNotificationColor(type)};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 400px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;

  // Agregar al DOM
  document.body.appendChild(notification);

  // Mostrar notificación
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Configurar cierre
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    hideNotification(notification);
  });

  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    hideNotification(notification);
  }, 5000);
}

function hideNotification(notification) {
  notification.style.transform = 'translateX(100%)';
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

function getNotificationIcon(type) {
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  return colors[type] || '#3b82f6';
}

// ===== FUNCIONALIDADES PARA PÁGINA BLOG =====

// Cargar más artículos
function initLoadMore() {
  const loadMoreBtn = document.querySelector('.load-more .btn-secondary');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function (e) {
      e.preventDefault();

      // Simular carga de más artículos
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
      this.disabled = true;

      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-plus"></i> Cargar Más Artículos';
        this.disabled = false;
        showNotification('No hay más artículos disponibles por el momento', 'info');
      }, 2000);
    });
  }
}

// ===== FUNCIONALIDADES PARA PÁGINA SERVICIOS =====

// Cotización de servicios
function initServiceQuotes() {
  const quoteButtons = document.querySelectorAll('a[href="#cotizar"]');

  quoteButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      // Redirigir a la página de contacto
      window.location.href = './contacto.html#formulario-contacto';
    });
  });
}

// ===== FUNCIONALIDADES PARA PÁGINA CARRERAS =====

// Aplicar a trabajos
function initJobApplications() {
  const applyButtons = document.querySelectorAll('a[href="#enviar-cv"]');

  applyButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      // Hacer scroll suave a la sección de CV
      const cvSection = document.getElementById('enviar-cv');
      if (cvSection) {
        cvSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ===== FUNCIONALIDADES PARA PÁGINA PRENSA =====

// Descargar recursos
function initResourceDownloads() {
  const downloadButtons = document.querySelectorAll('.download-link');

  downloadButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      const resourceType = this.textContent.toLowerCase();
      showNotification(`Descargando ${resourceType}...`, 'info');

      // Simular descarga
      setTimeout(() => {
        showNotification(`${resourceType} descargado exitosamente`, 'success');
      }, 1500);
    });
  });
}

// ===== FUNCIONALIDADES PARA PÁGINA NOSOTROS =====

// Animación de timeline
function initTimelineAnimation() {
  const timelineItems = document.querySelectorAll('.timeline-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }
    });
  }, { threshold: 0.5 });

  timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
}

// ===== FUNCIONALIDADES PARA PÁGINA CONTACTO =====

// Validación de teléfono
function initPhoneValidation() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach(input => {
    input.addEventListener('input', function (e) {
      // Solo permitir números, espacios, paréntesis y guiones
      this.value = this.value.replace(/[^\d\s\(\)\-]/g, '');
    });
  });
}

// ===== INICIALIZACIÓN GENERAL =====

// Función para inicializar todas las funcionalidades
function initAllFunctionalities() {
  // Funcionalidades existentes
 /*initMobileMenu();
  initScrollEffects();
  initCarousel();
  initSpinner();*/

  // Nuevas funcionalidades
  initFAQ();
  initContactForm();
  initCVForm();
  initPressForm();
  initSubscribeForm();
  initLoadMore();
  initServiceQuotes();
  initJobApplications();
  initResourceDownloads();
  initTimelineAnimation();
  initPhoneValidation();

  // Configurar navegación activa
  setActiveNavigation();
}

// Configurar navegación activa basada en la página actual
function setActiveNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === `./${currentPage}` || (currentPage === 'index.html' && href === './index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ===== EVENT LISTENERS =====

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  initAllFunctionalities();

  // Agregar estilos CSS para notificaciones
  addNotificationStyles();
});

// Agregar estilos CSS para notificaciones
function addNotificationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .notification-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: white;
      font-size: 1.25rem;
      cursor: pointer;
      margin-left: auto;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }
    
    .notification-close:hover {
      opacity: 1;
    }
    
    .notification i {
      font-size: 1.125rem;
    }
  `;
  document.head.appendChild(style);
}

// ===== FUNCIONALIDADES ADICIONALES =====

// Lazy loading para imágenes
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Smooth scroll para enlaces internos
function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Inicializar funcionalidades adicionales
document.addEventListener('DOMContentLoaded', function () {
  initLazyLoading();
  initSmoothScroll();
});