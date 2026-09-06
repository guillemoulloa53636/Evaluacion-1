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

const ciudadesJSON = {
    santiago: { nombre: "Santiago", distanciaDesdeSantiago: 0 },
    valparaiso: { nombre: "Valparaíso", distanciaDesdeSantiago: 120 },
    vina: { nombre: "Viña del Mar", distanciaDesdeSantiago: 130 },
    quintero: { nombre: "Quintero", distanciaDesdeSantiago: 160 },
    talca: { nombre: "Talca", distanciaDesdeSantiago: 255 },
    pichilemu: { nombre: "Pichilemu", distanciaDesdeSantiago: 210 },
    concepcion: { nombre: "Concepción", distanciaDesdeSantiago: 500 },
    pucon: { nombre: "Pucón", distanciaDesdeSantiago: 785 },
    puertomontt: { nombre: "Puerto Montt", distanciaDesdeSantiago: 1030 },
    chiloe: { nombre: "Chiloé", distanciaDesdeSantiago: 1150 },
    laserena: { nombre: "La Serena", distanciaDesdeSantiago: 475 },
    antofagasta: { nombre: "Antofagasta", distanciaDesdeSantiago: 1365 },
    arica: { nombre: "Arica", distanciaDesdeSantiago: 2050 }
};

const tarifasEspecialesJSON = {
    "antofagasta-arica": 15000,
    "arica-laserena": 15000,
    "arica-pichilemu": 25000,
    "arica-quintero": 25000,
    "arica-santiago": 25000,
    "arica-vina": 25000,
    "arica-chiloe": 45000,
    "arica-concepcion": 45000,
    "arica-pucon": 45000,
    "arica-puertomontt": 45000,
    "arica-talca": 45000
};

function calcularPrecioViaje(origen, destino) {
    const ciudadOrigen = ciudadesJSON[origen];
    const ciudadDestino = ciudadesJSON[destino];
    if (!ciudadOrigen || !ciudadDestino || origen === destino) return null;

    const distancia = Math.abs(ciudadDestino.distanciaDesdeSantiago - ciudadOrigen.distanciaDesdeSantiago);
    const tarifaEspecial = tarifasEspecialesJSON[[origen, destino].sort().join('-')];
    const precio = tarifaEspecial || Math.max(4500, Math.round((4500 + distancia * 12) / 500) * 500);
    return { distancia, precio, ciudadOrigen, ciudadDestino };
}

function prepararCalculadoraViaje() {
    const origen = document.getElementById('ciudadOrigen');
    const destino = document.getElementById('ciudadDestino');
    const formulario = document.getElementById('formCalculadoraViaje');
    const resultado = document.getElementById('resultadoViaje');
    const botonAgregar = document.getElementById('btnAgregarViajeCalculado');
    if (!origen || !destino || !formulario || !resultado || !botonAgregar) return;

    const opciones = Object.entries(ciudadesJSON).map(([clave, ciudad]) =>
        `<option value="${clave}">${ciudad.nombre}</option>`
    ).join('');
    origen.insertAdjacentHTML('beforeend', opciones);
    destino.insertAdjacentHTML('beforeend', opciones);

    let viajeCalculado = null;
    formulario.addEventListener('submit', event => {
        event.preventDefault();
        viajeCalculado = calcularPrecioViaje(origen.value, destino.value);
        const aviso = document.getElementById('avisoCalculadora');

        if (!viajeCalculado) {
            resultado.classList.remove('d-none');
            aviso.innerText = 'Selecciona dos ciudades diferentes para calcular el precio.';
            aviso.classList.remove('d-none');
            return;
        }

        document.getElementById('rutaCalculada').innerText = `${viajeCalculado.ciudadOrigen.nombre} a ${viajeCalculado.ciudadDestino.nombre}`;
        document.getElementById('distanciaCalculada').innerText = `${viajeCalculado.distancia.toLocaleString('es-CL')} km aproximadamente`;
        document.getElementById('precioCalculado').innerText = `$${viajeCalculado.precio.toLocaleString('es-CL')}`;
        aviso.classList.add('d-none');
        resultado.classList.remove('d-none');
    });

    botonAgregar.addEventListener('click', () => {
        if (!viajeCalculado) return;
        const slug = `calculado-${origen.value}-${destino.value}`;
        const carrito = obtenerCarrito();
        const itemExistente = carrito.find(item => item.slug === slug);
        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            carrito.push({
                slug,
                titulo: `Pasaje ${viajeCalculado.ciudadOrigen.nombre} - ${viajeCalculado.ciudadDestino.nombre}`,
                precio: viajeCalculado.precio,
                cantidad: 1
            });
        }
        guardarCarrito(carrito);
        actualizarContadorCarrito();
        renderizarCarrito();
        botonAgregar.innerHTML = '<i class="bi bi-check-lg me-1"></i>Añadido al carrito';
        window.setTimeout(() => {
            botonAgregar.innerHTML = '<i class="bi bi-cart-plus me-1"></i>Añadir al carrito';
        }, 1800);
    });
}

