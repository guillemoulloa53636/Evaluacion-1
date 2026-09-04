const productosJSON = {
    "puertomontt": {
        "id": "PROD-01",
        "slug": "puertomontt",
        "titulo": "Pasaje Santiago - Puerto Montt",
        "precio": 35000,
        "tipo": "Salón Cama",
        "estado": "Activo",
        "img": "Img/Buses.png",
        "descripcion": "La puerta de entrada a la Patagonia chilena y la Región de Los Lagos.",
        "desc": "Viaje directo con Wi-Fi y puertos USB.",
        "imagen": "Img/Mont.jpg",
        "breadcrumb": "Santiago a Puerto Montt",
        "galeria": ["Img/Mont.jpg", "Img/Mont2.jpg"]
    },
    "valparaiso": {
        "id": "PROD-02",
        "slug": "valparaiso",
        "titulo": "Pasaje Santiago - Valparaíso",
        "precio": 10000,
        "tipo": "Clásico",
        "estado": "Activo",
        "img": "Img/Buses.png",
        "descripcion": "Un viaje bohemio e histórico caracterizado por sus cerros llenos de murales, arquitectura colorida y miradores hacia el Pacífico.",
        "desc": "Salidas continuas cada 15 minutos.",
        "imagen": "Img/Valpo.webp",
        "breadcrumb": "Santiago a Valparaíso",
        "galeria": ["Img/Valpo.webp", "Img/valpo2.jpg"]
    },
    "laserena": {
        "id": "PROD-03",
        "slug": "laserena",
        "titulo": "Pasaje Santiago - La Serena",
        "precio": 18500,
        "tipo": "Semi Cama",
        "estado": "Activo",
        "img": "Img/Buses.png",
        "descripcion": "Un destino costero de ritmo sereno, famoso por su arquitectura neocolonial y el icónico Faro Monumental.",
        "desc": "Asientos reclinables y confortables.",
        "imagen": "Img/Serena.webp",
        "breadcrumb": "Santiago a La Serena",
        "galeria": ["Img/Serena.webp", "Img/faro.jpg"]
    },
    "concepcion": {
        "id": "PROD-04",
        "slug": "concepcion",
        "titulo": "Pasaje Santiago - Concepción",
        "precio": 22000,
        "tipo": "Salón Cama",
        "estado": "Activo",
        "img": "Img/Buses.png",
        "descripcion": "La capital universitaria y del rock chileno.",
        "desc": "Servicio diurno y nocturno.",
        "imagen": "Img/Gran_Concepcion.jpg",
        "breadcrumb": "Santiago a Concepción",
        "galeria": ["Img/Gran_Concepcion.jpg", "Img/Conce2.jpg"]
    },
    "pucon": {
        "id": "PROD-05",
        "slug": "pucon",
        "titulo": "Pasaje Santiago - Pucón",
        "precio": 28000,
        "tipo": "Salón Cama",
        "estado": "Agotado",
        "img": "Img/Buses.png",
        "descripcion": "El epicentro del turismo de aventura en la Región de La Araucanía.",
        "desc": "Directo a Pucón centro.",
        "imagen": "Img/Temuco.jpg",
        "breadcrumb": "Santiago a Pucón",
        "galeria": ["Img/Temuco.jpg", "Img/Pucon2.jpg"]
    },
    "chiloe": {
        "id": "PROD-06",
        "slug": "chiloe",
        "titulo": "Pasaje Santiago - Chiloé",
        "precio": 25000,
        "tipo": "Salón Cama",
        "estado": "Activo",
        "img": "Img/Buses.png",
        "descripcion": "Un viaje impregnado de mitología, verde paisaje insular y una identidad cultural única.",
        "desc": "Incluye trasbordo en ferry.",
        "imagen": "Img/Chilote.webp",
        "breadcrumb": "Santiago a Chiloé",
        "galeria": ["Img/Chilote.webp", "Img/Chiloe2.jpg"]
    },
    "talca": {
        "id": "PROD-07",
        "slug": "talca",
        "titulo": "Pasaje Santiago - Talca",
        "precio": 20000,
        "tipo": "Semi Cama",
        "estado": "Activo",
        "img": "Img/Buses.png",
        "descripcion": "Corazón histórico y administrativo de la Región del Maule.",
        "desc": "Viaje rápido por la Ruta 5 Sur.",
        "imagen": "Img/Talca.jpg",
        "breadcrumb": "Santiago a Talca",
        "galeria": ["Img/Talca.jpg", "Img/TalcaGod.jpg"]
    },
    "pichilemu": {
        "id": "PROD-08",
        "slug": "pichilemu",
        "titulo": "Pasaje Santiago - Pichilemu",
        "precio": 20000,
        "tipo": "Clásico",
        "estado": "Activo",
        "img": "Img/Buses.png",
        "descripcion": "La capital chilena del surf, reconocida mundialmente.",
        "desc": "Ideal para escapadas de fin de semana.",
        "imagen": "Img/Pichilemu.jpg",
        "breadcrumb": "Santiago a Pichilemu",
        "galeria": ["Img/Pichilemu.jpg", "Img/Pichilemu2.jpg"]
    },
    "quintero": {
        "id": "PROD-09",
        "slug": "quintero",
        "titulo": "Pasaje Santiago - Quintero",
        "precio": 15000,
        "tipo": "Clásico",
        "estado": "Activo",
        "img": "Img/Buses.png",
        "descripcion": "Una tradicional ciudad costera de la zona central con numerosas playas.",
        "desc": "Ruta costera rápida.",
        "imagen": "Img/quintero.jpg",
        "breadcrumb": "Santiago a Quintero",
        "galeria": ["Img/quintero.jpg", "Img/quintero2.jpg"]
    },
    "vina": {
        "id": "PROD-10",
        "slug": "vina",
        "titulo": "Pasaje Santiago - Viña del Mar",
        "precio": 15000,
        "tipo": "Semi Cama",
        "estado": "Activo",
        "img": "Img/Buses.png",
        "descripcion": "La popular Ciudad Jardín, reconocida por su amplia infraestructura turística.",
        "desc": "Salidas frecuentes desde Terminal Alameda.",
        "imagen": "Img/Vinia.jpg",
        "breadcrumb": "Santiago a Viña del Mar",
        "galeria": ["Img/Vinia.jpg", "Img/Flores.jpg"]
    },
    "antofagasta": {
        "id": "PROD-11",
        "slug": "antofagasta",
        "titulo": "Pasaje Santiago - Antofagasta",
        "precio": 30000,
        "tipo": "Premium",
        "estado": "Activo",
        "img": "Img/Buses.png",
        "descripcion": "Conocida como la Perla del Norte, ciudad costera e industrial.",
        "desc": "Viaje de larga distancia con servicio a bordo.",
        "imagen": "Img/Antofa.jpg",
        "breadcrumb": "Santiago a Antofagasta",
        "galeria": ["Img/Antofa.jpg", "Img/Anto2.jpg"]
    },
    "arica": {
        "id": "PROD-12",
        "slug": "arica",
        "titulo": "Pasaje Santiago - Arica",
        "precio": 35000,
        "tipo": "Premium",
        "estado": "Activo",
        "img": "Img/Buses.png",
        "descripcion": "La Ciudad de la Eterna Primavera, famosa por su clima templado.",
        "desc": "Atención personalizada y asientos cama 180°.",
        "imagen": "Img/Arica.jpg",
        "breadcrumb": "Santiago a Arica",
        "galeria": ["Img/Arica.jpg", "Img/Arica2.jpg"]
    }
};

