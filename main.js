const productosJSON = {
    "valparaiso": {
        "titulo": "Pasaje Santiago - Valparaíso",
        "precio": "$10.000",
        "descripcion": "Un viaje bohemio e histórico caracterizado por sus cerros llenos de murales, colorides arquitectónicas y miradores hacia el Pacífico.",
        "imagen": "Img/Valpo.webp",
        "breadcrumb": "Santiago a Valparaíso",
        "galeria": ["Img/Valpo.webp", "Img/valpo2.jpg"]
    },
    "laserena": {
        "titulo": "Pasaje Santiago - La Serena",
        "precio": "$22.500",
        "descripcion": "Un destino costero de ritmo sereno, famoso por su arquitectura neocolonial y el icónico Faro Monumental.",
        "imagen": "Img/Serena.webp",
        "breadcrumb": "Santiago a La Serena",
        "galeria": ["Img/Serena.webp","Img/faro.jpg"]
    },
    "concepcion": {
        "titulo": "Pasaje Santiago - Concepción",
        "precio": "$22.000",
        "descripcion": "La capital universitaria y del rock chileno.",
        "imagen": "Img/Gran_Concepcion.jpg",
        "breadcrumb": "Santiago a Concepción",
        "galeria": ["Img/Gran_Concepcion.jpg","Img/Conce2.jpg"]
    },
    "pucon": {
        "titulo": "Pasaje Santiago - Pucón",
        "precio": "$27.000",
        "descripcion": "El epicentro del turismo de aventura en la Región de La Araucanía.",
        "imagen": "Img/Temuco.jpg",
        "breadcrumb": "Santiago a Pucón",
        "galeria": ["Img/Temuco.jpg","Img/Pucon2.jpg"]
    },
    "puertomontt": {
        "titulo": "Pasaje Santiago - Puerto Montt",
        "precio": "$30.000",
        "descripcion": "La puerta de entrada a la Patagonia chilena y la Región de Los Lagos.",
        "imagen": "Img/Mont.jpg",
        "breadcrumb": "Santiago a Puerto Montt",
        "galeria": ["Img/Mont.jpg","Img/Mont2.jpg"]
    },
    "chiloe": {
        "titulo": "Pasaje Santiago - Chiloé",
        "precio": "$25.000",
        "descripcion": "Un viaje impregnado de mitología, verde paisaje insular y una identidad cultural única.",
        "imagen": "Img/Chilote.webp",
        "breadcrumb": "Santiago a Chiloé",
        "galeria": ["Img/Chilote.webp","Img/Chiloe2.jpg"]
    },
    "talca": {
        "titulo": "Pasaje Santiago - Talca",
        "precio": "$20.000",
        "descripcion": "Corazón histórico y administrativo de la Región del Maule.",
        "imagen": "Img/Talca.jpg",
        "breadcrumb": "Santiago a Talca",
        "galeria": ["Img/Talca.jpg","Img/TalcaGod.jpg"]
    },
    "pichilemu": {
        "titulo": "Pasaje Santiago - Pichilemu",
        "precio": "$20.000",
        "descripcion": "La capital chilena del surf, reconocida mundialmente.",
        "imagen": "Img/Pichilemu.jpg",
        "breadcrumb": "Santiago a Pichilemu",
        "galeria": ["Img/Pichilemu.jpg","Img/Pichilemu2.jpg"]
    },
    "quintero": {
        "titulo": "Pasaje Santiago - Quintero",
        "precio": "$15.000",
        "descripcion": "Una tradicional ciudad costera de la zona central con numerosas playas.",
        "imagen": "Img/quintero.jpg",
        "breadcrumb": "Santiago a Quintero",
        "galeria": ["Img/quintero.jpg","Img/quintero2.jpg"]
    },
    "arica": {
        "titulo": "Pasaje Santiago - Arica",
        "precio": "$35.000",
        "descripcion": "La Ciudad de la Eterna Primavera, famosa por su clima templado.",
        "imagen": "Img/Arica.jpg",
        "breadcrumb": "Santiago a Arica",
        "galeria": ["Img/Arica.jpg","Img/Arica2.jpg"]
    },
    "antofagasta": {
        "titulo": "Pasaje Santiago - Antofagasta",
        "precio": "$30.000",
        "descripcion": "Conocida como la Perla del Norte, ciudad costera e industrial.",
        "imagen": "Img/Antofa.jpg",
        "breadcrumb": "Santiago a Antofagasta",
        "galeria": ["Img/Antofa.jpg","Img/Anto2.jpg"]
    },
    "vina": {
        "titulo": "Pasaje Santiago - Viña del Mar",
        "precio": "$15.000",
        "descripcion": "La popular Ciudad Jardín, reconocida por su amplia infraestructura turística.",
        "imagen": "Img/Vinia.jpg",
        "breadcrumb": "Santiago a Viña del Mar",
        "galeria": ["Img/Vinia.jpg","Img/Flores.jpg"]
    }
};

const productosIniciales = [
    { id: "PROD-01", slug: "puertomontt", origen: "Santiago", destino: "Puerto Montt", precio: 35000, tipo: "Salón Cama", estado: "Activo", imagen: "Img/Buses.png", descripcion: "Viaje directo hacia el sur de Chile con máxima comodidad." },
    { id: "PROD-02", slug: "valparaiso", origen: "Santiago", destino: "Valparaíso", precio: 10000, tipo: "Clásico", estado: "Activo", imagen: "Img/Buses.png", descripcion: "Disfruta del puerto principal y sus miradores." },
    { id: "PROD-03", slug: "laserena", origen: "Santiago", destino: "La Serena", precio: 18500, tipo: "Semi Cama", estado: "Activo", imagen: "Img/Buses.png", descripcion: "Ruta hacia el norte chico y sus playas." }
];

