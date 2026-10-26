import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveTab, DeviceMode } from '../../../../models/landing-preview.model';

@Component({
  selector: 'app-preview-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-toolbar.component.html',
  styleUrl: './preview-toolbar.component.css'
})
export class PreviewToolbarComponent {
  @Input() activeTab: ActiveTab = 'preview';
  @Input() deviceMode: DeviceMode = 'desktop';
  @Input() isVisualEditMode = false;
  @Input() copied = false;

  @Output() tabSelected = new EventEmitter<ActiveTab>();
  @Output() deviceModeChanged = new EventEmitter<DeviceMode>();
  @Output() visualEditToggled = new EventEmitter<void>();
  @Output() changesApplied = new EventEmitter<void>();
  @Output() codeCopied = new EventEmitter<void>();
  @Output() htmlDownloaded = new EventEmitter<void>();

  selectTab(tab: ActiveTab): void {
    this.tabSelected.emit(tab);
  }

  selectDeviceMode(mode: DeviceMode): void {
    this.deviceModeChanged.emit(mode);
  }

  toggleVisualEdit(): void {
    this.visualEditToggled.emit();
  }

  applyChangesAndPreview(): void {
    this.changesApplied.emit();
  }

  copyCode(): void {
    this.codeCopied.emit();
  }

  downloadHtml(): void {
    this.htmlDownloaded.emit();
  }
}
