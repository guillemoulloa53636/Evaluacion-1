const productosJSON = {
    "valparaiso": {
        "titulo": "Pasaje Santiago - Valparaíso",
        "precio": "$10.000",
        "descripcion": "Viaje directo a Valparaíso. Salidas cada 15 minutos desde Terminal Alameda. Servicio clásico con asientos reclinables.",
        "imagen": "Img/Buses.png",
        "breadcrumb": "Santiago a Valparaíso",
        "galeria": ["Img/Buses.png", "Img/Buses.png", "Img/Buses.png"]
    },
    "laserena": {
        "titulo": "Pasaje Santiago - La Serena",
        "precio": "$18.500",
        "descripcion": "Recorrido hacia el norte chico con servicio Salón Cama, incluye snacks y puertos USB en cada asiento.",
        "imagen": "Img/Buses.png",
        "breadcrumb": "Santiago a La Serena",
        "galeria": ["Img/Buses.png", "Img/Buses.png", "Img/Buses.png"]
    },
    "concepcion": {
        "titulo": "Pasaje Santiago - Concepción",
        "precio": "$22.000",
        "descripcion": "Viaje nocturno o diurno directamente a la Región del Biobío. Buses equipados con climatizador de doble zona.",
        "imagen": "Img/Buses.png",
        "breadcrumb": "Santiago a Concepción",
        "galeria": ["Img/Buses.png", "Img/Buses.png", "Img/Buses.png"]
    },
    "pucon": {
        "titulo": "Pasaje Santiago - Pucón",
        "precio": "$28.000",
        "descripcion": "Ruta turística hacia la zona de lagos y volcanes. Asientos Cama Premium con almohada y frazada incluida.",
        "imagen": "Img/Buses.png",
        "breadcrumb": "Santiago a Pucón",
        "galeria": ["Img/Buses.png", "Img/Buses.png", "Img/Buses.png"]
    },
    "puertomontt": {
        "titulo": "Pasaje Santiago - Puerto Montt",
        "precio": "$35.000",
        "descripcion": "Servicio de larga distancia con máxima comodidad, pantalla individual de entretenimiento y asistencia a bordo.",
        "imagen": "Img/Buses.png",
        "breadcrumb": "Santiago a Puerto Montt",
        "galeria": ["Img/Buses.png", "Img/Buses.png", "Img/Buses.png"]
    }
};

// Función que actualiza la interfaz al hacer clic en 'Ver más'
function cambiarProducto(idProducto) {
    const producto = productosJSON[idProducto];

    if (producto) {
        document.getElementById('product-title').innerText = producto.titulo;
        document.getElementById('product-price').innerText = producto.precio;
        document.getElementById('product-description').innerText = producto.descripcion;
        document.getElementById('product-breadcrumb').innerText = producto.breadcrumb;
        document.getElementById('product-img').src = producto.imagen;

        const galleryContainer = document.getElementById('product-gallery');
        galleryContainer.innerHTML = '';

        producto.galeria.forEach((imgUrl, index) => {
            const borderClass = index === 0 ? 'border-primary' : 'opacity-75';
            galleryContainer.innerHTML += `
                <button class="btn p-0 border border-2 ${borderClass} rounded-3 overflow-hidden" style="width: 80px; height: 80px;">
                    <img src="${imgUrl}" class="w-100 h-100 object-fit-cover" alt="Vista ${index + 1}">
                </button>
            `;
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

document.getElementById('formLogin').addEventListener('submit', function(event) {
    // Evita que el formulario se envíe o cambie de página automáticamente
    event.preventDefault();

    // Configuración de reglas en formato JSON
    const configValidacion = {
        "dominioRequerido": "@gmail.com"
    };

    const inputEmail = document.getElementById('rutOEmail').value.trim().toLowerCase();
    const errorMensaje = document.getElementById('errorMensaje');

    // Validación: comprueba si el valor ingresado termina en @gmail.com
    if (inputEmail.endsWith(configValidacion.dominioRequerido)) {
        // Oculta el mensaje de error si existía
        errorMensaje.classList.add('d-none');
        
        // Redirige a la página principal si la validación es correcta
        window.location.href = "index.html";
    } else {
        // Muestra el mensaje de error en pantalla
        errorMensaje.classList.remove('d-none');
    }
});