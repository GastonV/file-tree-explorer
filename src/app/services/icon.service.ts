import { Injectable } from '@angular/core';

/**
 * Professional icon resolution service.
 * Uses Angular Material icon names (ligatures) instead of emojis.
 * Easy to extend and keeps presentation logic out of components.
 */
@Injectable({ providedIn: 'root' })
export class IconService {
  private readonly folderIcon = 'folder';
  private readonly defaultFileIcon = 'insert_drive_file';

  // Extension → Material icon name mapping (professional, themeable)
  private readonly extensionIcons: Record<string, string> = {
    // Code
    ts: 'code',
    js: 'javascript',
    tsx: 'code',
    jsx: 'javascript',
    // Web
    html: 'html',
    css: 'css',
    scss: 'css',
    // Docs
    md: 'description',
    json: 'data_object',
    // Config / other common
    yml: 'settings',
    yaml: 'settings',
    xml: 'code',
    env: 'settings',
    gitignore: 'settings',
    // Default for images, etc.
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    svg: 'image',
    pdf: 'picture_as_pdf',
  };

  getFolderIcon(): string {
    return this.folderIcon;
  }

  getFileIcon(extension?: string): string {
    if (!extension) return this.defaultFileIcon;
    return this.extensionIcons[extension.toLowerCase()] || this.defaultFileIcon;
  }

  getToggleIcon(expanded: boolean): string {
    return expanded ? 'expand_more' : 'chevron_right';
  }
}
