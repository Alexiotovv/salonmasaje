# Agenda de Turnos - Gatitas Senatinas

Sistema de gestión de citas para salón de masajes desarrollado con React.js. Permite crear, editar, eliminar y visualizar turnos en un calendario interactivo.

## Características

- 📅 **Calendario Interactivo**: Vista mensual, semanal y diaria con FullCalendar
- ➕ **Gestión de Turnos**: Crear, editar y eliminar citas directamente desde el calendario
- 🔍 **Búsqueda**: Buscar turnos por cliente, masajista o servicio
- 📋 **Lista de Turnos**: Panel lateral con todos los turnos registrados
- 💰 **Precios y Servicios**: 6 tipos de masajes con precios y duraciones específicas
- 📱 **Responsive**: Diseño adaptativo para diferentes dispositivos

## Servicios Disponibles

- Masaje Relajante - $50 (60 min)
- Masaje Deportivo - $70 (90 min)
- Masaje Terapéutico - $80 (75 min)
- Masaje Facial - $40 (45 min)
- Masaje de Piedras Calientes - $90 (90 min)
- Masaje Aromaterapia - $60 (60 min)

## Instalación y Configuración

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn

### Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd salonmasaje/frontend
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Instala las dependencias específicas del proyecto:**
   ```bash
   npm install @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
   ```

### Dependencias Principales

- **React**: ^19.2.0
- **FullCalendar**: Para la gestión del calendario
  - @fullcalendar/react
  - @fullcalendar/core
  - @fullcalendar/daygrid
  - @fullcalendar/timegrid
  - @fullcalendar/interaction
- **Testing Library**: Para pruebas
- **Web Vitals**: Para métricas de rendimiento

## Uso

### Ejecutar la aplicación

```bash
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Funcionalidades

1. **Crear Turno**:
   - Haz clic en "Nuevo Turno" o en cualquier fecha/hora del calendario
   - Completa el formulario con los datos del cliente y servicio
   - El sistema calcula automáticamente la hora de fin según la duración del servicio

2. **Editar Turno**:
   - Haz clic en cualquier turno en el calendario o en la lista lateral
   - Modifica los datos necesarios
   - Guarda los cambios

3. **Eliminar Turno**:
   - Usa el botón "Eliminar" en el turno del calendario o lista
   - Confirma la eliminación

4. **Buscar Turnos**:
   - Utiliza la barra de búsqueda para filtrar por cliente, masajista o servicio

## Estructura del Proyecto

```
frontend/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── CalendarView.js          # Componente principal del calendario
│   │   ├── CalendarView.css         # Estilos del calendario
│   │   ├── AppointmentForm.js       # Formulario de turnos
│   │   └── AppointmentForm.css      # Estilos del formulario
│   ├── App.js                       # Componente raíz
│   ├── App.css                      # Estilos principales
│   ├── index.js                     # Punto de entrada
│   └── ...
├── package.json
└── README.md
```

## Desarrollo

### Scripts Disponibles

- `npm start`: Ejecuta la aplicación en modo desarrollo
- `npm test`: Ejecuta las pruebas
- `npm run build`: Construye la aplicación para producción
- `npm run eject`: Expone la configuración de Create React App (irreversible)

### Personalización

Los servicios y precios pueden modificarse en `AppointmentForm.js` en la sección de opciones del select de servicios.

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.
