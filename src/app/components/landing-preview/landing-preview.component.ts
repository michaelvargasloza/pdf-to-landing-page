import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActiveTab, DeviceMode, ThemeCustomizerConfig, TokenSavingsStats } from '../../models/landing-preview.model';
import { PreviewToolbarComponent } from './components/preview-toolbar/preview-toolbar.component';
import { TokenSavingsPanelComponent } from './components/token-savings-panel/token-savings-panel.component';
import { ThemeCustomizerComponent } from './components/theme-customizer/theme-customizer.component';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';

@Component({
  selector: 'app-landing-preview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PreviewToolbarComponent,
    TokenSavingsPanelComponent,
    ThemeCustomizerComponent,
    CodeEditorComponent
  ],
  templateUrl: './landing-preview.component.html',
  styleUrl: './landing-preview.component.css'
})
export class LandingPreviewComponent implements OnChanges, AfterViewInit {
  @Input() generatedHtml = '';
  @Input() markdownContent = '';
  @Input() pdfPageCount = 1;
  @Input() pdfFileSize = 0;
  @ViewChild('previewIframe') iframeRef!: ElementRef<HTMLIFrameElement>;

  activeTab: ActiveTab = 'preview';
  deviceMode: DeviceMode = 'desktop';
  editedHtml = '';
  copied = false;
  isVisualEditMode = false;

  themeConfig: ThemeCustomizerConfig = {
    primaryColor: '#8b5cf6',
    accentColor: '#06b6d4',
    bgColor: '#090d16',
    borderRadius: 12
  };

  get tokenStats(): TokenSavingsStats {
    const markdownLength = this.markdownContent ? this.markdownContent.length : 0;
    const markdownTokens = Math.max(12, Math.round(markdownLength / 4));
    const pageFactor = (this.pdfPageCount || 1) * 1500;
    const textFactor = Math.round(markdownTokens * 2.5);
    const pdfDirectTokens = Math.max(150, pageFactor + textFactor);
    const tokensSaved = Math.max(0, pdfDirectTokens - markdownTokens);
    const savingsPercentage = pdfDirectTokens === 0 ? 0 : Math.round((tokensSaved / pdfDirectTokens) * 100);

    let formattedFileSize = '0 KB';
    if (this.pdfFileSize) {
      formattedFileSize = this.pdfFileSize < 1024 
        ? `${this.pdfFileSize} B` 
        : `${(this.pdfFileSize / 1024).toFixed(1)} KB`;
    }

    return {
      markdownLength,
      markdownTokens,
      pdfDirectTokens,
      tokensSaved,
      savingsPercentage,
      formattedFileSize
    };
  }

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

  selectTab(tab: ActiveTab): void {
    this.activeTab = tab;
    if (tab === 'preview') {
      setTimeout(() => this.renderIframeContent(), 50);
    }
  }

  applyChangesAndPreview(): void {
    this.extractThemeVariables();
    this.selectTab('preview');
  }

  toggleVisualEdit(): void {
    this.isVisualEditMode = !this.isVisualEditMode;
    this.applyVisualEditState();
  }

  onThemeConfigChange(newConfig: ThemeCustomizerConfig): void {
    this.themeConfig = newConfig;
    this.updateThemeStyles();
  }

  private applyVisualEditState(): void {
    const doc = this.iframeRef?.nativeElement?.contentDocument || this.iframeRef?.nativeElement?.contentWindow?.document;
    if (!doc) return;

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
    } else if (styleEl) {
      styleEl.remove();
    }

    const editableSelectors = 'h1, h2, h3, h4, h5, h6, p, a, button, li, span';
    const elements = doc.querySelectorAll<HTMLElement>(editableSelectors);

    elements.forEach((el) => {
      if (this.isVisualEditMode) {
        el.setAttribute('contenteditable', 'true');
        el.onblur = () => this.saveIframeHtmlToModel();
      } else {
        el.removeAttribute('contenteditable');
        el.onblur = null;
      }
    });

    if (!this.isVisualEditMode) {
      this.saveIframeHtmlToModel();
    }
  }

  private updateThemeStyles(): void {
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
          --primary: ${this.themeConfig.primaryColor} !important;
          --accent: ${this.themeConfig.accentColor} !important;
          --bg-main: ${this.themeConfig.bgColor} !important;
          --radius: ${this.themeConfig.borderRadius}px !important;
        }
      `;
    }
    this.saveIframeHtmlToModel();
  }

  private extractThemeVariables(): void {
    if (!this.editedHtml) return;

    const getVar = (varName: string, defaultVal: string): string => {
      const regex = new RegExp(`${varName}\\s*:\\s*([^;\\n}]+)`, 'i');
      const match = this.editedHtml.match(regex);
      return match ? match[1].trim() : defaultVal;
    };

    const radiusStr = getVar('--radius', '12px');
    const radiusMatch = radiusStr.match(/(\d+)/);

    this.themeConfig = {
      primaryColor: this.normalizeColor(getVar('--primary', '#8b5cf6')),
      accentColor: this.normalizeColor(getVar('--accent', '#06b6d4')),
      bgColor: this.normalizeColor(getVar('--bg-main', '#0f172a')),
      borderRadius: radiusMatch ? parseInt(radiusMatch[1], 10) : 12
    };
  }

  private normalizeColor(colorStr: string): string {
    const trimmed = colorStr.trim();
    if (trimmed.startsWith('#')) {
      if (trimmed.length === 4) {
        return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`;
      }
      return trimmed.slice(0, 7);
    }
    if (trimmed.startsWith('rgb')) {
      const match = trimmed.match(/\d+/g);
      if (match && match.length >= 3) {
        const r = parseInt(match[0], 10).toString(16).padStart(2, '0');
        const g = parseInt(match[1], 10).toString(16).padStart(2, '0');
        const b = parseInt(match[2], 10).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      }
    }
    return '#8b5cf6';
  }

  private saveIframeHtmlToModel(): void {
    const doc = this.iframeRef?.nativeElement?.contentDocument || this.iframeRef?.nativeElement?.contentWindow?.document;
    if (!doc) return;
    this.editedHtml = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
  }

  private getCleanHtml(htmlStr: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlStr, 'text/html');

    const styleEl = doc.getElementById('edit-mode-styles');
    if (styleEl) {
      styleEl.remove();
    }

    const editables = doc.querySelectorAll('[contenteditable]');
    editables.forEach((el) => {
      el.removeAttribute('contenteditable');
    });

    return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
  }

  private renderIframeContent(): void {
    if (this.iframeRef && this.iframeRef.nativeElement && this.editedHtml) {
      const iframe = this.iframeRef.nativeElement;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(this.editedHtml);
        doc.close();

        setTimeout(() => {
          this.applyVisualEditState();
        }, 50);
      }
    }
  }

  copyCode(): void {
    const textToCopy = this.activeTab === 'markdown' 
      ? this.markdownContent 
      : this.getCleanHtml(this.editedHtml || this.generatedHtml);

    navigator.clipboard.writeText(textToCopy).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }

  downloadHtml(): void {
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
