// Función para calcular el total del pedido
function calcularTotal() {
    let total = 0;
    let pizzasSeleccionadas = [];
    let complementosSeleccionados = [];

    // Obtener precios y nombres de pizzas seleccionadas
    document.querySelectorAll('select').forEach(select => {
        let precio = parseInt(select.value);
        let nombre = select.options[select.selectedIndex].text;
        if (precio > 0) {  // Solo agregar si no es "Ninguna"
            pizzasSeleccionadas.push(nombre);
            total += precio;
        }
    });

    // Sumar precios de los complementos seleccionados
    document.querySelectorAll('.complementos:checked').forEach(checkbox => {
        total += parseInt(checkbox.value);
        complementosSeleccionados.push(checkbox.nextSibling.textContent.trim());
    });

    // Sumar costo de envío si está seleccionado
    const metodoEntrega = document.querySelector('.metodoentrega:checked');
    if (metodoEntrega) {
        total += parseInt(metodoEntrega.value);
    }

    return { total, pizzasSeleccionadas, complementosSeleccionados };
}

// Función para guardar los datos en localStorage
function guardarPedido() {
    const { total, pizzasSeleccionadas, complementosSeleccionados } = calcularTotal();
    const metodoPago = document.querySelector('.metododepago:checked').value;

    localStorage.setItem('totalCompra', total);
    localStorage.setItem('metodoPago', metodoPago);
    localStorage.setItem('pizzasSeleccionadas', JSON.stringify(pizzasSeleccionadas));
    localStorage.setItem('complementosSeleccionados', JSON.stringify(complementosSeleccionados));

    // Redirigir según el método de pago
    window.location.href = metodoPago === 'tarjeta' ? 'tarjeta.html' : 'efectivo.html';
}

// Evento al hacer clic en el botón de pago
document.getElementById('boton1')?.addEventListener('click', guardarPedido);


// Función para guardar los datos de la tarjeta mientras el usuario escribe
function guardarDatosTarjeta() {
    localStorage.setItem('cardNumber', document.getElementById('card-number').value);
    localStorage.setItem('expiryDate', document.getElementById('expiry-date').value);
    localStorage.setItem('cvv', document.getElementById('cvv').value);
    localStorage.setItem('cardHolder', document.getElementById('card-holder').value);
}

// Evento para actualizar los datos en localStorage mientras el usuario escribe
document.getElementById('payment-form')?.addEventListener('input', guardarDatosTarjeta);

// Función para cargar los datos guardados en el formulario de pago
function cargarDatosTarjeta() {
    if (document.getElementById('card-number')) {
        document.getElementById('card-number').value = localStorage.getItem('cardNumber') || '';
        document.getElementById('expiry-date').value = localStorage.getItem('expiryDate') || '';
        document.getElementById('cvv').value = localStorage.getItem('cvv') || '';
        document.getElementById('card-holder').value = localStorage.getItem('cardHolder') || '';
    }
}

// Ejecutar funciones al cargar la página
window.onload = function () {
    mostrarPedido();
    cargarDatosTarjeta();
};