// ==========================================
// MANEJO DE USUARIOS Y AUTENTICACION
// ==========================================
const usuariosIniciales = [
    {
        nombre: "Guillermo",
        correo: "guillermo@gmail.com",
        password: "Guillermo123",
        telefono: "",
        region: "",
        comuna: ""
    },
    {
        nombre: "Maria Vargas",
        correo: "maria@gmail.com",
        password: "maria123",
        telefono: "",
        region: "",
        comuna: ""
    },
    {
        nombre: "Juan Perez",
        correo: "juanito@gmail.com",
        password: "juanito5566",
        telefono: "",
        region: "",
        comuna: ""
    }
];

function obtenerUsuarios() {
    try {
        const usuariosGuardados = localStorage.getItem("usuariosDB");
        if (!usuariosGuardados) {
            localStorage.setItem("usuariosDB", JSON.stringify(usuariosIniciales));
            return [...usuariosIniciales];
        }

        const usuarios = JSON.parse(usuariosGuardados);
        if (!Array.isArray(usuarios)) return [...usuariosIniciales];

        const cuentaInicial = usuariosIniciales[0];
        if (!usuarios.some(usuario => usuario.correo === cuentaInicial.correo)) {
            usuarios.unshift(cuentaInicial);
            localStorage.setItem("usuariosDB", JSON.stringify(usuarios));
        }
        return usuarios;
    } catch (error) {
        localStorage.setItem("usuariosDB", JSON.stringify(usuariosIniciales));
        return [...usuariosIniciales];
    }
}

function guardarUsuarios(usuarios) {
    localStorage.setItem("usuariosDB", JSON.stringify(usuarios));
}

function renderizarTablaClientes() {
    const tbody = document.getElementById("tablaClientesAdmin");
    if (!tbody) return;

    tbody.innerHTML = obtenerUsuarios().map(usuario => `
        <tr>
            <td class="fw-semibold">${escaparHTML(usuario.nombre || "Sin nombre")}</td>
            <td>${escaparHTML(usuario.correo)}</td>
            <td>${escaparHTML(usuario.telefono || "No informado")}</td>
            <td>${escaparHTML(usuario.comuna || "No informada")}</td>
            <td><span class="badge bg-success">Activo</span></td>
        </tr>
    `).join("");
}

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
// CARRITO DE VIAJES
// ==========================================
function obtenerCarrito() {
    try {
        const carrito = JSON.parse(localStorage.getItem('carritoDB') || '[]');
        return Array.isArray(carrito) ? carrito : [];
    } catch (error) {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem('carritoDB', JSON.stringify(carrito));
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('contadorCarrito');
    if (!contador) return;

    const cantidadTotal = obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
    contador.innerText = cantidadTotal;
    contador.classList.toggle('d-none', cantidadTotal === 0);
}

function renderizarCarrito() {
    const lista = document.getElementById('listaCarrito');
    const total = document.getElementById('totalCarrito');
    if (!lista || !total) return;

    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        lista.innerHTML = '<p class="text-muted text-center mb-0">Tu carrito está vacío.</p>';
        total.innerText = '$0';
        return;
    }

    lista.innerHTML = carrito.map(item => `
        <div class="d-flex justify-content-between align-items-center border-bottom py-3 gap-3">
            <div>
                <strong class="d-block">${escaparHTML(item.titulo)}</strong>
                <small class="text-muted">${item.cantidad} pasaje(s) x $${Number(item.precio).toLocaleString('es-CL')}</small>
            </div>
            <div class="text-end">
                <strong class="d-block text-success">$${(item.precio * item.cantidad).toLocaleString('es-CL')}</strong>
                <button type="button" class="btn btn-sm btn-link text-danger p-0" onclick="quitarDelCarrito('${escaparHTML(item.slug)}')">Quitar</button>
            </div>
        </div>
    `).join('');

    const totalCarrito = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    total.innerText = '$' + totalCarrito.toLocaleString('es-CL');
}

