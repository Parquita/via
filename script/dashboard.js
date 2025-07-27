// Mostrar información del usuario logueado
document.addEventListener('DOMContentLoaded', function() {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (usuario) {
    document.getElementById('nombre-usuario').textContent = usuario.nombre;
    document.getElementById('correo-usuario').textContent = usuario.correo;
    document.getElementById('telefono-usuario').textContent = usuario.telefono || '-';
    document.getElementById('direccion-usuario').textContent = usuario.direccion || '-';
  }
  // Puedes cambiar estos valores por datos reales si los tienes
  document.getElementById('puntuacion-estrellas').textContent = '★★★★★';
  document.getElementById('valor-puntuacion').textContent = '5.0';
  document.getElementById('num-viajes').textContent = '0';
}); 