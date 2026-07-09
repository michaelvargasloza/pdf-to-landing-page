import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  constructor() {}

  private async getClientAndConfig(): Promise<{ client: GoogleGenAI | null; apiKey: string; modelName: string }> {
    let apiKey = '';
    let modelName = 'gemini-2.5-flash';

    try {
      const response = await fetch('/config.json');
      if (response.ok) {
        const config = await response.json();
        apiKey = config.geminiApiKey || '';
        modelName = config.geminiModel || 'gemini-2.5-flash';
      }
    } catch (e) {
      console.warn('No se pudo cargar config.json, usando environment:', e);
    }

    // Fallback a environment si no se pudo leer de config.json
    if (!apiKey || apiKey === 'TU_GEMINI_API_KEY') {
      apiKey = environment.geminiApiKey;
      modelName = environment.geminiModel || 'gemini-2.5-flash';
    }

    let client: GoogleGenAI | null = null;
    if (apiKey && apiKey !== 'TU_GEMINI_API_KEY') {
      try {
        client = new GoogleGenAI({ apiKey });
      } catch (e) {
        console.warn('Error inicializando GoogleGenAI:', e);
      }
    }

    return { client, apiKey, modelName };
  }

  async generateLandingPage(markdownContent: string): Promise<string> {
    const { client, apiKey, modelName } = await this.getClientAndConfig();

    if (!apiKey || apiKey === 'TU_GEMINI_API_KEY') {
      throw new Error('Por favor configura tu GEMINI_API_KEY en el archivo .env');
    }

    const systemPrompt = `Eres un Director de Arte UX/UI y Desarrollador Frontend Senior de clase mundial.
Tu objetivo es transformar el contenido Markdown extraído de un archivo PDF en una Landing Page Web EXCEPCIONAL, ULTRA-MODERNA, MINIMALISTA y PROFUNDAMENTE ESTILIZADA con CSS avanzado y JavaScript interactivo.

INSTRUCCIONES CRÍTICAS DE NAVEGACIÓN Y DISEÑO (OBLIGATORIAS):

1. **MENÚ HAMBURGUESA RESPONSIVO PARA MÓVIL Y TABLET (OBLIGATORIO)**:
   - **En PC / Escritorio (>768px)**: Los enlaces de navegación (Inicio, Servicios, Beneficios, Contacto, etc.) se muestran horizontalmente en el Header. El botón hamburguesa está oculto.
   - **En Móvil y Tablet (<=768px)**: Oculta los enlaces horizontales y MUESTRA un botón moderno de Menú Hamburguesa con icono SVG.
   - **Interactividad**: Incluye un script nativo en <script> antes de </body> que escuche el evento 'click' en el botón hamburguesa y alterne la clase 'active' en el contenedor de navegación (ej: document.getElementById('menu-toggle').addEventListener('click', () => document.getElementById('nav-menu').classList.toggle('active'))).
   - **Estilo del Menú Desplegable**: Cuando la clase 'active' está presente en móvil, el menú debe desplegarse como una tarjeta flotante o panel deslizante elegante con blur de fondo, animación suave (transition) y bordes redondeados.

2. **ANÁLISIS DE RUBRO E IDENTIDAD DE MARCA**:
   - Analiza el texto para identificar el sector o rubro de la empresa (ej. Tecnología/SaaS, Finanzas, Salud, Consultoría, Bienes Raíces, Educación, etc.).
   - Infiere los colores corporativos predominantes y crea una paleta armónica y elegante. Usa variables CSS en :root (--primary, --primary-hover, --accent, --bg-main, --bg-card, --text-title, --text-body, --border-color, --radius).

3. **CÓDIGO CSS EXHAUSTIVO Y MINIMALISTA (DENTRO DE <style>)**:
   - Importa fuentes premium de Google Fonts (como 'Plus Jakarta Sans', 'Inter' o 'Outfit').
   - Header flotante con posición fija o sticky y backdrop-filter: blur(12px).
   - Logotipo corporativo vectorizado (combina un ícono SVG estilizado y el nombre de la empresa).
   - Hero Section de gran impacto con título en gradiente, subtítulo limpio y botones CTA (Llamado a la Acción) atractivos.
   - Grid de Tarjetas estilizadas (display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))) con iconos SVG y animaciones hover.
   - Pie de página (Footer) minimalista y elegante.

4. **FORMATO DE SALIDA**:
   - Retorna ÚNICAMENTE el código HTML completo desde <!DOCTYPE html> hasta </html>.
   - NO agregues saludos, explicaciones ni envoltorios markdown fuera del código HTML puro.

Contenido Markdown del documento PDF a transformar:
${markdownContent}`;

    try {
      const responseText = await this.executeWithFallback(systemPrompt, modelName, apiKey, client);

      // Extracción robusta de HTML usando expresiones regulares
      let cleanHtml = responseText.trim();

      // Buscar si viene envuelto en bloque de código ```html ... ``` o ``` ... ```
      const markdownBlockMatch = cleanHtml.match(/```(?:html)?\s*([\s\S]*?)\s*```/i);
      if (markdownBlockMatch && markdownBlockMatch[1]) {
        cleanHtml = markdownBlockMatch[1].trim();
      } else {
        // Buscar la estructura <!DOCTYPE html> ... </html> o <html> ... </html>
        const htmlDocMatch = cleanHtml.match(/(<!DOCTYPE html[\s\S]*<\/html>|<html[\s\S]*<\/html>)/i);
        if (htmlDocMatch && htmlDocMatch[1]) {
          cleanHtml = htmlDocMatch[1].trim();
        }
      }

      return cleanHtml;
    } catch (error: any) {
      console.error('Error invocando el servicio de IA:', error);
      throw new Error(error.message || 'Error al conectar con el servicio de Inteligencia Artificial.');
    }
  }

  private async executeWithFallback(systemPrompt: string, primaryModel: string, apiKey: string, client: GoogleGenAI | null): Promise<string> {
    const modelsToTry = [primaryModel, 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash']
      .filter((model, index, self) => self.indexOf(model) === index);

    let lastError: any = null;

    for (const model of modelsToTry) {
      console.log(`Intentando generar contenido con el modelo: ${model}`);
      const attempts = 2; // Máximo 2 intentos por modelo
      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          return await this.callModel(client, model, systemPrompt, apiKey);
        } catch (error: any) {
          lastError = error;
          console.warn(`Error en el modelo ${model} (intento ${attempt}/${attempts}):`, error);

          // Si el error es por API Key inválida, no reintentamos ni cambiamos de modelo
          const errorMsg = error.message || '';
          if (
            errorMsg.includes('API_KEY_INVALID') ||
            errorMsg.includes('API key not valid') ||
            errorMsg.includes('invalid api key') ||
            (errorMsg.includes('API key') && errorMsg.includes('not found'))
          ) {
            throw error;
          }

          // Si no es el último intento de este modelo, esperar antes de reintentar
          if (attempt < attempts) {
            const delay = attempt * 1500; // 1.5s, 3s...
            console.log(`Esperando ${delay}ms antes del reintento...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      console.warn(`El modelo ${model} falló todos los intentos. Probando el siguiente modelo de respaldo.`);
    }

    throw lastError || new Error('Todos los modelos fallaron al intentar procesar la solicitud.');
  }

  private async callModel(client: GoogleGenAI | null, modelName: string, systemPrompt: string, apiKey: string): Promise<string> {
    if (client) {
      const response = await client.models.generateContent({
        model: modelName,
        contents: systemPrompt
      });
      return response.text || '';
    } else {
      // Fallback vía API REST directa de Gemini
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Error HTTP ${res.status}`);
      }

      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }
  }
}
