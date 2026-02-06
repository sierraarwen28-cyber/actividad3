# Implementación de una API RESTful con Node.js y Express.js

## Introducción
En la presente actividad se desarrolló una API RESTful utilizando Node.js y Express.js, cuyo objetivo es gestionar una lista de tareas (to-do list). La API permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre tareas almacenadas en un archivo JSON.

Además, se implementó un sistema básico de autenticación con JSON Web Tokens (JWT) para proteger las rutas, así como middleware personalizado para el manejo de errores y la validación de acceso.

---

## Configuración del proyecto
El proyecto fue inicializado utilizando Node.js mediante el comando `npm init -y`, lo que permitió generar el archivo `package.json`. Posteriormente, se instalaron las dependencias necesarias para el desarrollo de la API:

- express: para la creación del servidor y el manejo de rutas.
- body-parser: para procesar datos en formato JSON.
- jsonwebtoken: para la generación y validación de tokens de autenticación.
- bcryptjs: para el cifrado seguro de contraseñas.

El servidor fue configurado para ejecutarse en el puerto 3000, utilizando Express como framework principal.

---

## Implementación de las rutas de la API
La API cuenta con diferentes rutas que permiten gestionar tanto usuarios como tareas.

### Rutas de autenticación
Se implementaron dos rutas principales para la autenticación de usuarios:

- **POST /register**: permite registrar un nuevo usuario.  
  En esta ruta se valida que los datos estén completos, se cifra la contraseña utilizando bcryptjs y se almacena el usuario en un archivo `usuarios.json`.

- **POST /login**: permite iniciar sesión.  
  Se verifica que el usuario exista y que la contraseña sea correcta. Si las credenciales son válidas, se genera un token JWT, el cual es utilizado posteriormente para acceder a las rutas protegidas.

### Rutas de tareas (CRUD)
Las rutas relacionadas con las tareas están protegidas mediante un middleware de autenticación. Estas rutas son:

- **GET /tareas**: devuelve todas las tareas almacenadas en el archivo `tareas.json`.
- **POST /tareas**: permite crear una nueva tarea, la cual incluye un título y una descripción.
- **PUT /tareas/:id**: actualiza una tarea existente utilizando su identificador.
- **DELETE /tareas/:id**: elimina una tarea específica según su identificador.

Cada tarea cuenta con un identificador único generado a partir del tiempo actual, lo que permite distinguirlas de manera sencilla.

---

## Manejo de archivos con fs.promises
Para el almacenamiento de datos se utilizaron archivos JSON (`tareas.json` y `usuarios.json`).

El acceso a estos archivos se realizó mediante el módulo nativo `fs.promises`, lo cual permitió ejecutar operaciones de lectura y escritura de manera asíncrona, evitando el bloqueo del Event Loop.

Se implementaron funciones reutilizables para:

- Leer el contenido de los archivos JSON.
- Escribir y actualizar los datos de manera segura.

Este enfoque permitió simular el funcionamiento de una base de datos de forma simple y eficiente.

---

## Autenticación y protección de rutas
La autenticación se implementó utilizando JSON Web Tokens (JWT).

Una vez que el usuario inicia sesión, el servidor genera un token que debe enviarse en los encabezados de las peticiones a las rutas protegidas.

Para ello, se creó un middleware de autenticación, el cual:

- Verifica la existencia del token.
- Valida su autenticidad.
- Permite o deniega el acceso según corresponda.

De esta forma, únicamente los usuarios autenticados pueden interactuar con las rutas de tareas.

---

## Manejo de errores y debugging
Se implementó un middleware global para el manejo de errores, el cual captura errores no controlados y devuelve respuestas adecuadas con códigos de estado HTTP, como 404 o 500.

Durante el desarrollo se utilizaron herramientas de debugging como:

- console.log para inspeccionar datos recibidos y procesados.
- El comando `node --inspect` para ejecutar el servidor en modo depuración.

Estas herramientas permitieron identificar y corregir errores durante la implementación de la API.

---

## Pruebas de la API
Las pruebas de funcionamiento se realizaron utilizando Thunder Client, donde se verificó:

- El registro de usuarios.
- El inicio de sesión y generación del token.
- El acceso a rutas protegidas utilizando el token.
- El correcto funcionamiento de las operaciones CRUD.
- La actualización adecuada de los archivos JSON.

---

## Conclusión
La API desarrollada cumple con los requisitos establecidos, permitiendo la gestión de tareas mediante una arquitectura RESTful.

Se aplicaron conceptos clave de Node.js como asincronía, middleware, autenticación y manejo de errores, logrando una solución funcional, segura y estructurada.
