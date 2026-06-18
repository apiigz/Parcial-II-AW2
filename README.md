# PARCIAL I - Aplicaciones Web II - Gastón Paz

Para la realización del parcial decidí usar, cómo contexto o temática, una librería. Donde se almacenan libros para la venta.

La aplicación consta de tres endpoints, dos para consulta, y una por fuera de la API REST.

# Primer endpoint

Devuelve, en un .JSON, todos los libros de la base de datos (libros.mjs, qué, a su vez, simula ser una base de datos).

# Segundo endpoint

Devuelve un único objeto (libro), qué será del id que el usuario ingrese.

# Tercer endpoint

Devuelve el valor total del inventario, qué se saca del cálculo "(libro.precio * libro.stock)", qué, traducido, es el precio del libro
por la cantidad disponible (stock)