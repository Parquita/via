// ===== CONFIGURACIÓN DE ANALYTICS Y SEGUIMIENTO =====

// Google Analytics 4 (GA4)
function initGoogleAnalytics() {
  // Reemplaza 'G-XXXXXXXXXX' con tu ID de medición real de GA4
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
  
  if (GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    // Cargar Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href
    });
    
    // Eventos personalizados
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_referrer: document.referrer
    });
  }
}

// Seguimiento de eventos personalizados
function trackEvent(eventName, eventCategory, eventAction, eventLabel = null) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      event_category: eventCategory,
      event_action: eventAction,
      event_label: eventLabel
    });
  }
  
  // También enviar a dataLayer para GTM
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      event_category: eventCategory,
      event_action: eventAction,
      event_label: eventLabel
    });
  }
}

// Seguimiento de formularios
function trackFormSubmission(formType) {
  trackEvent('form_submit', 'engagement', 'submit', formType);
}

// Seguimiento de clics en botones
function trackButtonClick(buttonText, buttonLocation) {
  trackEvent('button_click', 'engagement', 'click', `${buttonText} - ${buttonLocation}`);
}

// Seguimiento de navegación
function trackNavigation(linkText, linkDestination) {
  trackEvent('navigation', 'engagement', 'click', `${linkText} - ${linkDestination}`);
}

// Seguimiento de tiempo en página
function trackTimeOnPage() {
  let startTime = Date.now();
  
  window.addEventListener('beforeunload', function() {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', 'engagement', 'measure', `${timeOnPage}s`);
  });
}

// Seguimiento de scroll
function trackScrollDepth() {
  let maxScroll = 0;
  
  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      
      // Track en puntos específicos
      if (maxScroll >= 25 && maxScroll < 50) {
        trackEvent('scroll_depth', 'engagement', 'scroll', '25%');
      } else if (maxScroll >= 50 && maxScroll < 75) {
        trackEvent('scroll_depth', 'engagement', 'scroll', '50%');
      } else if (maxScroll >= 75 && maxScroll < 100) {
        trackEvent('scroll_depth', 'engagement', 'scroll', '75%');
      } else if (maxScroll >= 100) {
        trackEvent('scroll_depth', 'engagement', 'scroll', '100%');
      }
    }
  });
}

// Seguimiento de interacciones con FAQ
function trackFAQInteraction(question, action) {
  trackEvent('faq_interaction', 'engagement', action, question);
}

// Seguimiento de descargas
function trackDownload(resourceType, resourceName) {
  trackEvent('download', 'engagement', 'download', `${resourceType} - ${resourceName}`);
}

// Seguimiento de suscripciones
function trackSubscription(type) {
  trackEvent('subscription', 'engagement', 'subscribe', type);
}

// Seguimiento de errores
function trackError(errorMessage, errorLocation) {
  trackEvent('error', 'error', 'occurred', `${errorMessage} - ${errorLocation}`);
}

// Seguimiento de rendimiento
function trackPerformance() {
  if ('performance' in window) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        
        if (perfData) {
          const loadTime = Math.round(perfData.loadEventEnd - perfData.loadEventStart);
          const domContentLoaded = Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
          
          trackEvent('page_performance', 'performance', 'load_time', `${loadTime}ms`);
          trackEvent('page_performance', 'performance', 'dom_ready', `${domContentLoaded}ms`);
        }
      }, 0);
    });
  }
}

// Seguimiento de dispositivos y navegadores
function trackDeviceInfo() {
  const userAgent = navigator.userAgent;
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
  const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/.test(userAgent);
  
  let deviceType = 'desktop';
  if (isMobile) deviceType = 'mobile';
  if (isTablet) deviceType = 'tablet';
  
  trackEvent('device_info', 'system', 'detect', deviceType);
}

// Seguimiento de fuentes de tráfico
function trackTrafficSource() {
  const referrer = document.referrer;
  let source = 'direct';
  
  if (referrer) {
    if (referrer.includes('google')) {
      source = 'google';
    } else if (referrer.includes('facebook')) {
      source = 'facebook';
    } else if (referrer.includes('twitter')) {
      source = 'twitter';
    } else if (referrer.includes('instagram')) {
      source = 'instagram';
    } else if (referrer.includes('linkedin')) {
      source = 'linkedin';
    } else {
      source = 'other';
    }
  }
  
  trackEvent('traffic_source', 'acquisition', 'referrer', source);
}

// Seguimiento de objetivos de conversión
function trackConversion(goalName, goalValue = null) {
  trackEvent('conversion', 'conversion', 'complete', goalName);
  
  if (goalValue) {
    trackEvent('conversion_value', 'conversion', 'value', goalValue.toString());
  }
}

// Inicializar todas las funcionalidades de seguimiento
function initAllTracking() {
  initGoogleAnalytics();
  trackTimeOnPage();
  trackScrollDepth();
  trackPerformance();
  trackDeviceInfo();
  trackTrafficSource();
  
  // Configurar seguimiento automático de formularios
  setupFormTracking();
  
  // Configurar seguimiento automático de botones
  setupButtonTracking();
  
  // Configurar seguimiento automático de enlaces
  setupLinkTracking();
}

// Configurar seguimiento automático de formularios
function setupFormTracking() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function() {
      const formType = this.id || 'unknown';
      trackFormSubmission(formType);
    });
  });
}

// Configurar seguimiento automático de botones
function setupButtonTracking() {
  const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary');
  
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const buttonText = this.textContent.trim() || 'Unknown Button';
      const buttonLocation = this.closest('section')?.id || 'unknown';
      trackButtonClick(buttonText, buttonLocation);
    });
  });
}

// Configurar seguimiento automático de enlaces
function setupLinkTracking() {
  const links = document.querySelectorAll('a[href^="http"], a[href^="./"], a[href^="/"]');
  
  links.forEach(link => {
    link.addEventListener('click', function() {
      const linkText = this.textContent.trim() || 'Unknown Link';
      const linkDestination = this.href || 'unknown';
      trackNavigation(linkText, linkDestination);
    });
  });
}

// Función para deshabilitar seguimiento (para cumplir con GDPR)
function disableTracking() {
  // Remover Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('config', 'G-XXXXXXXXXX', { send_page_view: false });
  }
  
  // Limpiar dataLayer
  if (window.dataLayer) {
    window.dataLayer = [];
  }
  
  // Guardar preferencia en localStorage
  localStorage.setItem('tracking_disabled', 'true');
}

// Función para habilitar seguimiento
function enableTracking() {
  localStorage.removeItem('tracking_disabled');
  initAllTracking();
}

// Verificar si el seguimiento está deshabilitado
function isTrackingDisabled() {
  return localStorage.getItem('tracking_disabled') === 'true';
}

// Inicializar seguimiento solo si no está deshabilitado
if (!isTrackingDisabled()) {
  document.addEventListener('DOMContentLoaded', initAllTracking);
}

// Exportar funciones para uso externo
window.VIAAnalytics = {
  trackEvent,
  trackFormSubmission,
  trackButtonClick,
  trackNavigation,
  trackFAQInteraction,
  trackDownload,
  trackSubscription,
  trackError,
  trackConversion,
  disableTracking,
  enableTracking,
  isTrackingDisabled
};