// ==========================================
// 2. FUNCIONES DE LOCALSTORAGE (CRUD)
// ==========================================
function obtenerProductos() {
    const productosGuardados = localStorage.getItem("productosDB");
    if (!productosGuardados) {
        localStorage.setItem("productosDB", JSON.stringify(productosIniciales));
        return productosIniciales;
    }
    return JSON.parse(productosGuardados);
}

function guardarProductos(listaActualizada) {
    localStorage.setItem("productosDB", JSON.stringify(listaActualizada));
}

// Cargar datos en los inputs del Modal
function cargarProducto(slug) {
    const productos = obtenerProductos();
    const prod = productos.find(p => p.slug === slug);

    if (prod) {
        if (document.getElementById('editSlug')) document.getElementById('editSlug').value = prod.slug;
        if (document.getElementById('editDestino')) document.getElementById('editDestino').value = prod.destino;
        if (document.getElementById('editPrecio')) document.getElementById('editPrecio').value = prod.precio;
        if (document.getElementById('editTipo')) document.getElementById('editTipo').value = prod.tipo;
    }
}

// Guardar los cambios hechos desde el Modal
function guardarCambiosModal() {
    const editSlugElem = document.getElementById('editSlug');
    if (!editSlugElem) {
        console.error("No se encontró el elemento editSlug");
        return;
    }

    const slug = editSlugElem.value;
    const productos = obtenerProductos();
    const index = productos.findIndex(p => p.slug === slug);

    if (index !== -1) {
        productos[index].destino = document.getElementById('editDestino').value;
        productos[index].precio = parseInt(document.getElementById('editPrecio').value) || 0;
        productos[index].tipo = document.getElementById('editTipo').value;

        guardarProductos(productos);
        alert("¡Producto actualizado con éxito!");
        
        location.reload(); 
    } else {
        alert("Error: No se encontró el producto a actualizar.");
    }
}

// ==========================================
// 3. FUNCIONES DE INTERFAZ DE USUARIO
// ==========================================
function cambiarProducto(idProducto) {
    const producto = productosJSON[idProducto];

    if (producto) {
        if (document.getElementById('product-title')) document.getElementById('product-title').innerText = producto.titulo;
        if (document.getElementById('product-price')) document.getElementById('product-price').innerText = producto.precio;
        if (document.getElementById('product-description')) document.getElementById('product-description').innerText = producto.descripcion;
        if (document.getElementById('product-breadcrumb')) document.getElementById('product-breadcrumb').innerText = producto.breadcrumb;
        if (document.getElementById('product-img')) document.getElementById('product-img').src = producto.imagen;

        const galleryContainer = document.getElementById('product-gallery');
        if (galleryContainer) {
            galleryContainer.innerHTML = '';
            producto.galeria.forEach((imgUrl, index) => {
                if (!imgUrl) return; 
                const borderClass = index === 0 ? 'border-primary' : 'opacity-75';
                galleryContainer.innerHTML += `
                    <button type="button" 
                            onclick="cambiarImagenPrincipal('${imgUrl}')" 
                            class="btn p-0 border border-2 ${borderClass} rounded-3 overflow-hidden" 
                            style="width: 80px; height: 80px;">
                        <img src="${imgUrl}" class="w-100 h-100 object-fit-cover" alt="Vista ${index + 1}">
                    </button>
                `;
            });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function cambiarImagenPrincipal(src) {
    const imgElem = document.getElementById('product-img');
    if (imgElem) imgElem.src = src;
}

// ==========================================
// 4. EVENT LISTENERS SEGUROS (VERIFICAN EXISTENCIA)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    // Manejo seguro del Formulario de Login (Si existe en el DOM)
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', function(event) {
            event.preventDefault();

            const configValidacion = {
                "dominiosPermitidos": ["@gmail.com", "@duoc.cl", "@profesor.duoc.cl"]
            };

            const inputEmail = document.getElementById('rutOEmail').value.trim().toLowerCase();
            const errorMensaje = document.getElementById('errorMensaje');

            const esValido = configValidacion.dominiosPermitidos.some(dominio => {
                const tieneTextoAntesDelAt = inputEmail.indexOf('@') > 0;
                return tieneTextoAntesDelAt && inputEmail.endsWith(dominio);
            });

            if (esValido) {
                if (errorMensaje) errorMensaje.classList.add('d-none');
                window.location.href = "Menu.html";
            } else if (errorMensaje) {
                errorMensaje.innerText = "Ingresa un correo válido (ej: usuario@gmail.com, usuario@duoc.cl)";
                errorMensaje.classList.remove('d-none');
            }
        });
    }

    // Carga de Vista Detalle desde URL (Si aplica)
    const urlParams = new URLSearchParams(window.location.search);
    const prodSlug = urlParams.get('prod');

    if (prodSlug) {
        const productos = obtenerProductos();
        const producto = productos.find(p => p.slug === prodSlug);

        if (producto) {
            if (document.getElementById('detalleDestino')) document.getElementById('detalleDestino').innerText = `${producto.origen} ➔ ${producto.destino}`;
            if (document.getElementById('detallePrecio')) document.getElementById('detallePrecio').innerText = `$${producto.precio.toLocaleString('es-CL')}`;
            if (document.getElementById('detalleTipo')) document.getElementById('detalleTipo').innerText = producto.tipo;
            if (document.getElementById('detalleDescripcion')) document.getElementById('detalleDescripcion').innerText = producto.descripcion;
        } else if (document.getElementById('detalleDestino')) {
            document.getElementById('detalleDestino').innerText = "Producto no encontrado";
        }
    }
});