<p align="center">
  <img src="./public/taskinform.svg" alt="TaskInform Frontend" width="120" />
</p>

<h1 align="center">📋 TaskInform Frontend</h1>
<p align="center">TaskInform Frontend es una SPA (Single Page Application) desarrollada con React 19 + Vite, diseñada para interactuar con un backend Spring Boot.

---

## 🚀 Tecnologías utilizadas

- ⚛️ React 19 + Vite
- 💄 MUI (Material UI)
- 🔐 Autenticación JWT
- 📡 WebSocket + STOMP (SockJS)
- 🌍 Internacionalización (`i18n`)
- 📦 Axios para consumo de APIs
- 🔧 Soporte para variables de entorno `.env`

---

## 📂 Estructura del proyecto

```
src/
├── api/                 # Axios configurado
├── components/          # Componentes reutilizables (TopBar, Modales, etc.)
├── pages/               # Páginas: Login, Register, Home
├── locales/             # Archivos de idioma (en, es, fr)
├── utils/               # Funciones auxiliares (auth, etc.)
├── i18n.js              # Configuración de internacionalización
├── main.jsx             # Entry point principal
└── App.jsx              # Configuración de rutas
```

---

## ⚙️ Configuración del entorno

Antes de ejecutar la app, **copia y renombra** el archivo `.env.example` como `.env`:

```bash
cp .env.example .env
```

Y asegúrate de que las URLs coincidan con las del backend de tu entorno:

```env
VITE_API_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/ws
```

---

### 💡 Sugerencia: abrir en Visual Studio Code

Si usas **VS Code**, puedes abrir y trabajar con este proyecto de forma rápida:

1. Abre VS Code.
2. Selecciona **File > Open Folder** y elige la carpeta del frontend.
3. Asegúrate de tener instalada la extensión de **ESLint** para ver errores de estilo en tiempo real.
4. Si se detecta el entorno de `Vite`, puedes usar la terminal integrada:

```bash
## ▶️ Ejecución local

```bash
npm install
npm run dev
```

Esto lanzará la app en: [http://localhost:5173](http://localhost:5173)

> ⚠️ Nota: el puerto puede variar según tu entorno o configuración de Vite.  
> Verifica el mensaje en consola después de ejecutar `npm run dev`.

---

## 🔐 Autenticación

- Se usa JWT para proteger rutas privadas.
- El login se realiza en `/login`, el token se guarda en `localStorage`.

- Se requiere un usuario registrado, por defecto:  
  **Email:** `admin@gmail.com`  
  **Contraseña:** admin123

- El token se adjunta automáticamente en todas las peticiones con Axios.

> ⚠️ **Advertencia importante sobre roles**:  
> Todos los usuarios que se registren desde esta aplicación serán asignados automáticamente con el rol `ROLE_USER`.  
> El único usuario con privilegios de administrador es el preconfigurado en el backend:

- **Email:** `admin@gmail.com`
- **Contraseña:** `admin123`

Este usuario es necesario para acceder a funciones protegidas como la creación de tareas.

---

## 📡 Notificaciones en tiempo real

- La app se conecta a `VITE_WS_URL` usando `SockJS` + `STOMP`.
- Se suscribe a `/topic/tasks`.
- Cuando se asigna una nueva tarea, se muestra un mensaje en el ícono de notificación (`NotificationBell`).

---

## 🌍 Internacionalización (i18n)

La app soporta varios idiomas: español, inglés y francés.  
Puedes seleccionar el idioma desde la barra superior (`TopBar`).

Los archivos de traducción están en:

```
src/locales/
├── en.json
├── es.json
└── fr.json
```

---

## 🧪 Pruebas

> Actualmente no se incluyen pruebas automáticas.  
La arquitectura del proyecto es compatible con `Jest`, `React Testing Library` y `Vitest`.

Puedes crear archivos `.test.jsx` en cada componente para extender cobertura fácilmente.

---

## 🔐 Seguridad

- Las rutas están protegidas mediante `PrivateRoute`.
- Solo se permite acceso a rutas internas si hay un JWT válido.

---

## 🧠 Autor

**Carlos Andrés Ortiz Peña**  
Senior Fullstack Developer 💻 | Constructor de soluciones 🚀
---



