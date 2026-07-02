# 🖥️ TAP Terminal - Frontend Core

[![Angular](https://img.shields.io/badge/Angular-19.0.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Esta es la capa de interfaz de usuario de **TAP Terminal**, una Single Page Application (SPA) modular, responsiva y altamente optimizada desarrollada con **Angular 19** utilizando componentes *Standalone* y gestión de estado reactiva moderna.

---

## 🚀 Características Principales

* **Arquitectura Standalone:** Cero módulos complejos; ruteo directo y carga perezosa (*Lazy Loading*) por componente para minimizar el paquete inicial de transferencia.
* **Gestión del Estado mediante Signals:** Sincronización reactiva del estado local para optimizar los ciclos de renderizado del DOM sin sobrecargar la memoria.
* **Descarga Forzada de Datos Binarios (Blob):** Intercepción segura de streams binarios del backend para la exportación de reportes limpios a Excel (.xlsx) mediante inyección dinámica en el DOM del navegador.
* **Formatters Dinámicos:** Uso de pipes de Angular (`DatePipe`) para homologar marcas de tiempo crudas NoSQL en formatos amigables para el usuario final (`dd/MM/yyyy HH:mm`).

---

# 🔑 Credenciales de Acceso y Entorno de Pruebas
**Sistema:** TAP Terminal  
**Ambiente:** Producción / QA (Cloud Deployment)

Este documento centraliza los accesos, urls oficiales y usuarios de prueba requeridos por el equipo evaluador para validar el correcto funcionamiento de la plataforma.

---

## URLs Oficiales del Proyecto

| Capa del Sistema | Plataforma | URL de Acceso Publico |
| :--- | :--- | :--- |
| **Frontend (Interfaz)** | Vercel Edge | `https://tap-terminal-front.vercel.app` *(O tu link definitivo)* |
| **Backend (API REST)** | Render Cloud | `https://backend-tap-bqjk.onrender.com/api` |

---

## Cuentas de Usuario para Pruebas Avanzadas

La base de datos en **MongoDB Atlas** cuenta con los siguientes perfiles precargados para evaluar el comportamiento del ruteo reactivo, la validación de formularios y el control de accesos basado en permisos:

### A. Cuenta de Administrador Principal (Acceso Total)
* **Usuario (Email):** `brandon.martinez@tapterminal.com`
* **Contraseña:** `CvkttPel`
* **Rol Asignado:** Administrador (`PRF-001`)
* **Uso Recomendado:** Utilizar esta cuenta para validar el flujo completo de creación, edición, eliminación de usuarios/productos y la exportación de reportes binarios a Excel/PDF.

### B. Cuenta de Operador / Ventas (Permisos Limitados)
* **Usuario (Email):** `ventas@tapterminal.com`
* **Contraseña:** `Password123`
* **Rol Asignado:** Auxiliar de Almacén / Supervisor
* **Uso Recomendado:** Utilizar para probar las capas de seguridad del frontend, confirmando que los elementos restringidos del menú (como la gestión avanzada de perfiles) se oculten o deshabiliten dinámicamente según los permisos del Token.

### C. Auxiliar de Almacen (Permisos Limitados)
* **Usuario (Email):** `patricia.gomez@tapterminal.com`
* **Contraseña:** `Password123`
* **Rol Asignado:** Auxiliar de Almacén / Supervisor
* **Uso Recomendado:** Utilizar para probar las capas de seguridad del frontend, confirmando que los elementos restringidos del menú (como la gestión avanzada de perfiles) se oculten o deshabiliten dinámicamente según los permisos del Token, solo puede ver los productos y perfiles.
---

## Instrucciones de Consumo Externo (Postman / cURL)

Si el equipo de evaluación técnica prefiere consumir los endpoints directamente de forma aislada, todas las rutas (excepto `/login` y `/forgot-password`) requieren autenticación mediante un esquema **Bearer Token**.

### Paso 1: Obtener el Token (Login)
Enviar una petición `POST` al endpoint de autenticación:
```bash
curl --request POST \
  --url [https://backend-tap-bqjk.onrender.com/api/login](https://backend-tap-bqjk.onrender.com/api/login) \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
	"username": "brandon.martinez@tapterminal.com",
	"password": "admin123"
}'

---

## 🛠️ Stack Tecnológico

* **Framework:** Angular 19 (Componentes Standalone)
* **Estilos:** CSS3 Corporativo (Diseño adaptivo)
* **Manejo de Formularios:** ReactiveFormsModule (`FormGroup` con validaciones dinámicas)
* **Cliente HTTP:** HttpClient (RxJS Observables / Streams)
* **Despliegue:** Vercel Global Edge Network

---

## ⚙️ Configuración y Entorno Local

### 1. Variables de Entorno (`src/environments/`)
Asegúrate de configurar los endpoints del backend en tus archivos de entorno:

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: '[https://backend-tap-bqjk.onrender.com/api](https://backend-tap-bqjk.onrender.com/api)'
};

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
