# 📱 App Asistencia Odoo

Aplicación móvil de control de asistencia desarrollada con **React Native + Expo** e integrada con **Odoo** mediante **JSON-RPC**.

El objetivo del proyecto es permitir que los empleados puedan registrar su jornada laboral desde un dispositivo móvil, realizando **check-in** y **check-out** de forma sencilla, con validación de ubicación y comunicación directa con el servidor Odoo.

---

## 🚀 Descripción del proyecto

**App Asistencia Odoo** es una solución móvil pensada para empresas que utilizan Odoo como sistema ERP y necesitan gestionar la asistencia de sus empleados desde una aplicación multiplataforma.

La aplicación permite consultar el estado actual de asistencia del usuario, registrar entradas y salidas, validar permisos de ubicación y enviar la información al modelo de asistencia de Odoo mediante peticiones JSON-RPC.

---

## 🛠️ Tecnologías utilizadas

### Frontend móvil

- React Native
- Expo
- TypeScript

### Integración

- Odoo
- JSON-RPC API
- Modelo `hr.attendance`

### Herramientas

- Node.js
- npm
- Expo CLI
- EAS Build
- Android Studio
- Xcode

---

## ✨ Funcionalidades principales

- Registro de entrada laboral (**Check-In**)
- Registro de salida laboral (**Check-Out**)
- Integración directa con Odoo
- Comunicación mediante JSON-RPC
- Validación de ubicación GPS
- Gestión de permisos de localización
- Configuración de entorno de desarrollo y producción
- Compatible con Android, iOS y Web
- Ejecución rápida mediante QR con Expo
- Separación entre lógica, servicios y configuración

---

## 📱 Flujo principal de la aplicación

```text
Usuario abre la aplicación
        ↓
La app solicita permisos de ubicación
        ↓
Se obtiene la ubicación actual del empleado
        ↓
El usuario realiza Check-In o Check-Out
        ↓
La app envía la petición a Odoo mediante JSON-RPC
        ↓
Odoo registra la asistencia en hr.attendance
        ↓
La aplicación muestra el estado actualizado
```

---

## 🗄️ Modelo relacional / integración con Odoo

Aunque la base de datos principal es gestionada por **Odoo**, la aplicación se comunica con diferentes entidades relacionadas con el control de asistencia.

### Entidades principales

| Entidad / Modelo | Descripción |
|---|---|
| `res.users` | Usuario autenticado que accede a la aplicación. |
| `hr.employee` | Empleado asociado al usuario de Odoo. |
| `hr.attendance` | Modelo donde se registran las entradas y salidas laborales. |
| `res.company` | Empresa a la que pertenece el empleado. |
| `res.partner` | Información de contacto relacionada con usuarios o empleados. |
| `location` | Datos de ubicación capturados desde el dispositivo móvil. |

---

### Relaciones principales

| Relación | Tipo | Descripción |
|---|---|---|
| `res.users` → `hr.employee` | 1:1 / 1:N | Un usuario de Odoo puede estar vinculado a uno o varios empleados según la configuración. |
| `hr.employee` → `hr.attendance` | 1:N | Un empleado puede tener múltiples registros de asistencia. |
| `res.company` → `hr.employee` | 1:N | Una empresa puede tener varios empleados. |
| `res.users` → `res.company` | N:1 | Un usuario pertenece a una empresa principal. |
| `location` → `hr.attendance` | 1:1 | La ubicación capturada puede asociarse al momento del registro de asistencia. |

---

### Representación simplificada

```text
res.company
    │
    └── hr.employee
            │
            └── hr.attendance
                    ├── check_in
                    ├── check_out
                    ├── latitude
                    └── longitude

res.users
    │
    └── hr.employee
```

---

## 📂 Estructura del proyecto

```bash
app-asistencia-odoo/
│
├── src/
│   │
│   ├── api/
│   │   └── odooApi.ts              # Comunicación con Odoo mediante JSON-RPC
│   │
│   ├── config/
│   │   └── config.tsx              # Configuración del servidor y variables globales
│   │
│   ├── hooks/
│   │   ├── useAttendanceMain.ts    # Lógica principal de asistencia
│   │   └── useLocation.ts          # Gestión de ubicación y permisos GPS
│   │
│   ├── components/                 # Componentes reutilizables
│   ├── screens/                    # Pantallas principales de la aplicación
│   └── services/                   # Servicios auxiliares
│
├── app.json                        # Configuración de Expo
├── package.json                    # Dependencias y scripts del proyecto
├── tsconfig.json                   # Configuración de TypeScript
└── README.md
```

