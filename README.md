# PDFToLanding AI

Transforma tus documentos PDF en Landing Pages básicas, profesionales y estilizadas utilizando Inteligencia Artificial (IA).

Este proyecto permite extraer la estructura y contenidos clave de cualquier archivo PDF, convertirlos a formato Markdown (Tokens) y mediante un motor de IA, diseñar una página web moderna, responsiva e interactiva lista para usarse.

---

## ¿Cómo funciona? (Paso a paso)

1. **Carga tu PDF**
   Arrastra o selecciona cualquier documento PDF con información comercial, servicios o propuesta.

2. **Conversión a Markdown**
   El sistema extrae el texto estructurado, títulos, listas y formato clave de forma instantánea.

3. **Generación con IA**
   El motor de IA analiza el contenido y diseña un HTML/CSS básico con animación y estilo.

4. **Previsualiza y Exporta**
   Examina el resultado interactivo en tiempo real, personaliza textos o estilos (colores, bordes) directamente desde la previsualización, copia el código o descarga el paquete HTML final.

---

## Herramientas utilizadas

El proyecto está construido bajo una arquitectura web moderna y liviana:
- **Angular 18**: Framework para la estructura de la aplicación y manejo del estado.
- **TypeScript**: Programación tipada segura para la robustez del código.
- **Vanilla CSS**: Diseño personalizado premium con animaciones fluidas, variables dinámicas `:root` y efectos de desenfoque.
- **PDF.js**: Motor especializado para parsear y extraer textos estructurados desde documentos PDF del lado del cliente.
- **SDK de IA**: Integración de lenguaje generativo para el diseño del frontend.

---

## Comandos para ejecutar el proyecto

Sigue estos pasos para instalar y arrancar la aplicación en tu entorno local:

### 1. Requisitos previos
Asegúrate de tener instalado:
- **Node.js** (versión v18 o superior recomendada)
- **npm** (incluido con Node.js)

### 2. Instalación de dependencias
Abre la consola en el directorio raíz del proyecto y ejecuta:
```bash
npm install
```

### 3. Configuración de entorno
Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:
```env
GEMINI_API_KEY=TU_GEMINI_API_KEY
```
*(Nota: Este archivo almacena de forma segura la clave de API necesaria para conectar con el servicio de IA).*

### 4. Servidor de desarrollo
Para compilar y ejecutar el servidor local de desarrollo:
```bash
npm start
```
Una vez iniciado, navega a `http://localhost:4200/` en tu navegador (o la dirección que aparezca en la terminal). La aplicación se recargará automáticamente al realizar cualquier cambio en los archivos de origen.

### 5. Compilación para producción
Para generar los entregables optimizados listos para desplegar:
```bash
npm run build
```
Los archivos compilados se guardarán en el directorio `dist/pdftolanding/`.