function agregarAlCarrito() {
    const slug = new URLSearchParams(window.location.search).get('prod') || 'puertomontt';
    const producto = obtenerProductos().find(item => item.slug === slug);
    const cantidad = Number(document.getElementById('cantidad')?.value || 1);

    if (!producto || producto.estado !== 'Activo') return;

    const carrito = obtenerCarrito();
    const itemExistente = carrito.find(item => item.slug === producto.slug);
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({
            slug: producto.slug,
            titulo: producto.titulo,
            precio: Number(producto.precio) || 0,
            cantidad
        });
    }

    guardarCarrito(carrito);
    actualizarContadorCarrito();
    renderizarCarrito();

    const aviso = document.getElementById('avisoCarrito');
    if (aviso) {
        aviso.innerText = 'Viaje añadido al carrito';
        aviso.classList.remove('d-none');
        window.setTimeout(() => aviso.classList.add('d-none'), 2500);
    }
}

function quitarDelCarrito(slug) {
    guardarCarrito(obtenerCarrito().filter(item => item.slug !== slug));
    actualizarContadorCarrito();
    renderizarCarrito();
}

function vaciarCarrito() {
    guardarCarrito([]);
    actualizarContadorCarrito();
    renderizarCarrito();
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
        const disponibilidad = document.getElementById('product-availability');
        const botonCarrito = document.getElementById('btnAgregarCarrito');
        const disponible = producto.estado === 'Activo';
        if (disponibilidad) {
            disponibilidad.className = `badge ${disponible ? 'bg-success' : 'bg-danger'} fs-6`;
            disponibilidad.innerHTML = `<i class="bi ${disponible ? 'bi-check-circle' : 'bi-x-circle'} me-1"></i>${disponible ? 'Disponible' : 'No disponible'}`;
        }
        if (botonCarrito) {
            botonCarrito.disabled = !disponible;
            botonCarrito.innerHTML = disponible ? '<i class="bi bi-cart-plus me-2"></i>Añadir al carrito' : '<i class="bi bi-cart-x me-2"></i>Viaje no disponible';
        }
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
    renderizarTablaClientes();
    actualizarContadorCarrito();
    renderizarCarrito();
    prepararCalculadoraViaje();

    const botonCarrito = document.getElementById('btnAgregarCarrito');
    if (botonCarrito) botonCarrito.addEventListener('click', agregarAlCarrito);

    const botonVaciarCarrito = document.getElementById('btnVaciarCarrito');
    if (botonVaciarCarrito) botonVaciarCarrito.addEventListener('click', vaciarCarrito);

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
            const inputEmail = document.getElementById('rutOEmail').value.trim().toLowerCase();
            const inputPassword = document.getElementById('password').value;
            const errorMensaje = document.getElementById('errorMensaje');
            const usuario = obtenerUsuarios().find(cuenta => cuenta.correo === inputEmail && cuenta.password === inputPassword);

            if (usuario) {
                if (errorMensaje) errorMensaje.classList.add('d-none');
                localStorage.setItem('usuarioActivo', JSON.stringify({ nombre: usuario.nombre, correo: usuario.correo }));
                window.location.href = "Menu.html";
            } else if (errorMensaje) {
                errorMensaje.innerText = "El correo o la contraseña no son correctos";
                errorMensaje.classList.remove('d-none');
            }
        });
    }

    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', function(event) {
            event.preventDefault();

            const correo = document.getElementById('correo').value.trim().toLowerCase();
            const confirmarCorreo = document.getElementById('confirmarCorreo').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const confirmarPassword = document.getElementById('confirmarPassword').value;
            const errorMensaje = document.getElementById('errorRegistro');
            const usuarios = obtenerUsuarios();

            if (correo !== confirmarCorreo) {
                errorMensaje.innerText = 'Los correos electrónicos no coinciden';
                errorMensaje.classList.remove('d-none');
                return;
            }

            if (password !== confirmarPassword) {
                errorMensaje.innerText = 'Las contraseñas no coinciden';
                errorMensaje.classList.remove('d-none');
                return;
            }

            if (usuarios.some(usuario => usuario.correo === correo)) {
                errorMensaje.innerText = 'Ya existe una cuenta con ese correo';
                errorMensaje.classList.remove('d-none');
                return;
            }

            usuarios.push({
                nombre: document.getElementById('nombre').value.trim(),
                correo,
                password,
                telefono: document.getElementById('telefono').value.trim(),
                region: document.getElementById('region').selectedOptions[0].text,
                comuna: document.getElementById('comuna').selectedOptions[0].text
            });
            guardarUsuarios(usuarios);
            window.location.href = "index.html?registro=exitoso";
        });
    }
});