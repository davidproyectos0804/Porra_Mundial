Actúa como un senior full-stack engineer experto en Angular (frontend) y Node.js con Express (backend).

Quiero que crees la estructura completa de un proyecto fullstack desde cero en una sola carpeta raíz.

STACK:
- Frontend: Angular (última versión estable)
- Backend: Node.js + Express
- Comunicación: REST API JSON
- No usar bases de datos por ahora (solo mock data en backend)
- Preparado para ampliarse después a MongoDB o PostgreSQL

OBJETIVO:
Quiero un proyecto base limpio, profesional y escalable donde:
- El frontend Angular consuma datos del backend Node
- El backend exponga una API REST básica
- Ambos proyectos estén en la misma carpeta raíz pero separados en frontend/ y backend/

ESTRUCTURA REQUERIDA:

/mi-app
  /frontend-angular
  /backend-node

BACKEND (Node + Express):
- Crear servidor Express
- Configurar CORS correctamente para Angular (localhost:4200)
- Endpoint de ejemplo:
  GET /api/hello -> devuelve { message: "Hello from backend" }
- Otro endpoint:
  GET /api/users -> devuelve lista mock de usuarios
- Estructura limpia:
  /routes
  /controllers
  /services
  app.js o server.js bien organizado

FRONTEND (Angular):
- Crear proyecto Angular dentro de frontend-angular
- Crear servicio Angular para consumir API backend
- Crear componente principal que:
  - Llama a /api/hello
  - Muestra el mensaje en pantalla
  - Llama a /api/users
  - Muestra lista de usuarios en HTML
- Usar HttpClientModule correctamente
- Separar bien:
  /services
  /components

CONEXIÓN FRONTEND + BACKEND:
- Configurar URL base en environment.ts
- Usar HttpClient en Angular para llamadas HTTP
- Backend debe permitir CORS sin errores
- Todo debe funcionar con:
  frontend: http://localhost:4200
  backend: http://localhost:3000

EXTRAS IMPORTANTES:
- Código limpio y comentado para principiantes
- Explicar brevemente cada archivo creado
- No añadir cosas innecesarias (ni auth ni DB todavía)
- Solo base sólida de proyecto fullstack

RESULTADO FINAL:
Quiero que al ejecutar ambos servidores:
- Angular muestre datos del backend correctamente
- No haya errores de CORS
- Todo funcione listo para seguir construyendo encima
EXTRAS IMPORTANTES:
- Node.js con CommonJS (require/module.exports, no ES Modules)
- Angular con standalone components y provideHttpClient() en main.ts
- Mock de usuarios con shape: { id: number, name: string, email: string }
- Package.json raíz con script "start" usando concurrently para levantar ambos
- Código comentado para principiantes
- Sin auth, sin DB, sin complejidad innecesaria