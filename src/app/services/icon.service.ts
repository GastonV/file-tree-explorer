import { Injectable } from '@angular/core';

/**
 * Professional icon resolution service.
 * Returns both icon name and suggested color for better visual distinction.
 */
@Injectable({ providedIn: 'root' })
export class IconService {
  private readonly folderIcon = 'folder';
  private readonly defaultFileIcon = 'insert_drive_file';

  private readonly extensionIcons: Record<string, { icon: string; color: string }> = {
    // Programming languages
    ts:   { icon: 'code',           color: '#3178c6' },   // TypeScript blue
    js:   { icon: 'javascript',     color: '#f7df1e' },   // JavaScript yellow
    tsx:  { icon: 'code',           color: '#3178c6' },
    jsx:  { icon: 'javascript',     color: '#f7df1e' },
    // Web
    html: { icon: 'html',           color: '#e34c26' },
    css:  { icon: 'css',            color: '#264de4' },
    scss: { icon: 'css',            color: '#c6538c' },
    // Documentation
    md:   { icon: 'description',    color: '#6e7681' },
    // Data / Config
    json: { icon: 'data_object',    color: '#f7df1e' },
    yml:  { icon: 'settings',       color: '#6e7681' },
    yaml: { icon: 'settings',       color: '#6e7681' },
    // Images
    png:  { icon: 'image',          color: '#4caf50' },
    jpg:  { icon: 'image',          color: '#4caf50' },
    jpeg: { icon: 'image',          color: '#4caf50' },
    svg:  { icon: 'image',          color: '#4caf50' },
    // Default
  };

  getFolderIcon(): { icon: string; color: string } {
    return { icon: this.folderIcon, color: '#f4b400' }; // Google yellow for folders
  }

  getFileIcon(extension?: string): { icon: string; color: string } {
    if (!extension) {
      return { icon: this.defaultFileIcon, color: '#6e7681' };
    }
    const ext = extension.toLowerCase();
    return this.extensionIcons[ext] || { icon: this.defaultFileIcon, color: '#6e7681' };
  }

  getToggleIcon(expanded: boolean): string {
    return expanded ? 'expand_more' : 'chevron_right';
  }
}
