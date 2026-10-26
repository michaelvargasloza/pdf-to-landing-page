import { Injectable } from '@angular/core';
import { PdfParseResult } from '../models/pdf-parse-result.model';

@Injectable({
  providedIn: 'root'
})
export class PdfParserService {
  private pdfjsLib: typeof import('pdfjs-dist') | null = null;

  constructor() {
    this.initPdfJs();
  }

  private async initPdfJs(): Promise<void> {
    try {
      this.pdfjsLib = await import('pdfjs-dist');
      if (this.pdfjsLib && this.pdfjsLib.GlobalWorkerOptions) {
        this.pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      }
    } catch (e) {
      console.warn('PDF.js worker dynamically loading fallback:', e);
    }
  }

  async parsePdfToMarkdown(file: File): Promise<PdfParseResult> {
    if (!this.pdfjsLib) {
      await this.initPdfJs();
    }

    return new Promise<PdfParseResult>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event: ProgressEvent<FileReader>) => {
        try {
          if (!this.pdfjsLib) {
            throw new Error('No se pudo inicializar la libreria PDF.js');
          }

          const buffer = event.target?.result as ArrayBuffer;
          const typedarray = new Uint8Array(buffer);
          const loadingTask = this.pdfjsLib.getDocument({ data: typedarray });
          const pdf = await loadingTask.promise;
          
          let fullMarkdown = `# ${file.name.replace(/\.[^/.]+$/, '')}\n\n`;

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            let lastY: number | null = null;
            let pageText = '';
            let isFirstLine = true;

            for (const item of textContent.items) {
              const textItem = item as { str?: string; transform?: number[] };
              if (!textItem.str) continue;

              const currentY = textItem.transform ? textItem.transform[5] : 0;
              if (lastY !== null && Math.abs(currentY - lastY) > 5) {
                pageText += '\n';
              }

              pageText += textItem.str + ' ';
              lastY = currentY;
            }

            const lines = pageText.split('\n');
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;

              if (trimmed.length < 50 && (trimmed === trimmed.toUpperCase() || isFirstLine)) {
                if (isFirstLine && pageNum === 1) {
                  isFirstLine = false;
                  continue;
                }
                fullMarkdown += `## ${trimmed}\n\n`;
              } else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
                fullMarkdown += `- ${trimmed.replace(/^[•\-\*]\s*/, '')}\n`;
              } else if (/^\d+[\.\)]\s/.test(trimmed)) {
                fullMarkdown += `${trimmed}\n`;
              } else {
                fullMarkdown += `${trimmed}\n\n`;
              }
              isFirstLine = false;
            }
          }

          resolve({
            markdown: fullMarkdown.trim(),
            pageCount: pdf.numPages,
            fileSize: file.size
          });
        } catch (error) {
          console.error('Error procesando PDF:', error);
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }
}
