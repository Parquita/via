// ===== SERVICE WORKER PARA VIA PWA =====

const CACHE_NAME = 'via-cache-v1';
const urlsToCache = [
  '/',
  '/nosotros',
  '/servicios',
  '/ayuda',
  '/contacto',
  '/carreras',
  '/prensa',
  '/blog',
  '/terminos',
  '/privacidad',
  '/style/style.css',
  '/script/index.js',
  '/script/analytics.js',
  '/manifest.json'
];

// Instalación del Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('Todos los recursos han sido cacheados');
        return self.skipWaiting();
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      console.log('Service Worker activado');
      return self.clients.claim();
    })
  );
});

// Interceptar peticiones de red
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Devolver respuesta del cache si existe
        if (response) {
          return response;
        }
        
        // Si no está en cache, hacer petición a la red
        return fetch(event.request).then(function(response) {
          // Verificar que la respuesta sea válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clonar la respuesta para poder usarla
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(function() {
        // Si falla la red y no está en cache, devolver página offline
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      })
  );
});

// Manejo de mensajes del cliente
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Sincronización en segundo plano
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Función para sincronización en segundo plano
function doBackgroundSync() {
  // Aquí puedes implementar lógica de sincronización
  // Por ejemplo, sincronizar formularios enviados offline
  console.log('Sincronización en segundo plano ejecutada');
  
  return Promise.resolve();
}

// Manejo de notificaciones push
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/style/image/icon-192x192.png',
      badge: '/style/image/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Ver más',
          icon: '/style/image/icon-72x72.png'
        },
        {
          action: 'close',
          title: 'Cerrar',
          icon: '/style/image/icon-72x72.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Solo cerrar la notificación
    return;
  } else {
    // Clic en la notificación principal
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Cache de recursos estáticos
const STATIC_CACHE = 'via-static-v1';
const STATIC_URLS = [
  '/style/style.css',
  '/script/index.js',
  '/script/analytics.js',
  '/style/image/logo-via.jpg',
  '/style/image/carro-mano.jpg',
  '/style/image/seguridad.jpg',
  '/style/image/mapa.jpg'
];

// Cache de recursos dinámicos
const DYNAMIC_CACHE = 'via-dynamic-v1';

// Estrategia de cache para recursos estáticos
self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);
  
  // Cache para recursos estáticos
  if (STATIC_URLS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request).then(function(response) {
          return caches.open(STATIC_CACHE).then(function(cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
  
  // Cache para recursos dinámicos (API calls)
  else if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        return caches.open(DYNAMIC_CACHE).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(function() {
        return caches.match(event.request);
      })
    );
  }
});

// Limpieza automática de cache
self.addEventListener('activate', function(event) {
  event.waitUntil(
    Promise.all([
      // Limpiar cache estático
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName.startsWith('via-static-') && cacheName !== STATIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Limpiar cache dinámico
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName.startsWith('via-dynamic-') && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Función para actualizar cache
function updateCache() {
  return caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(urlsToCache);
  });
}

// Función para limpiar cache antiguo
function cleanOldCache() {
  return caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        if (cacheName !== CACHE_NAME) {
          return caches.delete(cacheName);
        }
      })
    );
  });
}
