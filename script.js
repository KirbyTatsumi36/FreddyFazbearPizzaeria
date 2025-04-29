const { jsPDF } = window.jspdf;

// Función para guardar los datos de la tarjeta mientras el usuario escribe
function guardarDatosTarjeta() {
    localStorage.setItem('cardNumber', document.getElementById('card-number').value);
    localStorage.setItem('expiryDate', document.getElementById('expiry-date').value);
    localStorage.setItem('cvv', document.getElementById('cvv').value);
    localStorage.setItem('cardHolder', document.getElementById('card-holder').value);
    localStorage.setItem('address', document.getElementById('address').value);
}

// Función para cargar los datos guardados en el formulario
function cargarDatosTarjeta() {
    document.getElementById('card-number').value = localStorage.getItem('cardNumber') || '';
    document.getElementById('expiry-date').value = localStorage.getItem('expiryDate') || '';
    document.getElementById('cvv').value = localStorage.getItem('cvv') || '';
    document.getElementById('card-holder').value = localStorage.getItem('cardHolder') || '';
    document.getElementById('address').value = localStorage.getItem('address') || '';
}

// Escuchar cambios en el formulario
document.getElementById('payment-form').addEventListener('input', guardarDatosTarjeta);

// Función para generar el PDF con diseño
function generarPDFConEstilo(doc, cardHolder, cardNumber, expiryDate, cvv, address, pizzas, complementos, total) {
    // Agregar un título con estilo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Detalles del Pedido", 105, 20, { align: "center" });

    // Dibujar un rectángulo para el encabezado
    doc.setFillColor(230, 230, 250); // Color lavanda claro
    doc.rect(10, 30, 190, 40, "F");

    // Información del cliente
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${cardHolder}`, 15, 40);
    doc.text(`Tarjeta: ${cardNumber.replace(/\d(?=\d{4})/g, "*")}`, 15, 50); // Ocultar números de tarjeta
    doc.text(`Expira: ${expiryDate}`, 15, 60);
    doc.text(`Domicilio: ${address}`, 15, 70);

    // Línea divisoria
    doc.setDrawColor(200, 200, 200);
    doc.line(10, 80, 200, 80);

    // Detalles del pedido
    let y = 90;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Pizzas:", 15, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    pizzas.forEach((p, i) => {
        doc.text(`- ${p}`, 20, (y += 10));
    });

    if (complementos.length) {
        y += 10;
        doc.setFont("helvetica", "bold");
        doc.text("Complementos:", 15, y);

        doc.setFont("helvetica", "normal");
        complementos.forEach((c, i) => {
            doc.text(`- ${c}`, 20, (y += 10));
        });
    }

    // Total
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 128, 0); // Verde
    doc.text(`Total: $${total}`, 15, y);

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Gracias por tu compra. ¡Disfruta tu pedido!", 105, 290, { align: "center" });
}

// Evento al enviar el formulario
document.getElementById('payment-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;
    const cardHolder = document.getElementById('card-holder').value;
    const address = document.getElementById('address').value;

    const pizzas = JSON.parse(localStorage.getItem('pizzasSeleccionadas') || '[]');
    const complementos = JSON.parse(localStorage.getItem('complementosSeleccionados') || '[]');
    const total = localStorage.getItem('totalCompra') || 0;

    // Crear el PDF con diseño
    const doc = new jsPDF();
    generarPDFConEstilo(doc, cardHolder, cardNumber, expiryDate, cvv, address, pizzas, complementos, total);

    // Nombre personalizado del archivo PDF
    const fecha = new Date().toISOString().split("T")[0];
    const nombreArchivo = `pedido_${cardHolder.replace(/\s+/g, "_")}_${fecha}.pdf`;

    doc.save(nombreArchivo);

    // Confirmación visual
    alert("✅ Tu pedido ha sido guardado como PDF: " + nombreArchivo);
});

// Cargar datos al cargar la página
window.onload = cargarDatosTarjeta;