import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-uploader.component.html',
  styleUrl: './pdf-uploader.component.css'
})
export class PdfUploaderComponent {
  @Input() isLoading = false;
  @Input() statusMessage = '';
  @Input() errorMessage = '';
  @Output() fileSelected = new EventEmitter<File>();

  isDragging = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileSelected.emit(input.files[0]);
    }
  }
}
