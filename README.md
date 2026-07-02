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