const productosIniciales = Object.values(productosJSON);

// ==========================================
// MANEJO DE LOCALSTORAGE CON AUTORREPARACIÓN
// ==========================================
function obtenerProductos() {
    try {
        const productosGuardados = localStorage.getItem("productosDB");
        if (!productosGuardados) {
            localStorage.setItem("productosDB", JSON.stringify(productosIniciales));
            return productosIniciales;
        }

        const parsed = JSON.parse(productosGuardados);
        if (!Array.isArray(parsed) || parsed.length === 0) {
            localStorage.setItem("productosDB", JSON.stringify(productosIniciales));
            return productosIniciales;
        }
        return parsed;
    } catch (e) {
        localStorage.setItem("productosDB", JSON.stringify(productosIniciales));
        return productosIniciales;
    }
}

function guardarProductos(listaActualizada) {
    localStorage.setItem("productosDB", JSON.stringify(listaActualizada));
}

function obtenerImagenProducto(producto) {
    const imagenes = [
        producto.imagen,
        ...(Array.isArray(producto.galeria) ? producto.galeria : []),
        producto.img
    ];
    const imagenPaisaje = imagenes.find(imagen => imagen && !/\/?Buses\.png$/i.test(imagen));

    if (imagenPaisaje) return imagenPaisaje;
    if (producto.slug === 'valparaiso') return 'Img/Valpo.webp';
    return 'Img/Buses.png';
}

