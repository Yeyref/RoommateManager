# Gestión de Roommates y Gastos

Este proyecto es una aplicación web para gestionar roommates y sus respectivos gastos compartidos, donde se pueden registrar, editar y eliminar roommates, así como asociarles gastos. Está construida utilizando **Node.js**, **Express**, **Fetch API**, y **Bootstrap**, entre otras tecnologías.

## Características

- **Registro de Roommates:** Agrega nuevos roommates a través de una API externa de generación aleatoria de usuarios.
- **Gestión de Gastos:** Crea, edita y elimina gastos asociados a cada roommate.
- **Listar Roommates y Gastos:** Visualiza la lista de roommates y los gastos en una tabla interactiva.
- **Modificación Dinámica:** Actualiza gastos de manera dinámica a través de una interfaz amigable con botones de edición y eliminación.
- **Interacción Asíncrona:** Carga y actualización de datos en tiempo real con la API Fetch y el uso de promesas en JavaScript.

## Tecnologías Utilizadas

- **Node.js**: Backend para la gestión de la API y el manejo de rutas.
- **Express**: Framework para Node.js, usado para crear la API y servir los archivos estáticos.
- **Axios**: Cliente HTTP para obtener los roommates desde una API externa.
- **Fetch API**: Para realizar peticiones asíncronas desde el frontend.
- **Bootstrap**: Para el diseño de la interfaz de usuario y la creación de tablas y botones.
- **Font Awesome**: Íconos para mejorar la interfaz gráfica.
- **UUID**: Para generar identificadores únicos para cada roommate.
- **JSON**: Persistencia de datos en un archivo `roommates.json` y `gastos.json`.

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/gestion-roommates-gastos.git

   Entra en el directorio del proyecto:
    bash
    cd gestion-roommates-gastos
    
    Instala las dependencias:
    bash
    npm install
    
    Inicia el servidor:
    bash
    npm start
    
    
    Abre tu navegador y visita http://localhost:3000 para ver la aplicación en funcionamiento.
