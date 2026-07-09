import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="uploader-section" id="upload-zone">
      <div class="section-header">
        <h2 class="section-title">Carga tu documento PDF</h2>
        <p class="section-subtitle">Arrastra y suelta tu archivo aquí o haz clic para explorarlo desde tu dispositivo.</p>
      </div>

      <div 
        class="drop-zone" 
        [class.dragging]="isDragging" 
        [class.disabled]="isLoading"
        (dragover)="onDragOver($event)" 
        (dragleave)="onDragLeave($event)" 
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
      >
        <input 
          #fileInput 
          type="file" 
          accept="application/pdf" 
          style="display: none;" 
          (change)="onFileSelected($event)"
          [disabled]="isLoading"
        >

        <div *if="!isLoading" class="drop-content">
          <div class="upload-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="upload-icon">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="M12 18v-6"></path>
              <path d="M9 15l3-3 3 3"></path>
            </svg>
          </div>
          <p class="drop-text-main">
            <span class="highlight-link">Haz clic para subir</span> o arrastra tu archivo PDF
          </p>
          <p class="drop-text-sub">Soporta archivos PDF hasta 20 MB</p>
        </div>

        <div *ngIf="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p class="loading-status">{{ statusMessage || 'Procesando archivo...' }}</p>
          <span class="loading-subtext">Esto tomará sólo unos segundos</span>
        </div>
      </div>

      <div *ngIf="errorMessage" class="error-banner">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  `,
  styles: [`
    .uploader-section {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }

    .section-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 0.5rem;
    }

    .section-subtitle {
      color: #94a3b8;
      font-size: 1rem;
    }

    .drop-zone {
      border: 2px dashed rgba(139, 92, 246, 0.4);
      background: rgba(30, 41, 59, 0.4);
      border-radius: 20px;
      padding: 3.5rem 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(12px);
      position: relative;
      overflow: hidden;
    }

    .drop-zone:hover, .drop-zone.dragging {
      border-color: #a855f7;
      background: rgba(139, 92, 246, 0.1);
      transform: scale(1.01);
      box-shadow: 0 8px 30px rgba(139, 92, 246, 0.25);
    }

    .drop-zone.disabled {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.9;
    }

    .drop-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .upload-icon-wrapper {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(139, 92, 246, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      color: #c084fc;
      transition: transform 0.3s ease;
    }

    .drop-zone:hover .upload-icon-wrapper {
      transform: translateY(-4px) scale(1.05);
      color: #e9d5ff;
    }

    .drop-text-main {
      color: #f1f5f9;
      font-size: 1.125rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .highlight-link {
      color: #c084fc;
      font-weight: 700;
      text-decoration: underline;
      text-underline-offset: 4px;
    }

    .drop-text-sub {
      color: #64748b;
      font-size: 0.875rem;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(168, 85, 247, 0.2);
      border-top: 4px solid #a855f7;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1.5rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-status {
      font-size: 1.125rem;
      font-weight: 600;
      color: #f8fafc;
      margin-bottom: 0.25rem;
    }

    .loading-subtext {
      font-size: 0.875rem;
      color: #94a3b8;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
      padding: 1rem 1.25rem;
      border-radius: 12px;
      margin-top: 1.5rem;
      font-size: 0.95rem;
    }
  `]
})
export class PdfUploaderComponent {
  @Input() isLoading = false;
  @Input() statusMessage = '';
  @Input() errorMessage = '';
  @Output() fileSelected = new EventEmitter<File>();

  isDragging = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        this.fileSelected.emit(file);
      } else {
        alert('Por favor selecciona un archivo en formato PDF.');
      }
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.fileSelected.emit(files[0]);
    }
  }
}
