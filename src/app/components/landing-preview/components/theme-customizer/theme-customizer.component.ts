import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeCustomizerConfig } from '../../../../models/landing-preview.model';

@Component({
  selector: 'app-theme-customizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './theme-customizer.component.html',
  styleUrl: './theme-customizer.component.css'
})
export class ThemeCustomizerComponent {
  @Input() config: ThemeCustomizerConfig = {
    primaryColor: '#8b5cf6',
    accentColor: '#06b6d4',
    bgColor: '#090d16',
    borderRadius: 12
  };

  @Output() configChange = new EventEmitter<ThemeCustomizerConfig>();

  onColorChange(field: 'primaryColor' | 'accentColor' | 'bgColor', value: string): void {
    this.config = {
      ...this.config,
      [field]: value
    };
    this.configChange.emit(this.config);
  }

  onRadiusChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.config = {
      ...this.config,
      borderRadius: parseInt(input.value, 10) || 0
    };
    this.configChange.emit(this.config);
  }
}
