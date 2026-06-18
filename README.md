# PARCIAL II - Aplicaciones Web II - Gastón Paz

Durante la segunda parte del parcial se migraron todos los datos de los libros a una DB (admin), dónde desde ahí no solo se manejarán éstos, si no que también los usuarios

La aplicación sigue constando de tres endpoints, dos para consulta, y una por fuera de la API REST.

Pero lo más novedoso son los nuevos tres endpoints:

# Primer nuevo endpoint ('/registrar')

Permite al usuario registrarse para poder acceder al cátalogo de libros y a las demas funcionalidades.

# Segundo nuevo endpoint ('/ingresar')

Permite que el usuario pueda ingresar al cátalogo, en base a su cuenta. Una vez ingresado se le asignan cookies para no tener que pasar por el proceso de login una y otra vez, si no que yendo al endpoint directamente.

# Tercer nuevo endpoint ('/logout')

Esté último sirve para qué el usuario pueda cerrar su sesión y sus cookies, así nadie puede acceder a su cuenta.

Además, la aplicación cuenta con un manejo de cookies, y un estricto regimen de seguridad para los datos del usuario, usando librerias como bcryptjs y nanoid.