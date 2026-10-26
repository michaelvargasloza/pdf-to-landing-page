import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenSavingsStats } from '../../../../models/landing-preview.model';

@Component({
  selector: 'app-token-savings-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './token-savings-panel.component.html',
  styleUrl: './token-savings-panel.component.css'
})
export class TokenSavingsPanelComponent {
  @Input() stats: TokenSavingsStats | null = null;
  @Input() pdfPageCount = 1;
}
