import pool from '../datos/conexion-bd.mjs';

export async function obtenerLibros(req, res){
    const query = `
    SELECT l.id, l.titulo, l.precio, l.stock, l.imagenurl, a.nombre AS autor_nombre
    FROM libros l
    INNER JOIN autores a ON l.idAutor = a.id
    `;

    const resultado = await pool.query(query);
    return res.json(resultado.rows);
}

export async function obtenerLibroPorId(req, res){
    const {id} = req.params;

    try {
        const query = `
            SELECT l.id, l.titulo, l.precio, l.stock, l.imagenurl, a.nombre AS autor_nombre
            FROM libros l
            INNER JOIN autores a ON l.idAutor = a.id
            WHERE l.id = $1
        `;
        const resultado = await pool.query(query, [id]);

        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Libro no encontrado en el archivo' });
        }

        return res.json(resultado.rows[0]);

    } catch (error) {
        console.error(`Error al obtener el libro ${id}:`, error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
}