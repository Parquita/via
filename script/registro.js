// Seleccionamos el formulario de registro
const signupForm = document.getElementById('signup-form');

if (signupForm) { // Verificamos que el formulario existe antes de añadir el event listener
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que se recargue la página al enviar el formulario

        // Obtenemos los valores del formulario
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Verificamos que los campos no estén vacíos
        if (name && email && password) {
            // Guardamos la información en el localStorage
            const user = {
                name: name,
                email: email,
                password: password
            };
            localStorage.setItem('user', JSON.stringify(user)); // Guardamos los datos como un string JSON
            alert('¡Usuario registrado exitosamente!');
            window.location.href = 'login.html'; // Redirigimos a la página de login
        } else {
            alert('Por favor, complete todos los campos.');
        }
    });
} else {
    console.error("El formulario de registro no se encuentra en el DOM.");
}
