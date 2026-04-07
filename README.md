# Prueba API

API REST construida con NestJS para gestionar tareas (`tasks`) usando Supabase como backend de datos.

## Requisitos

- Node.js 20+
- npm 10+
- Variables de entorno configuradas

## Variables de entorno

Debes crear un archivo `.env` en la raíz con:

```env
PORT=3000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-supabase-key
```

## Instalación

```bash
npm install
```

## Ejecutar en local

```bash
# modo desarrollo
npm run start:dev

# modo producción (requiere build previo)
npm run build
npm run start:prod
```

## Endpoints

- `GET /tasks`  
  Retorna el listado de tareas.

- `POST /tasks`  
  Crea una tarea.

  Body requerido:

  ```json
  {
    "title": "Nueva tarea",
    "is_completed": false
  }
  ```

  Reglas de validación:
  - `title`: string no vacío
  - `is_completed`: booleano
  - No se permiten campos extra

## Scripts útiles

```bash
npm run lint
npm run test
npm run test:e2e
npm run test:cov
```

## Docker

```bash
docker-compose up --build
```

La API quedará disponible en `http://localhost:3000`.
