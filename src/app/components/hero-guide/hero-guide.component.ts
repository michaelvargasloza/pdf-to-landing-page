import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-guide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-guide.component.html',
  styleUrl: './hero-guide.component.css'
})
export class HeroGuideComponent {
  @Output() onStart = new EventEmitter<void>();

  scrollToUpload(): void {
    this.onStart.emit();
  }
}
