# 🚗 Dashboards VIA - Plataforma de Movilidad Urbana

## 📋 Descripción General

Los dashboards de VIA son interfaces modernas y responsivas diseñadas para cada tipo de usuario de la plataforma, inspiradas en el diseño de Uber. Cada dashboard proporciona funcionalidades específicas adaptadas a las necesidades de cada rol.

## 🎯 Tipos de Dashboard

### 1. 🏢 **Dashboard Administrador** (`admin.html`)
**Audiencia:** Supervisores y administradores del sistema

**Características principales:**
- **Métricas en tiempo real:** Usuarios totales, viajes del día, ganancias, calificaciones promedio
- **Gestión de usuarios:** Ver, editar, eliminar usuarios del sistema
- **Gestión de viajes:** Monitoreo de viajes activos y completados
- **Reportes y análisis:** Gráficos de viajes por día, distribución de usuarios, ganancias mensuales
- **Configuración del sistema:** Ajustes de la plataforma y notificaciones
- **Actividad reciente:** Log de acciones del sistema

**Funcionalidades:**
- Navegación por sidebar con 5 secciones principales
- Gráficos interactivos con Chart.js
- Tablas de datos con acciones CRUD
- Sistema de notificaciones
- Métricas con indicadores de cambio

### 2. 🚘 **Dashboard Conductor** (`conductor.html`)
**Audiencia:** Conductores registrados en la plataforma

**Características principales:**
- **Estado del conductor:** Toggle online/offline
- **Métricas del conductor:** Viajes del día, ganancias, calificación promedio, tiempo en línea
- **Gestión de viajes:** Viajes activos, historial, aceptación/rechazo
- **Análisis de ganancias:** Gráficos de ingresos y desglose por tipo de viaje
- **Perfil del conductor:** Información personal y del vehículo
- **Configuración:** Preferencias de viaje y notificaciones

**Funcionalidades:**
- Control de estado online/offline
- Notificaciones de nuevos viajes
- Gráficos de ganancias con Chart.js
- Gestión de viajes activos
- Perfil editable con información del vehículo

### 3. 🚶 **Dashboard Pasajero** (`pasajero.html`)
**Audiencia:** Usuarios que solicitan viajes

**Características principales:**
- **Solicitud de viaje:** Formulario principal con origen, destino y opciones
- **Tipos de viaje:** Estándar, Premium, Pool (compartido)
- **Vista previa del viaje:** Distancia, tiempo estimado, precio
- **Métricas del usuario:** Total de viajes, calificación promedio, gasto total, días activos
- **Historial de viajes:** Lista de viajes realizados
- **Métodos de pago:** Tarjetas guardadas y historial
- **Lugares favoritos:** Destinos frecuentes guardados
- **Perfil del pasajero:** Información personal y preferencias

**Funcionalidades:**
- Formulario de solicitud de viaje con validación
- Selector de tipo de viaje
- Contador de pasajeros
- Selección de fecha y hora
- Botón de ubicación actual
- Gestión de favoritos
- Sistema de pagos

## 🎨 **Características de Diseño**

