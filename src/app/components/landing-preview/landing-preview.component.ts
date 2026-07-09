import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-landing-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="preview-container" id="preview-section">
      <!-- Toolbar y Tabs -->
      <div class="preview-toolbar">
        <div class="tabs-group">
          <div class="tabs">
            <button 
              class="tab-btn" 
              [class.active]="activeTab === 'preview'" 
              (click)="selectTab('preview')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Vista Previa
            </button>
            <button 
              class="tab-btn" 
              [class.active]="activeTab === 'edit'" 
              (click)="selectTab('edit')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Editar HTML / CSS
            </button>
            <button 
              class="tab-btn" 
              [class.active]="activeTab === 'markdown'" 
              (click)="selectTab('markdown')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Markdown Extraído
            </button>
          </div>

          <!-- Selector de Dispositivo (Sólo en Vista Previa) -->
          <div *ngIf="activeTab === 'preview'" class="device-switcher">
            <button 
              class="device-btn" 
              [class.active]="deviceMode === 'desktop'" 
              (click)="deviceMode = 'desktop'"
              title="Vista Escritorio (PC)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Escritorio
            </button>
            <button 
              class="device-btn" 
              [class.active]="deviceMode === 'tablet'" 
              (click)="deviceMode = 'tablet'"
              title="Vista Tablet"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              Tablet
            </button>
            <button 
              class="device-btn" 
              [class.active]="deviceMode === 'mobile'" 
              (click)="deviceMode = 'mobile'"
              title="Vista Móvil"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              Móvil
            </button>
          </div>

          <!-- Botón de Edición Visual -->
          <button 
            *ngIf="activeTab === 'preview'"
            class="visual-edit-toggle-btn"
            [class.active]="isVisualEditMode"
            (click)="toggleVisualEdit()"
            title="Editar textos directamente en la previsualización"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            {{ isVisualEditMode ? 'Guardar Cambios' : 'Editar Textos' }}
          </button>
        </div>

        <div class="actions">
          <button *ngIf="activeTab === 'edit'" class="action-btn apply-btn" (click)="applyChangesAndPreview()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Aplicar y Ver Vista Previa
          </button>
          <button class="action-btn" (click)="copyCode()" title="Copiar código al portapapeles">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            {{ copied ? '¡Copiado!' : 'Copiar' }}
          </button>
          <button class="action-btn download-btn" (click)="downloadHtml()" title="Descargar archivo HTML editado">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Descargar HTML
          </button>
        </div>
      </div>

      <!-- Panel de Estadísticas de Ahorro de Tokens -->
      <div class="token-savings-panel">
        <div class="savings-header">
          <div class="savings-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span>Ahorro del {{ savingsPercentage }}%</span>
          </div>
          <div class="savings-title-group">
            <h3>Eficiencia de Tokens (Preprocesamiento Markdown)</h3>
            <p>Al estructurar el PDF en Markdown limpio localmente, redujimos sustancialmente la carga hacia el modelo de Inteligencia Artificial.</p>
          </div>
        </div>

        <div class="savings-stats-grid">
          <!-- Tarjeta PDF Directo -->
          <div class="stat-card direct-pdf">
            <div class="stat-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <div class="stat-details">
              <span class="stat-label">PDF Directo (Multimodal)</span>
              <span class="stat-value">{{ pdfDirectTokens | number }} <span class="stat-unit">tokens</span></span>
              <span class="stat-desc">Procesamiento visual ({{ pdfPageCount }} {{ pdfPageCount === 1 ? 'pág' : 'págs' }}) + overhead binario</span>
            </div>
          </div>

          <!-- Flecha de Ahorro -->
          <div class="stat-arrow-divider">
            <div class="arrow-line"></div>
            <div class="savings-percentage-bubble">-{{ savingsPercentage }}%</div>
            <div class="arrow-line"></div>
          </div>

          <!-- Tarjeta Markdown Optimizado -->
          <div class="stat-card optimized-markdown">
            <div class="stat-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <div class="stat-details">
              <span class="stat-label">Vía Markdown (Texto Limpio)</span>
              <span class="stat-value theme-gradient-text">{{ markdownTokens | number }} <span class="stat-unit">tokens</span></span>
              <span class="stat-desc">{{ markdownLength | number }} caract. en Markdown ({{ formattedFileSize }})</span>
            </div>
          </div>

          <!-- Tarjeta Total Ahorro -->
          <div class="stat-card savings-total">
            <div class="stat-icon-wrapper success">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div class="stat-details">
              <span class="stat-label">Total Ahorrado</span>
              <span class="stat-value success-text">{{ tokensSaved | number }} <span class="stat-unit">tokens</span></span>
              <span class="stat-desc">Menor tiempo de respuesta y optimización de recursos</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel de Personalización de Diseño (Sólo en Vista Previa) -->
      <div *ngIf="activeTab === 'preview'" class="customizer-panel">
        <div class="panel-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 3.02 1.25 0 2.08-.53 2.5-1.5 1.12-2.58 3.56-1.52 5.06-1.52 1.66 0 3-1.35 3-3.02a3 3 0 0 0-3-3.02Z"/></svg>
          <span>Personalizar Estilos</span>
        </div>
        
        <div class="controls-grid">
          <div class="control-group">
            <label>Color Principal</label>
            <div class="color-picker-wrapper">
              <input type="color" [(ngModel)]="primaryColor" (change)="updateThemeStyles()" class="color-input">
              <span class="color-code">{{ primaryColor }}</span>
            </div>
          </div>
          
          <div class="control-group">
            <label>Color de Acento</label>
            <div class="color-picker-wrapper">
              <input type="color" [(ngModel)]="accentColor" (change)="updateThemeStyles()" class="color-input">
              <span class="color-code">{{ accentColor }}</span>
            </div>
          </div>

          <div class="control-group">
            <label>Fondo de Página</label>
            <div class="color-picker-wrapper">
              <input type="color" [(ngModel)]="bgColor" (change)="updateThemeStyles()" class="color-input">
              <span class="color-code">{{ bgColor }}</span>
            </div>
          </div>

          <div class="control-group">
            <label>Bordes ({{ borderRadius }}px)</label>
            <input type="range" min="0" max="30" step="2" [(ngModel)]="borderRadius" (input)="updateThemeStyles()" class="range-input">
          </div>
        </div>
      </div>

      <!-- Contenido según Tab -->
      <div class="preview-content">
        <!-- Live Preview Iframe con simulación responsiva -->
        <div [hidden]="activeTab !== 'preview'" class="iframe-container" [ngClass]="deviceMode">
          <div class="device-frame">
            <iframe 
              #previewIframe
              title="Landing Page Preview" 
              class="preview-iframe"
            ></iframe>
          </div>
        </div>

        <!-- Editor interactivo de código HTML/CSS -->
        <div *ngIf="activeTab === 'edit'" class="editor-wrapper">
          <div class="editor-header">
            <span>Puedes corregir cualquier detalle de texto o estilos aquí. Los cambios se actualizarán en la Vista Previa.</span>
          </div>
          <textarea 
            class="code-editor" 
            [(ngModel)]="editedHtml"
            placeholder="Escribe o modifica el código HTML/CSS aquí..."
            spellcheck="false"
          ></textarea>
        </div>

        <!-- Markdown Viewer -->
        <div *ngIf="activeTab === 'markdown'" class="code-wrapper">
          <pre><code>{{ markdownContent }}</code></pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .preview-container {
      max-width: 1300px;
      margin: 3rem auto 5rem auto;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(16px);
    }

    .preview-toolbar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      background: rgba(30, 41, 59, 0.7);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      gap: 1.25rem;
    }

    .tabs-group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.25rem;
    }

    .tabs, .device-switcher {
      display: flex;
      gap: 0.25rem;
      background: rgba(15, 23, 42, 0.6);
      padding: 4px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .tab-btn, .device-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: #94a3b8;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tab-btn.active {
      background: rgba(139, 92, 246, 0.25);
      color: #c084fc;
    }

    .device-btn.active {
      background: rgba(6, 182, 212, 0.2);
      color: #22d3ee;
    }

    .tab-btn:hover:not(.active), .device-btn:hover:not(.active) {
      color: #f1f5f9;
    }

    .visual-edit-toggle-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid rgba(139, 92, 246, 0.4);
      background: rgba(139, 92, 246, 0.1);
      color: #c084fc;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .visual-edit-toggle-btn.active {
      background: #8b5cf6;
      color: white;
      border-color: #8b5cf6;
      box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
    }

    .visual-edit-toggle-btn:hover:not(.active) {
      background: rgba(139, 92, 246, 0.2);
      color: #d8b4fe;
    }

    .customizer-panel {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.5rem;
      padding: 0.75rem 1.5rem;
      background: rgba(15, 23, 42, 0.45);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #94a3b8;
      font-size: 0.85rem;
      font-weight: 600;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      padding-right: 1.25rem;
    }

    .controls-grid {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.5rem;
      flex-grow: 1;
    }

    .control-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .control-group label {
      color: #94a3b8;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .color-picker-wrapper {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(15, 23, 42, 0.6);
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .color-input {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background-color: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
    }

    .color-input::-webkit-color-swatch {
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .color-code {
      font-family: monospace;
      font-size: 0.75rem;
      color: #cbd5e1;
    }

    .range-input {
      width: 100px;
      accent-color: #8b5cf6;
      cursor: pointer;
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .apply-btn {
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      border: none;
      color: white;
    }

    .apply-btn:hover {
      background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%);
    }

    .download-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: none;
      color: white;
    }

    .download-btn:hover {
      background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
    }

    .preview-content {
      min-height: 700px;
      background: #090d16;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 2rem 1rem;
      overflow-x: auto;
    }

    .iframe-container {
      width: 100%;
      display: flex;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .device-frame {
      width: 100%;
      height: 720px;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .iframe-container.desktop .device-frame {
      width: 100%;
      border-radius: 0;
    }

    .iframe-container.tablet .device-frame {
      width: 768px;
      border: 12px solid #1e293b;
      border-radius: 24px;
    }

    .iframe-container.mobile .device-frame {
      width: 375px;
      border: 14px solid #1e293b;
      border-radius: 36px;
    }

    .preview-iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: #ffffff;
    }

    .editor-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .editor-header {
      color: #94a3b8;
      font-size: 0.875rem;
      background: rgba(30, 41, 59, 0.4);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .code-editor {
      width: 100%;
      height: 650px;
      background: #090d16;
      color: #38bdf8;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 1.25rem;
      font-family: 'Fira Code', Consolas, Monaco, monospace;
      font-size: 0.9rem;
      line-height: 1.6;
      resize: vertical;
      outline: none;
      tab-size: 2;
    }

    .code-editor:focus {
      border-color: #a855f7;
      box-shadow: 0 0 15px rgba(168, 85, 247, 0.2);
    }

    .code-wrapper {
      width: 100%;
      padding: 1.5rem;
      max-height: 720px;
      overflow-y: auto;
      color: #e2e8f0;
      font-family: 'Fira Code', Consolas, Monaco, monospace;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .token-savings-panel {
      padding: 1.5rem 2rem;
      background: linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .savings-header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .savings-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: 9999px;
      white-space: nowrap;
    }

    .savings-title-group h3 {
      font-size: 1.1rem;
      color: #f1f5f9;
      margin: 0 0 2px 0;
      font-weight: 600;
    }

    .savings-title-group p {
      font-size: 0.8rem;
      color: #94a3b8;
      margin: 0;
    }

    .savings-stats-grid {
      display: grid;
      grid-template-columns: 1fr auto 1fr 1fr;
      align-items: center;
      gap: 1rem;
    }

    @media (max-width: 1024px) {
      .savings-stats-grid {
        grid-template-columns: 1fr;
      }
      .stat-arrow-divider {
        display: none !important;
      }
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 1rem 1.25rem;
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      border-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }

    .stat-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-radius: 10px;
      border: 1px solid rgba(239, 68, 68, 0.2);
      flex-shrink: 0;
    }

    .optimized-markdown .stat-icon-wrapper {
      background: rgba(139, 92, 246, 0.1);
      color: #a855f7;
      border: 1px solid rgba(139, 92, 246, 0.2);
    }

    .stat-icon-wrapper.success {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .stat-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 500;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #f1f5f9;
      line-height: 1.2;
    }

    .stat-unit {
      font-size: 0.8rem;
      font-weight: 500;
      color: #64748b;
    }

    .stat-desc {
      font-size: 0.7rem;
      color: #64748b;
    }

    .theme-gradient-text {
      background: linear-gradient(135deg, #c084fc 0%, #6366f1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .success-text {
      color: #34d399;
    }

    .stat-arrow-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      position: relative;
      height: 100%;
    }

    .arrow-line {
      flex-grow: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      min-width: 15px;
    }

    .savings-percentage-bubble {
      background: #10b981;
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 9999px;
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
      margin: 0 6px;
      white-space: nowrap;
    }

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
    }
  `]
})
export class LandingPreviewComponent implements OnChanges, AfterViewInit {
  @Input() generatedHtml: string = '';
  @Input() markdownContent: string = '';
  @Input() pdfPageCount: number = 1;
  @Input() pdfFileSize: number = 0;
  @ViewChild('previewIframe') iframeRef!: ElementRef<HTMLIFrameElement>;

  get markdownLength(): number {
    return this.markdownContent ? this.markdownContent.length : 0;
  }

  get markdownTokens(): number {
    // Estimación estándar: 1 token son ~4 caracteres en español
    return Math.max(12, Math.round(this.markdownLength / 4));
  }

  get pdfDirectTokens(): number {
    // Simulación del envío de PDF completo (procesamiento multimodal, visión artificial y overhead de formato binario)
    const pageFactor = (this.pdfPageCount || 1) * 1500;
    const textFactor = Math.round(this.markdownTokens * 2.5);
    return Math.max(150, pageFactor + textFactor);
  }

  get tokensSaved(): number {
    return Math.max(0, this.pdfDirectTokens - this.markdownTokens);
  }

  get savingsPercentage(): number {
    if (this.pdfDirectTokens === 0) return 0;
    return Math.round((this.tokensSaved / this.pdfDirectTokens) * 100);
  }

  get formattedFileSize(): string {
    if (!this.pdfFileSize) return '0 KB';
    if (this.pdfFileSize < 1024) return this.pdfFileSize + ' B';
    return (this.pdfFileSize / 1024).toFixed(1) + ' KB';
  }

  activeTab: 'preview' | 'edit' | 'markdown' = 'preview';
  deviceMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  editedHtml: string = '';
  copied = false;

  // Variables de Edición Visual y Personalización de Diseño
  isVisualEditMode = false;
  primaryColor = '#8b5cf6';
  accentColor = '#06b6d4';
  bgColor = '#090d16';
  borderRadius = 12;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['generatedHtml'] && this.generatedHtml) {
      this.editedHtml = this.generatedHtml;
      this.activeTab = 'preview';
      this.deviceMode = 'desktop';
      this.isVisualEditMode = false;
      this.extractThemeVariables();
      setTimeout(() => this.renderIframeContent(), 50);
    }
  }

  ngAfterViewInit(): void {
    this.renderIframeContent();
  }

  selectTab(tab: 'preview' | 'edit' | 'markdown') {
    this.activeTab = tab;
    if (tab === 'preview') {
      setTimeout(() => this.renderIframeContent(), 50);
    }
  }

  applyChangesAndPreview() {
    this.extractThemeVariables();
    this.selectTab('preview');
  }

  toggleVisualEdit() {
    this.isVisualEditMode = !this.isVisualEditMode;
    this.applyVisualEditState();
  }

  applyVisualEditState() {
    const doc = this.iframeRef?.nativeElement?.contentDocument || this.iframeRef?.nativeElement?.contentWindow?.document;
    if (!doc) return;

    // 1. Inyectar o remover estilos de asistencia visual (bordes punteados morados en hover/focus)
    let styleEl = doc.getElementById('edit-mode-styles');
    if (this.isVisualEditMode) {
      if (!styleEl) {
        styleEl = doc.createElement('style');
        styleEl.id = 'edit-mode-styles';
        styleEl.textContent = `
          [contenteditable="true"]:hover {
            outline: 2px dashed #8b5cf6 !important;
            outline-offset: 4px !important;
            cursor: text !important;
          }
          [contenteditable="true"]:focus {
            outline: 2px solid #8b5cf6 !important;
            outline-offset: 4px !important;
            background-color: rgba(139, 92, 246, 0.05) !important;
          }
        `;
        doc.head.appendChild(styleEl);
      }
    } else {
      if (styleEl) {
        styleEl.remove();
      }
    }

    // 2. Aplicar/remover atributo contenteditable en elementos de texto clave
    const editableSelectors = 'h1, h2, h3, h4, h5, h6, p, a, button, li, span';
    const elements = doc.querySelectorAll(editableSelectors);

    elements.forEach((el: any) => {
      if (this.isVisualEditMode) {
        el.setAttribute('contenteditable', 'true');
        el.onblur = () => {
          this.saveIframeHtmlToModel();
        };
      } else {
        el.removeAttribute('contenteditable');
        el.onblur = null;
      }
    });

    if (!this.isVisualEditMode) {
      this.saveIframeHtmlToModel();
    }
  }

  updateThemeStyles() {
    const doc = this.iframeRef?.nativeElement?.contentDocument || this.iframeRef?.nativeElement?.contentWindow?.document;
    if (doc) {
      let styleEl = doc.getElementById('custom-theme-overrides');
      if (!styleEl) {
        styleEl = doc.createElement('style');
        styleEl.id = 'custom-theme-overrides';
        doc.head.appendChild(styleEl);
      }
      styleEl.textContent = `
        :root {
          --primary: ${this.primaryColor} !important;
          --accent: ${this.accentColor} !important;
          --bg-main: ${this.bgColor} !important;
          --radius: ${this.borderRadius}px !important;
        }
      `;
    }
    this.saveIframeHtmlToModel();
  }

  private extractThemeVariables() {
    if (!this.editedHtml) return;

    const getVar = (varName: string, defaultVal: string): string => {
      const regex = new RegExp(`${varName}\\s*:\\s*([^;\\n}]+)`, 'i');
      const match = this.editedHtml.match(regex);
      return match ? match[1].trim() : defaultVal;
    };

    this.primaryColor = this.normalizeColor(getVar('--primary', '#8b5cf6'));
    this.accentColor = this.normalizeColor(getVar('--accent', '#06b6d4'));
    this.bgColor = this.normalizeColor(getVar('--bg-main', '#0f172a'));

    const radiusStr = getVar('--radius', '12px');
    const radiusMatch = radiusStr.match(/(\\d+)/);
    this.borderRadius = radiusMatch ? parseInt(radiusMatch[1], 10) : 12;
  }

  private normalizeColor(colorStr: string): string {
    colorStr = colorStr.trim();
    if (colorStr.startsWith('#')) {
      if (colorStr.length === 4) {
        return '#' + colorStr[1] + colorStr[1] + colorStr[2] + colorStr[2] + colorStr[3] + colorStr[3];
      }
      return colorStr.slice(0, 7);
    }
    if (colorStr.startsWith('rgb')) {
      const match = colorStr.match(/\\d+/g);
      if (match && match.length >= 3) {
        const r = parseInt(match[0], 10).toString(16).padStart(2, '0');
        const g = parseInt(match[1], 10).toString(16).padStart(2, '0');
        const b = parseInt(match[2], 10).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      }
    }
    return '#8b5cf6';
  }

  private saveIframeHtmlToModel() {
    const doc = this.iframeRef?.nativeElement?.contentDocument || this.iframeRef?.nativeElement?.contentWindow?.document;
    if (!doc) return;

    this.editedHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  }

  private getCleanHtml(htmlStr: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlStr, 'text/html');

    // Limpiar estilos temporales de edición
    const styleEl = doc.getElementById('edit-mode-styles');
    if (styleEl) {
      styleEl.remove();
    }

    // Limpiar atributos contenteditable
    const editables = doc.querySelectorAll('[contenteditable]');
    editables.forEach((el) => {
      el.removeAttribute('contenteditable');
    });

    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  }

  private renderIframeContent() {
    if (this.iframeRef && this.iframeRef.nativeElement && this.editedHtml) {
      const iframe = this.iframeRef.nativeElement;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(this.editedHtml);
        doc.close();

        // Aplicar el estado de edición visual y estilos si ya está activo
        setTimeout(() => {
          this.applyVisualEditState();
        }, 50);
      }
    }
  }

  copyCode() {
    const textToCopy = this.activeTab === 'markdown' 
      ? this.markdownContent 
      : this.getCleanHtml(this.editedHtml || this.generatedHtml);

    navigator.clipboard.writeText(textToCopy).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }

  downloadHtml() {
    const contentToDownload = this.getCleanHtml(this.editedHtml || this.generatedHtml);
    const blob = new Blob([contentToDownload], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landing-page-editada.html';
    a.click();
    URL.revokeObjectURL(url);
  }
}
