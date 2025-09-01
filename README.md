# ATA-Dashboard

Dashboard web para gestión y monitoreo de sensores, reportes, tickets de soporte y administración de usuarios y técnicos en el laboratorio ATA.

## Características principales

- **Autenticación de usuarios** (login y registro)
- **Roles**: Administrador, Usuario, Técnico
- **Gestión de sensores**: visualización, administración y monitoreo
- **Reportes**: generación y descarga de reportes en PDF/CSV por rango de fechas y sensor
- **Tickets de soporte**: creación, seguimiento y actualización de estado
- **Alertas**: visualización y gestión de alertas generadas por sensores
- **Paneles personalizados** según el rol
- **Notificaciones** en tiempo real para usuarios
- **Interfaz moderna y responsiva** con React y TailwindCSS

## Estructura del proyecto

```
frontend/
└── ata-dashboard/
    ├── public/           # Imágenes y archivos estáticos
    ├── src/
    │   ├── components/   # Componentes reutilizables (Navbar, Sidebar, etc.)
    │   ├── config/       # Configuración de API
    │   ├── context/      # Contextos globales (notificaciones, auth, etc.)
    │   ├── hooks/        # Custom hooks
    │   ├── pages/        # Vistas por rol (Admin, User, Tech, Auth)
    │   ├── routes/       # Rutas protegidas
    │   ├── utils/        # Utilidades y helpers
    │   ├── App.jsx       # Componente principal
    │   └── main.jsx      # Punto de entrada
    ├── .env              # Variables de entorno
    ├── package.json      # Dependencias y scripts
    ├── vite.config.js    # Configuración de Vite
    └── index.html        # HTML principal
```

## Instalación y ejecución en local

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/PaolaMaribel18/ATA-Dashboard.git
   cd ATA-Dashboard/frontend/ata-dashboard
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   
   Crea un archivo `.env` en `frontend/ata-dashboard` y agrega:
   ```
   VITE_API_URL=http://localhost:8000
   ```
   (O la URL de tu backend en producción)

4. **Ejecuta el frontend**
   ```bash
   npm run dev
   ```
   El dashboard estará disponible en [http://localhost:5173](http://localhost:5173)

## Despliegue

- El proyecto está listo para ser desplegado en **Vercel** o cualquier servicio compatible con Vite/React.
- Para producción, cambia `VITE_API_URL` en `.env` por la URL de tu backend (por ejemplo, en Render).

## Conexión con el backend

- El frontend se conecta a la API REST del backend (FastAPI) usando la variable `VITE_API_URL`.
- Asegúrate de que el backend permita CORS desde la URL de tu frontend.

## Scripts útiles

- `npm run dev` - Ejecuta el proyecto en modo desarrollo
- `npm run build` - Compila el proyecto para producción
- `npm run preview` - Previsualiza el build de producción localmente

## Dependencias principales

- [React](https://react.dev/)
- [React Router DOM](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [React Icons](https://react-icons.github.io/react-icons/)

## Personalización

- Cambia el logo en `public/ata_logo.png`
- Cambia la imagen de fondo en `public/images.jpg`
- Modifica los estilos en `src/App.css` y `src/index.css`


## Licencia

Este proyecto está bajo la licencia MIT.

---

**Contacto:**  
Desarrollado por Paola Maribel Aucapiña 
[GitHub](https://github.com/PaolaMaribel18)
