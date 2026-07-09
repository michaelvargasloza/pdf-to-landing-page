import { Injectable } from '@angular/core';

declare const require: any;

@Injectable({
  providedIn: 'root'
})
export class PdfParserService {
  private pdfjsLib: any;

  constructor() {
    this.initPdfJs();
  }

  private async initPdfJs() {
    try {
      this.pdfjsLib = await import('pdfjs-dist');
      if (this.pdfjsLib && this.pdfjsLib.GlobalWorkerOptions) {
        this.pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      }
    } catch (e) {
      console.warn('PDF.js worker dynamically loading fallback:', e);
    }
  }

  async parsePdfToMarkdown(file: File): Promise<{ markdown: string; pageCount: number; fileSize: number }> {
    if (!this.pdfjsLib) {
      await this.initPdfJs();
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        try {
          const typedarray = new Uint8Array(event.target.result);
          const loadingTask = this.pdfjsLib.getDocument({ data: typedarray });
          const pdf = await loadingTask.promise;
          
          let fullMarkdown = `# ${file.name.replace(/\.[^/.]+$/, "")}\n\n`;

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            let lastY: number | null = null;
            let pageText = '';
            let isFirstLine = true;

            for (const item of textContent.items) {
              if (!item.str) continue;

              // Detect new lines based on Y coordinate change
              const currentY = item.transform[5];
              if (lastY !== null && Math.abs(currentY - lastY) > 5) {
                pageText += '\n';
              }

              pageText += item.str + ' ';
              lastY = currentY;
            }

            // Post-process lines to convert into Markdown format
            const lines = pageText.split('\n');
            for (let line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;

              // Simple heuristics for titles and bullet points
              if (trimmed.length < 50 && (trimmed === trimmed.toUpperCase() || isFirstLine)) {
                if (isFirstLine && pageNum === 1) {
                  // Already added main title
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