// ==========================================
// RENDERIZADO DE TABLA ADMINISTRADOR
// ==========================================
function renderizarTablaAdmin() {
    const tbody = document.getElementById("tablaProductosAdmin");
    if (!tbody) return;

    const productos = obtenerProductos();

    tbody.innerHTML = productos.map(prod => {
        const precioNumero = Number(prod.precio) || 0;
        const precioFormateado = precioNumero.toLocaleString('es-CL');

        const badgeTipo = prod.tipo === 'Salón Cama' ? 'bg-warning text-dark' :
                          prod.tipo === 'Semi Cama' ? 'bg-info text-dark' :
                          prod.tipo === 'Premium' ? 'bg-dark text-white' : 'bg-secondary';

        const badgeEstado = prod.estado === 'Agotado' ? 'bg-danger' : 
                            prod.estado === 'Inactivo' ? 'bg-secondary' : 'bg-success';

        const imagenMostrar = obtenerImagenProducto(prod);

        return `
            <tr>
                <td><strong>#${prod.id || 'PROD-00'}</strong></td>
                <td><img src="${imagenMostrar}" alt="${prod.titulo}" width="50" height="35" class="rounded object-fit-cover border bg-light"></td>
                <td class="fw-semibold">${prod.titulo}</td>
                <td class="text-success fw-bold">$${precioFormateado}</td>
                <td><span class="badge ${badgeTipo}">${prod.tipo || 'Clásico'}</span></td>
                <td><span class="badge ${badgeEstado}">${prod.estado || 'Activo'}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-1" title="Editar" data-bs-toggle="modal" data-bs-target="#modalEditarProducto" onclick="cargarProducto('${prod.slug}')">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="Eliminar" onclick="eliminarProducto('${prod.slug}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// ==========================================
// FUNCIONES DEL MODAL (CREAR / EDITAR)
// ==========================================
function limpiarFormulario() {
    if (document.getElementById('prodSlug')) document.getElementById('prodSlug').value = '';
    if (document.getElementById('prodId')) document.getElementById('prodId').value = 'PROD-' + String(Math.floor(Math.random() * 90 + 10));
    if (document.getElementById('prodTitle')) document.getElementById('prodTitle').value = '';
    if (document.getElementById('prodPrice')) document.getElementById('prodPrice').value = '';
    if (document.getElementById('prodType')) document.getElementById('prodType').value = 'Clásico';
    if (document.getElementById('prodImg')) document.getElementById('prodImg').value = 'Img/Buses.png';
    if (document.getElementById('prodStatus')) document.getElementById('prodStatus').value = 'Activo';
    if (document.getElementById('prodDesc')) document.getElementById('prodDesc').value = '';

    const labelModal = document.getElementById('modalEditarProductoLabel');
    if (labelModal) {
        labelModal.innerHTML = '<i class="bi bi-plus-lg me-2"></i>Añadir Nuevo Producto / Pasaje';
    }
}

function cargarProducto(slug) {
    const productos = obtenerProductos();
    const prod = productos.find(p => p.slug === slug);

    if (prod) {
        if (document.getElementById('prodSlug')) document.getElementById('prodSlug').value = prod.slug;
        if (document.getElementById('prodId')) document.getElementById('prodId').value = prod.id || '';
        if (document.getElementById('prodTitle')) document.getElementById('prodTitle').value = prod.titulo || '';
        if (document.getElementById('prodPrice')) document.getElementById('prodPrice').value = prod.precio || 0;
        if (document.getElementById('prodType')) document.getElementById('prodType').value = prod.tipo || 'Clásico';
        if (document.getElementById('prodImg')) document.getElementById('prodImg').value = prod.imagen || prod.img || 'Img/Buses.png';
        if (document.getElementById('prodStatus')) document.getElementById('prodStatus').value = prod.estado || 'Activo';
        if (document.getElementById('prodDesc')) document.getElementById('prodDesc').value = prod.descripcion || prod.desc || '';

        const labelModal = document.getElementById('modalEditarProductoLabel');
        if (labelModal) {
            labelModal.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Editar Producto / Pasaje';
        }
    }
}

function guardarProductoFormulario(e) {
    if (e) e.preventDefault();

    const slug = document.getElementById('prodSlug').value;
    const productos = obtenerProductos();

    if (slug) {
        // Modo Edición
        const index = productos.findIndex(p => p.slug === slug);
        if (index !== -1) {
            productos[index].id = document.getElementById('prodId').value;
            productos[index].titulo = document.getElementById('prodTitle').value;
            productos[index].precio = parseInt(document.getElementById('prodPrice').value) || 0;
            productos[index].tipo = document.getElementById('prodType').value;
            productos[index].img = document.getElementById('prodImg').value;
            productos[index].imagen = document.getElementById('prodImg').value;
            productos[index].estado = document.getElementById('prodStatus').value;
            productos[index].descripcion = document.getElementById('prodDesc').value;
            productos[index].desc = document.getElementById('prodDesc').value;
        }
    } else {
        // Modo Creación
        const tituloNuevo = document.getElementById('prodTitle').value;
        const slugNuevo = tituloNuevo.toLowerCase().replace(/[^a-z0-9]/g, '') || 'pasaje-' + Date.now();
        
        const nuevoProducto = {
            id: document.getElementById('prodId').value || 'PROD-99',
            slug: slugNuevo,
            titulo: tituloNuevo,
            precio: parseInt(document.getElementById('prodPrice').value) || 0,
            tipo: document.getElementById('prodType').value,
            estado: document.getElementById('prodStatus').value,
            img: document.getElementById('prodImg').value || 'Img/Buses.png',
            imagen: document.getElementById('prodImg').value || 'Img/Buses.png',
            descripcion: document.getElementById('prodDesc').value,
            desc: document.getElementById('prodDesc').value,
            breadcrumb: tituloNuevo,
            galeria: [document.getElementById('prodImg').value || 'Img/Buses.png']
        };
        productos.push(nuevoProducto);
    }

    guardarProductos(productos);
    renderizarTablaAdmin();

    const modalElem = document.getElementById('modalEditarProducto');
    if (modalElem) {
        const modalInstance = bootstrap.Modal.getInstance(modalElem) || new bootstrap.Modal(modalElem);
        modalInstance.hide();
    }
}

function eliminarProducto(slug) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        let productos = obtenerProductos();
        productos = productos.filter(p => p.slug !== slug);
        guardarProductos(productos);
        renderizarTablaAdmin();
    }
}

// ==========================================
// VISTA PÚBLICA (DETALLE DE PRODUCTO)
// ==========================================
function cambiarProducto(slugProducto) {
    const productos = obtenerProductos();
    const producto = productos.find(p => p.slug === slugProducto);

    if (producto) {
        if (document.getElementById('product-title')) document.getElementById('product-title').innerText = producto.titulo;
        if (document.getElementById('product-price')) document.getElementById('product-price').innerText = "$" + Number(producto.precio).toLocaleString('es-CL');
        if (document.getElementById('product-description')) document.getElementById('product-description').innerText = producto.descripcion || producto.desc;
        if (document.getElementById('product-breadcrumb')) document.getElementById('product-breadcrumb').innerText = producto.breadcrumb || producto.titulo;
        if (document.getElementById('product-img')) document.getElementById('product-img').src = obtenerImagenProducto(producto);

        const galeriaContenedor = document.getElementById('product-gallery');
        if (galeriaContenedor && producto.galeria) {
            galeriaContenedor.innerHTML = producto.galeria.map(imgSrc => 
                `<img src="${imgSrc}" class="img-thumbnail" style="width: 70px; height: 70px; object-fit: cover; cursor: pointer;" onclick="cambiarImagenPrincipal('${imgSrc}')">`
            ).join('');
        }

        renderizarProductosRelacionados();
    }
}

function escaparHTML(valor) {
    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderizarProductosRelacionados() {
    const contenedor = document.getElementById('relacionadosLista');
    if (!contenedor) return;

    const productos = obtenerProductos();
    const grupos = [];

    for (let indice = 0; indice < productos.length; indice += 5) {
        grupos.push(productos.slice(indice, indice + 5));
    }

    contenedor.innerHTML = grupos.map((grupo, indiceGrupo) => `
        <div class="carousel-item${indiceGrupo === 0 ? ' active' : ''}">
            <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
                ${grupo.map(producto => {
                    const imagen = obtenerImagenProducto(producto);
                    const precio = Number(producto.precio || 0).toLocaleString('es-CL');
                    return `
                        <div class="col">
                            <div class="card h-100 border rounded-3 shadow-sm p-2 text-center">
                                <div class="bg-light rounded mb-2 d-flex align-items-center justify-content-center" style="height: 120px;">
                                    <img src="${escaparHTML(imagen)}" class="img-fluid" style="max-height: 110px; max-width: 100%; object-fit: cover;" alt="${escaparHTML(producto.titulo)}">
                                </div>
                                <h6 class="fw-bold small mb-1" style="color: #0a2540;">${escaparHTML(producto.titulo)}</h6>
                                <span class="text-success fw-bold small mb-2">$${precio}</span>
                                <button type="button" onclick="cambiarProducto('${escaparHTML(producto.slug)}')" class="btn btn-sm btn-outline-dark rounded-2">Ver más</button>
                            </div>
                        </div>`;
                }).join('')}
            </div>
        </div>`).join('');
}

function cambiarImagenPrincipal(src) {
    const imgElem = document.getElementById('product-img');
    if (imgElem) imgElem.src = src;
}

// ==========================================
// EVENTOS AL CARGAR LA PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    renderizarTablaAdmin();

    const formProducto = document.getElementById('formProducto');
    if (formProducto) {
        formProducto.addEventListener('submit', guardarProductoFormulario);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const prodSlug = urlParams.get('prod') || 'puertomontt';
    cambiarProducto(prodSlug);

    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', function(event) {
            event.preventDefault();
            const configValidacion = { "dominiosPermitidos": ["@gmail.com", "@duoc.cl", "@profesor.duoc.cl"] };
            const inputEmail = document.getElementById('rutOEmail').value.trim().toLowerCase();
            const errorMensaje = document.getElementById('errorMensaje');

            const esValido = configValidacion.dominiosPermitidos.some(dominio => inputEmail.endsWith(dominio));

            if (esValido) {
                if (errorMensaje) errorMensaje.classList.add('d-none');
                window.location.href = "Menu.html";
            } else if (errorMensaje) {
                errorMensaje.innerText = "Ingresa un correo válido";
                errorMensaje.classList.remove('d-none');
            }
        });
    }
});