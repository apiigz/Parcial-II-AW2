-- Conectar a la base de datos
\c admin;

-- Crear la tabla
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos
-- Usuario: admin | Contraseña: admin123 (hash generado con bcrypt)
INSERT INTO usuarios (username, password_hash) VALUES
('admin', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36rQoeG6Lruj3mCq9q');

CREATE TABLE autores(
    id SERIAL PRIMARY KEY, 
    nombre varchar(100) NOT NULL
);
CREATE TABLE libros(
    id SERIAL UNIQUE NOT NULL,
    titulo varchar(100) NOT NULL,
    idAutor INT NOT NULL,
    precio DECIMAL NOT NULL,
    stock INT NOT NULL,
    imagenUrl VARCHAR(255),
    FOREIGN KEY (idAutor) REFERENCES autores(id) ON DELETE CASCADE
);

INSERT INTO autores (nombre)
VALUES
    ('J.R.R. Tolkien'),
    ('J.K. Rowling'),
    ('Gabriel García Márquez'),
    ('Dan Brown'),
    ('Paulo Coelho'),
    ('Carlos Ruiz Zafón'),
    ('Albert Camus'),
    ('Franz Kafka'),
    ('Fiódor Dostoyevski'),
    ('Friedrich Nietzsche'),
    ('Jean-Paul Sartre'),
    ('Marco Aurelio'),
    ('Andres Senn')


INSERT INTO libros (titulo, idautor, precio, stock, imagenurl)
VALUES('El señor de los anillos', 1, 20000, 5, '/portadasLibros/portada_senordelosanillos.jpg')
    ('Harry Potter y la piedra filosofal', 2, 15000, 0),


    ('Cien años de soledad', 3, 18000, 2),
    ('El código Da Vinci', 4, 16000, 4),
    ('El alquimista', 5, 14000, 0),
    ('', , , , ),