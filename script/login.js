// Seleccionamos el formulario de login
const loginForm = document.getElementById('login-form');

// Función para validar el login
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que se recargue la página

    // Obtenemos los valores del formulario
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Recuperamos los datos almacenados en localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
        if (storedUser.email === email && storedUser.password === password) {
            alert('¡Inicio de sesión exitoso!');
            window.location.href = './index.html'; 
        } else {
            alert('Email o contraseña incorrectos.');
        }
    } else {
        alert('No hay ningún usuario registrado. Por favor, regístrate primero.');
    }
});
