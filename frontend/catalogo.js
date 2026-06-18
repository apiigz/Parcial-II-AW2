document.addEventListener('DOMContentLoaded', () => {
    cargarCatalogo();
});

async function cargarCatalogo() {
    const contenedor = document.getElementById('contenedor-libros');
    try {
        const respuesta = await fetch('/api/v1/libros');
        if (!respuesta.ok) {
            throw new Error('No se pudo recuperar el archivo de libros.');
        }
        const libros = await respuesta.json();
        contenedor.innerHTML = '';
        if (libros.length === 0) {
            contenedor.innerHTML = `<p class="catalog-counter" style="grid-column: 1/-1; text-align:center;">El anaquel está vacío en este momento.</p>`;
            return;
        }
        libros.forEach(libro => {
            const tarjeta = crearTarjetaHTML(libro);
            contenedor.innerHTML += tarjeta;
        });

    } catch (error) {
        console.error('Error al cargar el catálogo:', error);
        contenedor.innerHTML = `<p class="catalog-counter" style="grid-column: 1/-1; text-align:center; color: #a24a4a;">Error en el sistema de fichado: ${error.message}</p>`;
    }
}

function crearTarjetaHTML(libro) {
    const tieneStock = libro.stock > 0;
    const claseStock = tieneStock ? 'available' : 'empty';
    const textoStock = tieneStock ? `Disponibles: ${libro.stock}` : 'Agotado';
    const estadoBoton = tieneStock ? '' : 'disabled';
    const claseTarjetaAgotada = tieneStock ? '' : 'out-of-stock';
    
    const portada = libro.imagenurl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300';

    return `
        <article class="book-card ${claseTarjetaAgotada}">
            <div class="book-cover-wrapper">
                <img src="${portada}" alt="Portada de ${libro.titulo}" class="book-cover">
            </div>
            <div class="book-details">
                <span class="book-id">Reg. Nº ${String(libro.id).padStart(4, '0')}</span>
                <h4 class="book-title">${libro.titulo}</h4>
                <p class="book-author">Por: ${libro.autor_nombre || 'Autor Anónimo'}</p>
                <div class="book-meta">
                    <span class="book-price">$${Number(libro.precio).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                    <span class="book-stock ${claseStock}">${textoStock}</span>
                </div>
                <button class="btn-card" ${estadoBoton}>
                    ${tieneStock ? 'Solicitar Préstamo' : 'Reservar Turno'}
                </button>
            </div>
        </article>
    `;
}