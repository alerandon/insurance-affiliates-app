# MyGuardCare Affiliates

Esta es una aplicación que permite gestionar una base de datos de afiliados de seguros. Permite registrar nuevos afiliados y visualizar la lista de afiliados existentes.

## Requisitos Técnicos

Asegúrate de tener los siguientes requisitos instalados en tu sistema:

- **Node.js**: Versión 20 o superior.
- **Docker**: Para levantar el entorno de desarrollo.

## Instalación

Antes de instalar las dependencias, es importante que crees un archivo `.env` en la raíz del proyecto y configures las variables de entorno necesarias. Puedes usar el siguiente ejemplo como base:

```
API_PORT=3000
API_DB_USER=user
API_DB_PASSWORD=password
API_DB_HOST=mongodb
API_DB_PORT=27017
API_DB_NAME=myguardcare-affiliates-app
API_NODE_ENV=development
```

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

## Pruebas Unitarias

Mientras los contenedores de Docker se están ejecutando, puedes correr las pruebas unitarias para cada servicio en una terminal separada.

- **API**:
  ```bash
  docker compose exec api npm run test
  ```

- **Web**:
  ```bash
  docker compose exec web npm run test
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
  - Manejo de errores y loading.
  - Pruebas unitarias para los hooks y los componentes de `AffiliatesTable` y `RegisterForm`.

## Puntos que quedaron pendientes por refinar

- Input de `phoneNumber` de `RegisterForm` en `web`:
  - Luego de un submit exitoso a la api, al volver a renderizar imprime el mensaje de error del formato telefónico, solo porque se resetea en un string vacio, considerandose como inválido para el regex del schema de Zod.
  - Al momento de imprimirse el mensaje de error desborda el grid del formulario debido al ancho de ese texto.
- Manejo de un Empty State en el componente de `AffiliatesTable`, tanto a nivel de data como en paginación.