### **Estilo Visual**
- **Paleta de colores:** Rosa/VIA (#c81a65), Naranja (#f15339), Dorado (#f9a61c)
- **Tipografía:** Inter (Google Fonts) para máxima legibilidad
- **Iconografía:** Font Awesome 6.4.0 para iconos consistentes
- **Sombras y efectos:** Sistema de sombras CSS con transiciones suaves

### **Responsividad**
- **Desktop:** Sidebar fijo de 280px, contenido principal adaptativo
- **Tablet:** Sidebar reducido a 240px
- **Mobile:** Sidebar oculto, contenido a pantalla completa
- **Grid adaptativo:** Métricas y gráficos se reorganizan automáticamente

### **Animaciones**
- **Transiciones:** 0.3s cubic-bezier para movimientos suaves
- **Hover effects:** Elevación de tarjetas y cambios de color
- **Fade in/out:** Animaciones de entrada para secciones
- **Slide up:** Efectos para modales y contenido dinámico

## 🛠️ **Tecnologías Utilizadas**

### **Frontend**
- **HTML5:** Estructura semántica y accesible
- **CSS3:** Variables CSS, Grid, Flexbox, animaciones
- **JavaScript ES6+:** Funcionalidad interactiva y dinámica
- **Chart.js:** Gráficos y visualizaciones de datos
- **Font Awesome:** Iconografía consistente
- **Google Fonts:** Tipografía optimizada

### **Características Técnicas**
- **CSS Variables:** Sistema de colores y espaciado consistente
- **Grid Layout:** Diseño responsivo y flexible
- **Flexbox:** Alineación y distribución de elementos
- **CSS Animations:** Transiciones y efectos visuales
- **Media Queries:** Adaptación a diferentes tamaños de pantalla

## 📱 **Funcionalidades Interactivas**

### **Navegación**
- **Sidebar:** Navegación principal con iconos y texto
- **Secciones:** Contenido organizado en pestañas
- **Estado activo:** Indicador visual de sección actual
- **Responsive:** Sidebar se oculta en dispositivos móviles

### **Formularios**
- **Validación:** Verificación de campos en tiempo real
- **Estados:** Feedback visual para campos válidos/inválidos
- **Accesibilidad:** Labels, placeholders y mensajes de error
- **Responsive:** Adaptación a diferentes tamaños de pantalla

### **Gráficos y Datos**
- **Chart.js:** Gráficos interactivos y responsivos
- **Datos simulados:** Información de ejemplo para demostración
- **Filtros:** Períodos de tiempo para análisis
- **Exportación:** Funcionalidad para descargar reportes

## 🔧 **Configuración y Personalización**

### **Variables CSS**
```css
:root {
  --primary-color: #c81a65;      /* Color principal VIA */
  --secondary-color: #f15339;    /* Color secundario */
  --accent-color: #f9a61c;       /* Color de acento */
  --success-color: #10b981;      /* Verde para éxito */
  --warning-color: #f59e0b;      /* Amarillo para advertencias */
  --error-color: #ef4444;        /* Rojo para errores */
  --border-radius: 12px;         /* Radio de borde estándar */
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### **Personalización de Colores**
Para cambiar la paleta de colores, modifica las variables CSS en `dashboard.css`:
1. Abre `via/public/style/dashboard.css`
2. Localiza la sección `:root`
3. Cambia los valores hexadecimales según tu marca
4. Los cambios se aplicarán automáticamente a todos los dashboards

### **Personalización de Iconos**
Los iconos se pueden cambiar modificando las clases de Font Awesome en los archivos HTML:
- **Dashboard:** `fas fa-tachometer-alt`
- **Usuarios:** `fas fa-users`
- **Viajes:** `fas fa-route`
- **Reportes:** `fas fa-chart-bar`
- **Configuración:** `fas fa-cog`

## 📊 **Datos y Funcionalidades**

### **Datos Simulados**
Los dashboards incluyen datos de ejemplo para demostración:
- **Usuarios:** 2,847 usuarios totales con crecimiento del 12.5%
- **Viajes:** 156 viajes del día con ganancias de $2,847
- **Calificaciones:** Promedio de 4.8/5 estrellas
- **Actividad:** Log de acciones recientes del sistema

### **Funcionalidades Simuladas**
- **Notificaciones:** Sistema de notificaciones con contador
- **Gráficos:** Visualizaciones de datos con Chart.js
- **Acciones:** Botones de ver, editar, eliminar (simulados)
- **Navegación:** Cambio entre secciones sin recargar la página

## 🚀 **Implementación en Producción**

### **Requisitos del Servidor**
- **Servidor web:** Apache, Nginx o similar
- **HTTPS:** Recomendado para seguridad
- **Compresión:** Gzip para archivos CSS/JS
- **Cache:** Headers de cache para recursos estáticos

### **Optimizaciones Recomendadas**
1. **Minificación:** Comprimir CSS y JavaScript
2. **CDN:** Usar CDN para Font Awesome y Chart.js
3. **Imágenes:** Optimizar y comprimir imágenes
4. **Lazy Loading:** Cargar contenido según sea necesario

### **Integración con Backend**
Para conectar con un backend real:
1. **API Endpoints:** Crear endpoints para datos dinámicos
2. **Autenticación:** Implementar JWT o similar
3. **Base de datos:** Conectar con MongoDB/PostgreSQL
4. **WebSockets:** Para notificaciones en tiempo real

## 📝 **Notas de Desarrollo**

### **Estructura de Archivos**
```
dashboard/
├── admin.html          # Dashboard del administrador
├── conductor.html      # Dashboard del conductor
├── pasajero.html       # Dashboard del pasajero
├── README.md           # Este archivo
└── ../script/
    ├── admin-dashboard.js      # Lógica del admin
    ├── conductor-dashboard.js  # Lógica del conductor
    └── pasajero-dashboard.js   # Lógica del pasajero
```

### **Dependencias Externas**
- **Font Awesome:** `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- **Chart.js:** `https://cdn.jsdelivr.net/npm/chart.js`
- **Google Fonts:** `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap`

### **Compatibilidad**
- **Navegadores:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos:** Desktop, tablet, mobile
- **Resoluciones:** 1920x1080, 1366x768, 768x1024, 375x667

## 🎉 **Conclusión**

Los dashboards de VIA representan una implementación moderna y profesional de interfaces de usuario para plataformas de movilidad urbana. Con su diseño responsivo, funcionalidades interactivas y código limpio, proporcionan una base sólida para el desarrollo de aplicaciones de transporte en tiempo real.

El sistema está diseñado para ser fácilmente personalizable, escalable y mantenible, permitiendo a los desarrolladores adaptar la funcionalidad según las necesidades específicas de cada proyecto.
