# MyGuardCare Affiliates

Esta es una aplicación que permite gestionar una base de datos de afiliados de seguros. Permite registrar nuevos afiliados y visualizar la lista de afiliados existentes.

## Requisitos Técnicos

Asegúrate de tener los siguientes requisitos instalados en tu sistema:

- **Node.js**: Versión 20 o superior.
- **Docker**: Para levantar el entorno de desarrollo.

## Instalación

Para instalar las dependencias del proyecto, ejecuta el siguiente comando en la raíz del monorepo:

```bash
npm install
```

## Montaje con Docker

Puedes levantar todo el entorno de desarrollo (API y aplicación web) utilizando Docker.

Para construir las imágenes y levantar los contenedores, puedes ejecutar:

```bash
docker compose build
docker compose up --watch
```

O puedes hacerlo en un solo paso con:

```bash
docker compose up --build --watch
```

## Endpoints

Una vez que los contenedores estén en funcionamiento, podrás acceder a los siguientes enlaces:

- **Aplicación Web**: [http://localhost:5173](http://localhost:5173)
- **API**: [http://localhost:3000/api](http://localhost:3000/api)
- **Documentación de la API (Swagger)**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Uso de IA en este proyecto

En este proyecto se ha utilizado Inteligencia Artificial para las siguientes tareas:

- En la generación de este archivo README.
- En la configuración del `docker-compose` respecto al uso de los tipos compartidos, ubicados en `./packages/types`, incluyendo este modulo como un volume en los servicios de `api` y `web`. Y en consecuencia con respectivas modificaciones a los `Dockerfile` de ambos servicios para el funcionamiento de estas adecuaciones.
- API:
  - Refinamiento de las reglas del schema de los afiliados, asi como también en el DTO de RegisterAffiliate.
  - Manejo de errores con el endpoint de RegisterAffiliate.
  - Autocompletado para la consulta con paginación de getAffiliates (findMany en el service).
  - Lógica de filtrado por DNI en la consulta a base de datos (findMany).
  - Pruebas unitarias del controller y el service de los affiliates.
- Web:
  - Dinamización de los componentes frente al consumo de APIs en la vista.
  - Manejo de los hooks responsables de consumir las APIs.
  - Barra de filtro de la lista de afiliados por su DNI.
  - Paginación de la lista de afiliados de `AffiliatesTable`.
  - Regex para validar la longitud y caracteres del campo de `phoneNumber` en el schema de Zod en `RegisterAffiliate`.
  - Pruebas unitarias para los hooks y los componentes de `AffiliatesTable` y `RegisterForm`.
