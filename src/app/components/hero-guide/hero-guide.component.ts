import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-guide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-container">
      <div class="badge">
        <span class="badge-dot"></span> Potenciado por Inteligencia Artificial
      </div>
      
      <h1 class="hero-title">
        Transforma tus documentos <span class="highlight-gradient">PDF</span> en <span class="highlight-gradient">Landing Pages</span> de alto impacto
      </h1>

      <p class="hero-subtitle">
        Convierte automáticamente archivos PDF en formato Markdown enriquecido y deja que nuestro asistente de inteligencia artificial diseñe una página web moderna, profesional y responsiva en cuestión de segundos.
      </p>

      <div class="action-buttons">
        <button class="btn-primary" (click)="scrollToUpload()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Comenzar conversión
        </button>
        <a class="btn-secondary" href="#how-it-works">
          ¿Cómo funciona?
        </a>
      </div>

      <!-- Guía paso a paso -->
      <div id="how-it-works" class="steps-grid">
        <div class="step-card">
          <div class="step-icon icon-purple">1</div>
          <h3>1. Carga tu PDF</h3>
          <p>Arrastra o selecciona cualquier documento PDF con información comercial, servicios o propuesta.</p>
        </div>

        <div class="step-card">
          <div class="step-icon icon-blue">2</div>
          <h3>2. Conversión a Markdown</h3>
          <p>El sistema extrae el texto estructurado, títulos, listas y formato clave de forma instantánea.</p>
        </div>

        <div class="step-card">
          <div class="step-icon icon-cyan">3</div>
          <h3>3. Generación con IA</h3>
          <p>El motor de Inteligencia Artificial analiza el contenido y diseña un HTML/CSS ultramoderno con animación y estilo.</p>
        </div>

        <div class="step-card">
          <div class="step-icon icon-emerald">4</div>
          <h3>4. Previsualiza y Exporta</h3>
          <p>Examina el resultado interactivo en tiempo real, copia el código o descarga el paquete HTML final.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 4rem 1.5rem 2rem 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 9999px;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.3);
      color: #c084fc;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      backdrop-filter: blur(10px);
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #a855f7;
      box-shadow: 0 0 10px #a855f7;
    }

    .hero-title {
      font-size: 3rem;
      line-height: 1.15;
      font-weight: 800;
      color: #ffffff;
      max-width: 900px;
      margin-bottom: 1.25rem;
      letter-spacing: -0.02em;
    }

    @media (min-width: 768px) {
      .hero-title {
        font-size: 4rem;
      }
    }

    .highlight-gradient {
      background: linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 1.125rem;
      color: #94a3b8;
      max-width: 750px;
      line-height: 1.6;
      margin-bottom: 2.5rem;
    }

    .action-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 4rem;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      color: white;
      padding: 0.875rem 2rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(139, 92, 246, 0.6);
      background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%);
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      color: #e2e8f0;
      padding: 0.875rem 2rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.1);
      text-decoration: none;
      transition: all 0.25s ease;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1.5rem;
      width: 100%;
      text-align: left;
      margin-top: 2rem;
    }

    @media (min-width: 640px) {
      .steps-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .steps-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .step-card {
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.75rem;
      backdrop-filter: blur(12px);
      transition: transform 0.3s ease, border-color 0.3s ease;
    }

    .step-card:hover {
      transform: translateY(-4px);
      border-color: rgba(139, 92, 246, 0.4);
    }

    .step-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .icon-purple { background: rgba(168, 85, 247, 0.2); color: #c084fc; }
    .icon-blue { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .icon-cyan { background: rgba(6, 182, 212, 0.2); color: #22d3ee; }
    .icon-emerald { background: rgba(16, 185, 129, 0.2); color: #34d399; }

    .step-card h3 {
      color: #f8fafc;
      font-size: 1.125rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .step-card p {
      color: #94a3b8;
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0;
    }
  `]
})
export class HeroGuideComponent {
  @Output() onStart = new EventEmitter<void>();

  scrollToUpload() {
    this.onStart.emit();
  }
}
