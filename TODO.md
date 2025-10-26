# TODO: Agregar Mapa Interactivo para Pasajero

## Información Recopilada
- El dashboard del pasajero tiene inputs de texto para origen y destino, pero no un mapa interactivo.
- Se necesita integrar un mapa (usando Leaflet.js para evitar costos de Google Maps) para selección visual de puntos.
- Los archivos principales a editar son: pasajero.html, pasajero-dashboard.js, y dashboard.css.

## Plan de Edición
- [x] Agregar contenedor del mapa en pasajero.html dentro de la sección de solicitud de viaje.
- [x] Incluir la librería Leaflet.js en el HTML.
- [x] En pasajero-dashboard.js, inicializar el mapa, agregar marcadores para origen y destino, y actualizar inputs al hacer clic.
- [x] En dashboard.css, agregar estilos para el contenedor del mapa y marcadores.
- [x] Integrar la selección del mapa con la funcionalidad existente de resumen de viaje.

## Archivos Dependientes a Editar
- public/dashboard/pasajero.html
- public/script/pasajero-dashboard.js
- public/style/dashboard.css

## Pasos de Seguimiento
- [ ] Probar la selección de puntos en el mapa.
- [ ] Verificar que los inputs se actualicen correctamente.
- [ ] Asegurar responsividad en dispositivos móviles.
- [ ] Si es necesario, agregar geocodificación inversa para direcciones.
