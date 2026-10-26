export type ActiveTab = 'preview' | 'edit' | 'markdown';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export interface ThemeCustomizerConfig {
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  borderRadius: number;
}

export interface TokenSavingsStats {
  markdownLength: number;
  markdownTokens: number;
  pdfDirectTokens: number;
  tokensSaved: number;
  savingsPercentage: number;
  formattedFileSize: string;
}
