# 📱 App Asistencia Odoo

Aplicación móvil de control de asistencia desarrollada con **React Native + Expo** e integrada directamente con **Odoo** mediante **JSON-RPC**.

El sistema permite a los empleados registrar entradas y salidas desde dispositivos móviles, incorporando validación de ubicación geográfica, configuración de entornos y sincronización en tiempo real con el ERP Odoo.

---

# 🚀 Demo y propósito

Esta aplicación fue creada como una solución móvil para digitalizar el control de asistencia empresarial conectado con Odoo, facilitando:

- Registro de jornada laboral desde cualquier lugar
- Validación de ubicación del empleado
- Comunicación directa con Odoo ERP
- Gestión multiplataforma desde una única base de código

---

# 🛠️ Tecnologías utilizadas

## Frontend móvil

- React Native
- Expo
- TypeScript

## Backend / Integración

- Odoo JSON-RPC API
- Node.js
- npm

## Herramientas de desarrollo

- Expo CLI
- EAS Build
- Android Studio
- Xcode

---

# ✨ Funcionalidades principales

## ✅ Registro de asistencia

- Check-In
- Check-Out
- Control de sesiones de trabajo

## ✅ Integración con Odoo

- Autenticación mediante JSON-RPC
- Comunicación directa con modelos de Odoo
- Sincronización en tiempo real

## ✅ Validación de ubicación

- Obtención de coordenadas GPS
- Verificación de permisos
- Restricción basada en localización

## ✅ Configuración de entornos

- Desarrollo
- Producción
- Configuración centralizada

## ✅ Compatibilidad multiplataforma

- Android
- iOS
- Web (Expo)

## ✅ Ejecución rápida con Expo

- Soporte QR
- Hot Reload
- Testing rápido en dispositivos físicos

---

# 📂 Estructura del proyecto

```bash
src/
│
├── api/
│   └── odooApi.ts           # Comunicación JSON-RPC con Odoo
│
├── config/
│   └── config.tsx           # Variables y configuración global
│
├── hooks/
│   ├── useAttendanceMain.ts # Lógica principal de asistencia
│   └── useLocation.ts       # Gestión de geolocalización
│
├── screens/                 # Pantallas de la aplicación
├── components/              # Componentes reutilizables
└── services/                # Servicios auxiliares
```

---

# ⚙️ Configuración del proyecto

## 1️⃣ Clonar repositorio

```bash
git clone https://github.com/LucPinheiro/app-asistencia-odoo.git
cd app-asistencia-odoo
```

---

## 2️⃣ Instalar dependencias

```bash
npm install
```

---

## 3️⃣ Configurar conexión Odoo

Editar archivo:

```bash
config.tsx
```

Configurar:

```ts
export const CONFIG = {
  URL: 'https://tu-servidor-odoo.com',
  DB: 'nombre_bd',
};
```

---

## 4️⃣ Ejecutar proyecto

```bash
npx expo start
```

---

# 📍 Permisos requeridos

La aplicación requiere permisos de:

- Ubicación GPS
- Acceso a red
- Ejecución móvil

---

# 🔗 Comunicación con Odoo

La integración se realiza mediante:

- JSON-RPC
- Autenticación de usuarios
- Llamadas a modelos Odoo
- Gestión de asistencia (`hr.attendance`)

---

# 📱 Plataformas soportadas

| Plataforma | Estado |
|---|---|
| Android | ✅ |
| iOS | ✅ |
| Web | ✅ |

---

# 🧠 Arquitectura

La aplicación sigue una arquitectura modular basada en:

- Hooks personalizados
- Separación de lógica y UI
- Servicios reutilizables
- Configuración centralizada

---

# 🔒 Seguridad y validaciones

- Validación de autenticación
- Control de permisos GPS
- Manejo de errores de conexión
- Configuración por entornos

---

# 📸 Capturas

> Aquí puedes agregar screenshots de:

- Pantalla de login
- Check-In / Check-Out
- Validación GPS
- Dashboard principal

---

# 🚀 Posibles mejoras futuras

- Notificaciones push
- Modo offline
- Historial de asistencias
- Dashboard administrativo
- Reconocimiento facial
- Firma digital

---

# 👨‍💻 Autor

Desarrollado por [LucPinheiro](https://github.com/LucPinheiro)

---

# 📄 Licencia

Este proyecto se encuentra bajo la licencia MIT.
