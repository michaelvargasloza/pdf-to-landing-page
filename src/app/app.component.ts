import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroGuideComponent } from './components/hero-guide/hero-guide.component';
import { PdfUploaderComponent } from './components/pdf-uploader/pdf-uploader.component';
import { LandingPreviewComponent } from './components/landing-preview/landing-preview.component';
import { PdfParserService } from './services/pdf-parser.service';
import { GeminiService } from './services/gemini.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeroGuideComponent,
    PdfUploaderComponent,
    LandingPreviewComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PdfToLanding AI';
  isLoading = false;
  statusMessage = '';
  errorMessage = '';
  
  markdownContent = '';
  generatedHtml = '';
  pdfPageCount = 1;
  pdfFileSize = 0;

  constructor(
    private pdfParserService: PdfParserService,
    private geminiService: GeminiService
  ) {}

  onStartUpload() {
    const uploadElement = document.getElementById('upload-zone');
    if (uploadElement) {
      uploadElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  async onFileSelected(file: File) {
    this.isLoading = true;
    this.errorMessage = '';
    this.statusMessage = 'Extrayendo texto del PDF y convirtiendo a Markdown...';

    try {
      const parsedPdf = await this.pdfParserService.parsePdfToMarkdown(file);
      this.markdownContent = parsedPdf.markdown;
      this.pdfPageCount = parsedPdf.pageCount;
      this.pdfFileSize = parsedPdf.fileSize;
      
      this.statusMessage = 'La Inteligencia Artificial está diseñando tu Landing Page...';
      this.generatedHtml = await this.geminiService.generateLandingPage(this.markdownContent);

      this.isLoading = false;

      setTimeout(() => {
        const previewElement = document.getElementById('preview-section');
        if (previewElement) {
          previewElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);

    } catch (error: any) {
      console.error('Error durante el flujo de trabajo:', error);
      this.isLoading = false;
      this.errorMessage = error.message || 'Ocurrió un error inesperado al procesar tu archivo.';
    }
  }
}
