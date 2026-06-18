import pool from '../datos/conexion-bd.mjs';

//En el contexto de nuestra aplicación, buscamos un middleware que nos permita verificar que tantos libros en stock tenemos, y, si llegase
//el caso de que no hay libros, se mostraría un mensaje de error, y no se mostraría la información de los libros (en el caso del GET de todos los libros) o del libro solicitado (en el caso del GET de un libro por su id).
export async function verificarEstadoInventario(req, res, next) {
    try {
        const query = 'SELECT SUM(stock) AS total_stock FROM libros';
        const resultado = await pool.query(query);
        
        const contadorStock = parseInt(resultado.rows[0].total_stock) || 0;

        if (contadorStock <= 0) {
            return res.status(404).json({ Mensaje: "No hay libros en stock en toda la biblioteca" });
        }

        console.log(`[Inventario] Hay ${contadorStock} libros en stock general.`);
        next(); 
    } catch (error) {
        console.error("Error en verificarEstadoInventario:", error);
        return res.status(500).json({ Mensaje: "Error al verificar el inventario global" });
    }
}
//En el contexto de nuestra aplicación, realizamos un middleware que nos permita verificar si el libro solicitado, con un id, realmente
//está disponible, y si no lo está, mostramos un mensaje de error. Cabe recalcar que también nos aseguramos de que esté existe, y si no, mostramos otro mensaje de error.
export async function verificarDisponibilidadLibro(req, res, next) {
    const idLibro = Number(req.params.id);

    try {
        // Traemos solo el stock del libro solicitado
        const query = 'SELECT stock, titulo FROM libros WHERE id = $1';
        const resultado = await pool.query(query, [idLibro]);

        // Si no trajo ninguna fila, el libro no existe
        if (resultado.rowCount === 0) {
            return res.status(404).json({ Mensaje: "Libro no encontrado, pruebe con otro ID" });
        }

        const libro = resultado.rows[0];

        // Si existe pero su stock es 0 o menos
        if (libro.stock <= 0) {
            return res.status(404).json({ Mensaje: `El ejemplar "${libro.titulo}" se encuentra sin stock` });
        }

        console.log(`[Disponibilidad] Libro "${libro.titulo}" validado con éxito.`);
        next();
    } catch (error) {
        console.error("Error en verificarDisponibilidadLibro:", error);
        return res.status(500).json({ Mensaje: "Error al verificar disponibilidad del ejemplar" });
    }
}

//En el contexto de nuestra aplicación, hacemos otro middleware, en este caso en un POST. Donde mostraremos, en la consola, todos los libros
//individualmente, qué no están en stock (después de que se haya calculado el valor total del inventario, en funcionesApi.mjs).
export async function avisoLibrosSinStock(req, res, next) {
    try {
        const query = 'SELECT titulo FROM libros WHERE stock <= 0';
        const resultado = await pool.query(query);

        if (resultado.rowCount > 0) {
            resultado.rows.forEach((libro) => {
                console.log(`El libro "${libro.titulo}" no tiene stock disponible.`);
            });
        }

        next();
    } catch (error) {
        console.error("Error en avisoLibrosSinStock:", error);
        next(); 
    }
}