---

## ⚙️ Configuración del proyecto

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/LucPinheiro/app-asistencia-odoo.git
cd app-asistencia-odoo
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar conexión con Odoo

Editar el archivo de configuración:

```bash
src/config/config.tsx
```

Ejemplo de configuración:

```ts
export const CONFIG = {
  URL: 'https://tu-servidor-odoo.com',
  DB: 'nombre_de_base_de_datos',
};
```

### 4️⃣ Configurar permisos de ubicación

Verificar que la configuración de Expo incluya permisos de localización para Android e iOS.

Ejemplo en `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "La aplicación necesita acceder a tu ubicación para registrar la asistencia."
        }
      ]
    ]
  }
}
```

### 5️⃣ Ejecutar la aplicación

```bash
npx expo start
```

Luego puedes abrir la aplicación mediante:

- Expo Go escaneando el código QR
- Emulador Android
- Simulador iOS
- Navegador web

---

## 🔐 Configuración de Odoo

Para que la aplicación funcione correctamente, Odoo debe tener activo el módulo de empleados y asistencia.

### Requisitos en Odoo

- Módulo de empleados instalado
- Módulo de asistencias instalado
- Usuario con permisos de acceso
- Empleado vinculado al usuario
- Acceso disponible a JSON-RPC

---

## 🔗 Comunicación con Odoo

La aplicación se comunica con Odoo mediante peticiones JSON-RPC.

### Ejemplo conceptual de petición

```ts
const response = await fetch(`${ODOO_URL}/jsonrpc`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'object',
      method: 'execute_kw',
      args: [
        DB,
        uid,
        password,
        'hr.attendance',
        'search_read',
        [[]],
      ],
    },
  }),
});
```

---

## 📍 Gestión de ubicación

La aplicación utiliza la ubicación del dispositivo para validar desde dónde se realiza el registro de asistencia.

### Funciones relacionadas

- Solicitud de permisos GPS
- Obtención de coordenadas actuales
- Validación antes del Check-In / Check-Out
- Manejo de errores si el permiso es denegado

---

## 🧠 Arquitectura del proyecto

El proyecto está organizado siguiendo una arquitectura modular:

| Capa | Responsabilidad |
|---|---|
| `api` | Comunicación externa con Odoo. |
| `config` | Variables globales y configuración del servidor. |
| `hooks` | Lógica reutilizable de negocio. |
| `screens` | Pantallas visibles para el usuario. |
| `components` | Elementos reutilizables de interfaz. |
| `services` | Funciones auxiliares y servicios internos. |

---

## 📱 Plataformas soportadas

| Plataforma | Estado |
|---|---|
| Android | ✅ Compatible |
| iOS | ✅ Compatible |
| Web | ✅ Compatible mediante Expo |

---

## 🔒 Seguridad y validaciones

- Validación de usuario autenticado
- Manejo de errores de conexión
- Validación de permisos de ubicación
- Separación de configuración por entorno
- Comunicación centralizada con Odoo
- Control del estado de asistencia

---

## 📸 Capturas de pantalla

> Próximamente se agregarán capturas de pantalla de la aplicación móvil.

### Pantallas planificadas

- Login de usuario
- Dashboard principal
- Registro de asistencia
- Validación GPS
- Integración con Odoo
- Modelo relacional del sistema

---

## 🚀 Posibles mejoras futuras

- Modo offline para registrar asistencias sin conexión
- Sincronización automática al recuperar internet
- Historial de asistencias del empleado
- Panel administrativo
- Notificaciones push
- Reconocimiento facial
- Firma digital
- Validación por zona geográfica
- Dashboard con métricas de asistencia

---

## 📦 Scripts disponibles

```bash
npm install
npm start
npx expo start
npx expo run:android
npx expo run:ios
```

---

## 👨‍💻 Autor

Desarrollado por [LucPinheiro](https://github.com/LucPinheiro)

---

## 📄 Licencia

Este proyecto se encuentra bajo la licencia MIT.
