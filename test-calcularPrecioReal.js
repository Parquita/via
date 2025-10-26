console.log('Testing calcularPrecioReal function');

// Simulate the function from pasajero-dashboard.js
function getBasePrice(tripType) {
  switch(tripType) {
    case 'standard': return 8000; // COP per km
    case 'premium': return 12000; // COP per km
    case 'pool': return 6000; // COP per km
    default: return 8000;
  }
}

function calcularPrecioReal(distance, time, passengers) {
  // Validar parámetros originales antes de convertir
  if (distance <= 0 || passengers <= 0) {
    return 0;
  }

  // Convertir parámetros después de validación
  const distanceNum = parseFloat(distance) || 0;
  const passengersNum = parseInt(passengers) || 1;

  const tripType = 'standard'; // Default for testing
  const basePrice = getBasePrice(tripType);

  // Precio base por distancia
  const distancePrice = basePrice * distanceNum;

  // Multiplicar por número de pasajeros
  const totalPrice = distancePrice * passengersNum;

  return Math.round(totalPrice);
}

// Test cases
console.log('Test 1: Distance 5km, 2 passengers');
console.log('Expected: 80000 COP (8000 * 5 * 2)');
console.log('Actual:', calcularPrecioReal(5, 30, 2));

console.log('\nTest 2: Distance 10km, 1 passenger');
console.log('Expected: 80000 COP (8000 * 10 * 1)');
console.log('Actual:', calcularPrecioReal(10, 60, 1));

console.log('\nTest 3: Distance 3.5km, 3 passengers');
console.log('Expected: 84000 COP (8000 * 3.5 * 3)');
console.log('Actual:', calcularPrecioReal(3.5, 20, 3));

console.log('\nTest 4: Invalid distance (0)');
console.log('Expected: 0');
console.log('Actual:', calcularPrecioReal(0, 30, 2));

console.log('\nTest 5: Invalid passengers (0)');
console.log('Expected: 0');
console.log('Actual:', calcularPrecioReal(5, 30, 0));
